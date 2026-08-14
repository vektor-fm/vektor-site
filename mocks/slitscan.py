#!/usr/bin/env python3
"""
slitscan.py — build slit-scan / strip-photography plates from a video.

Reference 1 in the founder's set is exactly this: one narrow column of pixels
taken from each successive frame, laid side by side. Static parts of the shot
become long horizontal smears; anything that moves turns into a hard vertical
band. It cannot be faked with gradients, because the structure comes out of the
footage's own motion.

Modes:
  displace  output column x reads column x of frame x — classic time
            displacement. Keeps the shot's composition, shears it through time.
  strip     every output column is the SAME source column, one per frame.
            True photo-finish. Static content smears horizontally; cuts become
            hard vertical edges.
  sweep     the sampled column travels across the frame slower than the output
            advances, so the scene is scanned several times — the woven read.

Speed: ffmpeg does the thinning (select) and the downscale before anything is
piped to Python, so a 3800-frame 1080x1920 clip costs seconds, not minutes.

Usage:
  python slitscan.py <video> <out.png> [--mode displace|strip|sweep]
                     [--width 1800] [--height 1200] [--col 0.5]
                     [--start 0] [--end 1] [--blur 0] [--decode-h 720]
"""
import argparse, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter


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


def build(path, mode, out_w, out_h, col_frac, start_frac, end_frac, blur, decode_h):
    src_w, src_h, n_total = probe(path)
    lo = int(n_total * start_frac)
    hi = min(n_total, max(lo + 2, int(n_total * end_frac)))
    span = hi - lo
    if span < 2:
        sys.exit(f"not enough frames in range: {span}")

    # decode small: ffmpeg thins and scales before anything reaches Python
    stride = max(1, span // out_w)
    dh = min(decode_h, src_h)
    dw = int(round(src_w * dh / src_h / 2)) * 2

    vf = (f"select='between(n\\,{lo}\\,{hi-1})*not(mod(n-{lo}\\,{stride}))',"
          f"scale={dw}:{dh}")
    proc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-vsync", "0",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE, bufsize=1 << 26)

    fsize = dw * dh * 3
    canvas = np.zeros((dh, out_w, 3), np.uint8)
    filled = np.zeros(out_w, bool)

    x = 0
    try:
        while x < out_w:
            buf = proc.stdout.read(fsize)
            if len(buf) < fsize:
                break
            frame = np.frombuffer(buf, np.uint8).reshape(dh, dw, 3)

            if mode == "displace":
                sx = int(x / max(out_w - 1, 1) * (dw - 1))
            elif mode == "strip":
                sx = int(col_frac * (dw - 1))
            else:  # sweep — scan the frame ~3 times across the plate
                sx = int(((x * 3.0 / out_w) % 1.0) * (dw - 1))

            canvas[:, x] = frame[:, sx]
            filled[x] = True
            x += 1
    finally:
        proc.stdout.close()
        proc.wait()

    if not filled.any():
        sys.exit("no frames decoded")

    # short clip: repeat the last real column rather than leaving black
    if not filled.all():
        last = 0
        for i in range(out_w):
            if filled[i]:
                last = i
            else:
                canvas[:, i] = canvas[:, last]

    img = Image.fromarray(canvas).resize((out_w, out_h), Image.LANCZOS)
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    return img, filled.sum()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("out")
    ap.add_argument("--mode", default="displace", choices=["displace", "strip", "sweep"])
    ap.add_argument("--width", type=int, default=1800)
    ap.add_argument("--height", type=int, default=1200)
    ap.add_argument("--col", type=float, default=0.5)
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=1.0)
    ap.add_argument("--blur", type=float, default=0.0)
    ap.add_argument("--decode-h", type=int, default=720)
    a = ap.parse_args()
    im, cols = build(a.video, a.mode, a.width, a.height, a.col,
                     a.start, a.end, a.blur, a.decode_h)
    im.save(a.out)
    print(f"{a.out}  {im.size[0]}x{im.size[1]}  mode={a.mode}  real_columns={cols}")
