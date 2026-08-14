#!/usr/bin/env python3
"""Rebuild the caps-only Printvetica webfont (gitignored — see mocks/.gitignore).

Full web build is 739 KB; full-ASCII subset 332 KB; caps-only 200 KB. Caps-only
is the only viable form, and it works because every heading and label in this
design is uppercase. Never use Printvetica for body copy.
"""
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
import os, sys

SRC = r"C:/Users/julia/projects/reel-engine/assets/fonts/printvetica-400.otf"
OUT = os.path.join(os.path.dirname(__file__), "fonts", "printvetica-caps.woff2")
CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,:;!?/-–—·&%'’→()"

if not os.path.exists(SRC):
    sys.exit(f"source font not found: {SRC}")
f = TTFont(SRC)
o = Options(); o.layout_features = ["*"]; o.notdef_outline = True
s = Subsetter(options=o); s.populate(text=CHARS); s.subset(f)
f.flavor = "woff2"; f.save(OUT)
print(f"{OUT}  {os.path.getsize(OUT)} bytes")
