#!/usr/bin/env python3
"""
plate.py — turn a film into an abstract optical plate.

Round 1 (slitscan.py, raw) failed for a specific, diagnosable reason: vektor's
films are typographic with long static holds. One column per frame only makes a
1px slit if the frame CHANGES; across a 5-second hold you get 150 identical
columns, i.e. an intact slice of poster. The judge could read headlines, bullet
lists and a whole news article out of the output.

Two fixes, both here:

  1. MOTION GATING. Score every frame by how much it differs from the last, and
     draw columns only from frames above a motion threshold. Holds contribute
     nothing; transitions, wipes and scrambles contribute everything. That is
     where the film actually behaves like a moving image.

  2. AN OPTICAL STAGE. What separates the reference images from a screenshot is
     not colour, it is lens behaviour: directional defocus, a depth-of-field
     ramp across the frame, a grain floor, a controlled value range, and a
     continuous hue journey rather than two flat brand colours. None of that
     survives being drawn; it has to be applied.

Pipeline: decode small -> score motion -> slit-scan at 2x -> directional blur
-> graduated defocus -> grade -> clamp highlights -> grain -> downsample.

Usage:
  python plate.py <video> <out.png>
      [--width 1500] [--height 1000]
      [--mode displace|strip|sweep]
      [--motion 0.55]        fraction of frames rejected as too static
      [--blur-x 30]          directional blur along X, px (at 2x)
      [--dof 60]             max graduated defocus at the soft edge, px (at 2x)
      [--dof-dir l|r]        which edge goes soft
      [--shadow 0E1A16] [--highlight EFE7DA]
      [--ramp-a 1E2B4C] [--ramp-b 6E4A2A] [--ramp 0.18]
      [--sat 0.42] [--clamp 0.92] [--grain 0.04]
"""
import argparse, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter


# ----------------------------------------------------------------- helpers
def hex2rgb(s):
    s = s.lstrip("#")
    return np.array([int(s[i:i + 2], 16) for i in (0, 2, 4)], np.float32)


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,nb_frames,duration",
         "-of", "default=nw=1:nk=0", path],
        capture_output=True, text=True, check=True).stdout
    d = {}
    for line in out.strip().splitlines():
        k, _, v = line.partition("=")
        d[k] = v
    w, h = int(d["width"]), int(d["height"])
    try:
        n = int(d["nb_frames"])
    except (KeyError, ValueError):
        n = int(float(d.get("duration", "0")) * 30)
    return w, h, n


def decode(path, stride, dh):
    """Yield frames, thinned and downscaled by ffmpeg before they reach us."""
    src_w, src_h, _ = probe(path)
    dh = min(dh, src_h)
    dw = int(round(src_w * dh / src_h / 2)) * 2
    vf = f"select='not(mod(n\\,{stride}))',scale={dw}:{dh}"
    p = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-vsync", "0",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE, bufsize=1 << 26)
    fsize = dw * dh * 3
    try:
        while True:
            buf = p.stdout.read(fsize)
            if len(buf) < fsize:
                break
            yield np.frombuffer(buf, np.uint8).reshape(dh, dw, 3)
    finally:
        p.stdout.close()
        p.wait()


