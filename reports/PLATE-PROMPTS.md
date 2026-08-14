# Card plate prompts — ready to paste
22 plates, one per issue the site renders a card for. Generate at 3:2, largest
size the free tier allows.
**Workflow**
1. Paste a block below into the image model. One block = one finished prompt;
   nothing to assemble.
2. Save the result into `plates-src/` named with the issue number — `026.png`,
   `no-031.jpg`, `024-v2.webp` all work. Newest file wins per issue.
3. Run `node ingest-plates.mjs`. It crops to 3:2 and writes both variants the
   site serves, then tells you which issues are still missing.
`node ingest-plates.mjs --check` reports coverage without writing.

**Why two variants:** cards render at 350x233. Serving full-size plates into 24
cards cost 18.9 MB in testing; the card variants cost 66 KB. Measured, not estimated.

---

## Reject and regenerate if
1. **Any legible text, letterform or UI.** This is what killed four rounds of the
   slit-scan pipeline — round 1 output contained readable headlines and an entire
   news article. Check at full size, not as a thumbnail.
2. **No calm region** — at 22 tiles a busy grid becomes noise.
3. **Flat fill or a single hue** — target mean saturation 0.26–0.45.
4. **No true black or no clean highlight** — the references run luminance 0–255;
   a plate topping out at 190 looks muddy beside them.
5. **Visible tiling or a repeated pattern** — reads as wallpaper.

When all 22 exist, view them as a contact sheet. They should look like one
photographer's series. If one jumps out, regenerate that one — never adjust the
others, the style block is the constant.

---

### no-026 — The State File

```
Vertical slit-scan light bands, cream through amber into deep navy, one warm mass dissolving at the centre. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-031 — Tax the Agents

```
Two tall soft-edged light columns glowing orange to white on a near-black field, heavy grain. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-030 — The Council

```
Five nested translucent ribbons curving through a shallow arc, iridescent mint into periwinkle. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-024 — The Mirror

```
A single sheet of rippled glass catching a cool light, deep blue falling to pale cream. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-023 — The Design Stack

```
Stacked translucent planes seen edge-on, warm grey into soft coral. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-022 — The Humanizer

```
A radial fan of tapered blades, cobalt at the base resolving to pale yellow-green tips. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-021 — The Open-Source Nine

```
Nine parallel light rods receding into defocus, cool teal to warm bone. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-020 — Subagents

```
Four soft lozenges of light at different depths, one sharp and three falling out of focus. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-019 — The Academy

```
A long shallow curve of brushed light, graphite into pale gold. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-018 — Bottle the Brain

```
A single glass vessel form dissolving into its own refraction, cool green to cream. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-017 — AI vs the Final

```
Two opposing light arcs meeting off-centre, deep green into warm white. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-015 — Loops

```
One continuous ribbon looping back on itself, soft lilac into mint. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-013 — Agents

```
A cluster of small bright forms scattered across a large dark empty field. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-012 — Git Hygiene

```
Parallel diagonal strata, slate into warm sand, sharply cropped at the right edge. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-011 — The Rules Part 2

```
A folded plane of light, cool cyan falling into deep indigo shadow. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-010 — The Rules

```
A single hard-edged wedge of light entering a dark frame from the lower left. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-009 — The Carousel

```
Repeating curved slats in shallow rotation, warm peach into ice blue. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-008 — The Leak

```
A dense field dissolving at one edge into empty black, amber core. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-007 — The Port

```
A long horizontal smear of light with crisp vertical boundaries, cream to cobalt. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-006 — The File

```
One solid monolithic form lit from a single side, near-black with a bright rim. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-005 — Four Rules

```
Four vertical light columns of uneven width, warm to cool across the frame. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

### no-004 — Five Skills

```
Five tapered blades radiating from an origin below the frame, teal into pale gold. Abstract editorial hero artwork, 3:2 landscape. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Real optical behaviour: genuine depth of field, sharp focus in one region falling to heavy defocus at one edge, fine film grain throughout, soft lens falloff. A continuous directional colour journey across the frame, never a flat fill and never a simple two-stop gradient. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge so the form continues beyond it. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO interface, NO charts, NO people, NO product shots.
```

---

# CORRECTED RECIPE — 2026-08-09

**The colour rule above is wrong and produced off-set plates.** It was written as
"teal and amber", a two-colour scheme. Judged against the plates that actually
work: in `019` the green is a **shadow tint** — the dark side is a desaturated
green-black, not a green subject — and `031` contains no green at all.

The real rule is:

> **Warm light, cool-green shadows, black ground.**
> Teal is what the darks are made of, never a second subject colour.

The set tolerates a wide range of intensity — `031` is the extreme end (pure
black field, blown white core, hot orange corona, heavy grain) and `019` the
quiet end (gold rather than orange, fine texture, little grain). Both read as
the same photographer. Aim between them.

## What happened to the four off-set plates

| Plate | Action | Why |
|---|---|---|
| `024` | **Graded, kept** | Tone curve only. Now among the best in the set — true black, cream-gold hot edge, teal rim. No damage: gradients clean, glass texture intact. |
| `023` | **Graded + desaturated, kept** | Curve swung the hue past amber into scarlet and left a maroon cast on the dark panel. Saturation pulled 0.867 to 0.721. Loud but seated. |
| `022` | **Left alone** | Not a tonal outlier (mean 100.4, below `004` and `009`). Its problems are busyness and chartreuse hue — a grade cannot fix either. |
| `015` | **Regenerate** | Unsalvageable by grading, and the grade made it worse. |

### Why `015` could not be graded

85% of the frame is a featureless white cyclorama lit by a large soft source
with a **soft** cast shadow. There is no dark region anywhere in the source to
pull to black, so any curve that darkens the subject darkens the backdrop
equally — and a darkened white backdrop is grey, never black. The solver hit its
gamma ceiling of 4.0 and still landed at mean 108 against a target of 82: not a
weak curve, an impossible ask. Gamma that steep then amplified the noise floor
of the flat wall into visible magenta-green mottling.

**The tell, for next time: a plate with no true black in the source cannot be
graded into the set. Check `p1` before reaching for a curve.**

## Prompts still to run

`015`, `026` and `030`. Each is the subject line plus the corrected style block.

### no-015 — Loops

```
One continuous ribbon looping back on itself, lit by a single hard raking light from the left, its outer face catching a warm amber-to-white highlight while the interior falls into cool green-black shadow. Abstract editorial hero artwork, 3:2 landscape. Warm light — amber through to a white-hot core — raking in from one side; the shadows are a cool desaturated green-black; the ground is true black. Teal appears ONLY as the colour of the darks, never as a subject. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Genuine depth of field — one region crisply in focus with resolved fine detail, falling away to heavy defocus at one edge. Not an all-soft bokeh study. Fine film grain throughout. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO charts, NO people, NO product shots.
```

### no-026 — The State File

```
Vertical slit-scan light bands falling across a dark field, one warm amber mass dissolving at the centre into a white-hot core, the surrounding bands cooling to green-black. Abstract editorial hero artwork, 3:2 landscape. Warm light — amber through to a white-hot core — raking in from one side; the shadows are a cool desaturated green-black; the ground is true black. Teal appears ONLY as the colour of the darks, never as a subject. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Genuine depth of field — one region crisply in focus with resolved fine detail, falling away to heavy defocus at one edge. Not an all-soft bokeh study. Fine film grain throughout. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO charts, NO people, NO product shots.
```

### no-030 — The Council

```
Five nested translucent ribbons curving through a shallow arc, the near edges catching a hard amber highlight, the recesses between them falling to cool green-black. Abstract editorial hero artwork, 3:2 landscape. Warm light — amber through to a white-hot core — raking in from one side; the shadows are a cool desaturated green-black; the ground is true black. Teal appears ONLY as the colour of the darks, never as a subject. ONE single clear form with large calm negative space around it — at least 40% of the frame is quiet, uninterrupted field. Genuine depth of field — one region crisply in focus with resolved fine detail, falling away to heavy defocus at one edge. Not an all-soft bokeh study. Fine film grain throughout. Deep true blacks and clean bright highlights in the same frame. Composition deliberately off-centre and cropped by at least one edge. NO text, NO letters, NO numbers, NO logos, NO watermark, NO UI, NO charts, NO people, NO product shots.
```

## If generating on Gemini (free tier)

Nano Banana stamps a **Google sparkle watermark** into the lower-right of every
output, at roughly 91% x 86% of the frame. It is opaque and vector-crisp, so it
survives downscaling and is legible on a card. Crop it out before ingesting:
take the top-left 88% x 84% of the frame, then re-crop to 3:2. `ingest-plates.mjs`
handles the 3:2 crop; the watermark crop must happen first — `dewatermark.mjs`.