# ------------------------------------------------------------ slit-scan
def scan(path, mode, out_w, motion_drop, decode_h):
    _, _, n = probe(path)
    stride = max(1, n // (out_w * 3))          # oversample, we discard holds

    frames = []
    scores = []
    prev = None
    for f in decode(path, stride, decode_h):
        small = f[::4, ::4].astype(np.int16)   # cheap motion proxy
        s = 0.0 if prev is None else float(np.abs(small - prev).mean())
        prev = small
        frames.append(f)
        scores.append(s)
        if len(frames) > out_w * 3:
            break

    if len(frames) < 8:
        sys.exit(f"too few frames decoded ({len(frames)})")

    scores = np.array(scores)
    # MOTION GATING — keep only the most-changing frames
    keep = np.argsort(scores)[int(len(scores) * motion_drop):]
    keep = np.sort(keep)
    if len(keep) < 16:
        keep = np.arange(len(frames))

    dh, dw = frames[0].shape[:2]
    canvas = np.zeros((dh, out_w, 3), np.uint8)
    pick = np.linspace(0, len(keep) - 1, out_w).astype(int)

    for x in range(out_w):
        fr = frames[keep[pick[x]]]
        if mode == "displace":
            sx = int(x / max(out_w - 1, 1) * (dw - 1))
        elif mode == "strip":
            sx = dw // 2
        else:
            sx = int(((x * 3.0 / out_w) % 1.0) * (dw - 1))
        canvas[:, x] = fr[:, sx]

    return canvas, float(scores.mean()), len(keep)


# --------------------------------------------------------------- optics
def banded_smear(arr, seed, bmin, bmax, mix):
    """
    The thing round 2 missed.

    Reference 115948 is not a defocused photograph. It is a set of vertical
    bands, each one smeared flat along X, with the boundaries BETWEEN bands
    left perfectly crisp. That anisotropy — violent softness in one axis,
    hard definition in the other — is the whole effect. Its fine-detail
    energy measures ~14; a globally blurred plate measures ~1.

    So: cut the frame into bands of uneven width, flatten each band along X
    towards its own mean column, and never let one band bleed into its
    neighbour. Vertical structure inside a band survives untouched, which is
    what keeps the result looking like light rather than like a gradient.
    """
    h, w = arr.shape[:2]
    rng = np.random.default_rng(seed)
    out = arr.copy()
    x = 0
    while x < w:
        bw = int(rng.integers(bmin, bmax + 1))
        x1 = min(x + bw, w)
        band = arr[:, x:x1]
        col = band.mean(axis=1, keepdims=True)          # one vertical streak
        out[:, x:x1] = band * (1.0 - mix) + col * mix
        x = x1
    return out


def graduated_defocus(img, max_px, direction):
    """Blend progressively blurrier copies so one edge falls out of focus."""
    if max_px <= 0:
        return img
    levels = 5
    blurs = [img] + [img.filter(ImageFilter.GaussianBlur(max_px * (i + 1) / levels))
                     for i in range(levels)]
    w, h = img.size
    ramp = np.linspace(0.0, 1.0, w, dtype=np.float32)
    if direction == "l":
        ramp = ramp[::-1]
    ramp = np.tile(ramp, (h, 1))

    arrs = [np.asarray(b, np.float32) for b in blurs]
    out = np.zeros_like(arrs[0])
    pos = ramp * levels
    for i in range(levels + 1):
        wgt = np.clip(1.0 - np.abs(pos - i), 0.0, 1.0)[..., None]
        out += arrs[i] * wgt
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def grade(arr, shadow, highlight, ramp_a, ramp_b, ramp_amt, sat, clamp_hi):
    a = arr.astype(np.float32) / 255.0
    lum = (a * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1, keepdims=True)

    # desaturate toward luminance, then remap the value range between two tints
    a = lum + (a - lum) * sat
    lum = (a * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1, keepdims=True)
    lum = (lum - lum.min()) / max(lum.max() - lum.min(), 1e-6)
    a = (shadow / 255.0) + lum * ((highlight - shadow) / 255.0) + (a - lum) * 0.75

    # a real hue journey across the frame, which none of round 1 had
    h, w = a.shape[:2]
    t = np.linspace(0.0, 1.0, w, dtype=np.float32)[None, :, None]
    tint = (ramp_a / 255.0) * (1 - t) + (ramp_b / 255.0) * t
    a = a * (1 - ramp_amt) + (a * 0.35 + tint * 0.65) * ramp_amt

    return np.clip(a, 0.0, clamp_hi)


def add_grain(a, amount):
    if amount <= 0:
        return a
    h, w = a.shape[:2]
    mono = np.random.normal(0, amount, (h, w, 1)).astype(np.float32)
    chroma = np.random.normal(0, amount * 0.25, (h, w, 3)).astype(np.float32)
    return np.clip(a + mono + chroma, 0.0, 1.0)


# ----------------------------------------------------------------- main
def main():
    p = argparse.ArgumentParser()
    p.add_argument("video"); p.add_argument("out")
    p.add_argument("--width", type=int, default=1500)
    p.add_argument("--height", type=int, default=1000)
    p.add_argument("--mode", default="displace", choices=["displace", "strip", "sweep"])
    p.add_argument("--motion", type=float, default=0.55)
    p.add_argument("--blur-x", type=float, default=150)
    p.add_argument("--blur-y", type=float, default=1.5)
    p.add_argument("--band-min", type=int, default=6)
    p.add_argument("--band-max", type=int, default=34)
    p.add_argument("--band-mix", type=float, default=0.85)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--dof", type=float, default=0)
    p.add_argument("--dof-dir", default="l", choices=["l", "r"])
    p.add_argument("--shadow", default="0E1A16")
    p.add_argument("--highlight", default="EFE7DA")
    p.add_argument("--ramp-a", default="1E2B4C")
    p.add_argument("--ramp-b", default="6E4A2A")
    p.add_argument("--ramp", type=float, default=0.55)
    p.add_argument("--sat", type=float, default=0.34)
    p.add_argument("--clamp", type=float, default=0.99)
    p.add_argument("--grain", type=float, default=0.04)
    p.add_argument("--decode-h", type=int, default=520)
    a = p.parse_args()

    SS = 2                                   # supersample, downsampled at the end
    globals()["SS"] = SS
    W, H = a.width * SS, a.height * SS

    canvas, motion, kept = scan(a.video, a.mode, W, a.motion, a.decode_h)
    img = Image.fromarray(canvas).resize((W, H), Image.LANCZOS)

    # PURELY horizontal smear. No isotropic Gaussian: round 2 ran one at
    # 0.55x alongside this and the two together produced uniform mush, which
    # is exactly what made the plates read as blurry screenshots.
    if a.blur_x > 0:
        arr = np.asarray(img, np.float32)
        k = max(3, int(a.blur_x * SS) | 1)
        pad = np.pad(arr, ((0, 0), (k // 2, k // 2), (0, 0)), mode="edge")
        cs = np.cumsum(pad, axis=1, dtype=np.float64)
        acc = (cs[:, k:] - cs[:, :-k]) / k          # O(1) box blur per pixel
        img = Image.fromarray(np.clip(acc, 0, 255).astype(np.uint8))

    # gentle vertical softening only — keeps the axes asymmetric
    if a.blur_y > 0:
        img = img.filter(ImageFilter.GaussianBlur(a.blur_y * SS))

    # crisp-edged banding, applied AFTER the smear so boundaries stay hard
    if a.band_mix > 0:
        arr = banded_smear(np.asarray(img, np.float32), a.seed,
                           int(a.band_min * SS), int(a.band_max * SS), a.band_mix)
        img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

    img = graduated_defocus(img, a.dof, a.dof_dir)

    out = grade(np.asarray(img), hex2rgb(a.shadow), hex2rgb(a.highlight),
                hex2rgb(a.ramp_a), hex2rgb(a.ramp_b), a.ramp, a.sat, a.clamp)
    out = add_grain(out, a.grain)

    final = Image.fromarray((out * 255).astype(np.uint8)).resize(
        (a.width, a.height), Image.LANCZOS)
    final.save(a.out)
    print(f"{a.out}  {a.width}x{a.height}  mode={a.mode}  "
          f"frames_kept={kept}  mean_motion={motion:.2f}")


if __name__ == "__main__":
    main()
