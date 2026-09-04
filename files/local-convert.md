# Convert files locally, without uploading them

Every one-liner from NO. 047, on one page. Everything below runs on your own
machine. Nothing is uploaded anywhere.

Why local: in March 2025 the FBI's Denver field office warned that free
online file-converter sites were being used to install malware and to
scrape uploaded documents, so treat a random converter site the way you
would treat a random download.

Windows-first below (PowerShell / Windows Terminal). A Mac note follows
anywhere the syntax differs.

---

## Install

**Windows** (PowerShell or Windows Terminal — press Windows+R, type `wt`,
press Enter):

```
winget install ImageMagick.ImageMagick
```

**Mac** (Terminal, with Homebrew installed):

```
brew install imagemagick
```

This installs ImageMagick, an open-source tool that converts a wide range
of image and PDF formats locally. For the video, audio and document
commands further down you also need `ffmpeg` and `pandoc` — install lines
are next to each section.

---

## Images and PDFs (ImageMagick, `magick`)

The pattern is always `magick <input> <output>` — the extensions tell
ImageMagick what to do.

**JPG to PDF**

```
magick photo.jpg photo.pdf
```

**Several JPGs into one PDF**

```
magick photo1.jpg photo2.jpg photo3.jpg combined.pdf
```

**PDF to JPG** — this direction needs Ghostscript installed separately;
ImageMagick can write a PDF on its own but reading one back into an image
needs Ghostscript as a helper. Not verified working on a plain Windows
install: on this machine, without Ghostscript on PATH, the command below
failed with `FailedToExecuteCommand gswin64c.exe`. Install Ghostscript
first if you need this direction.

```
magick document.pdf page.jpg
```

**PNG to JPG** (or the reverse — same pattern)

```
magick image.png image.jpg
```

**Resize and compress an image**

```
magick photo.jpg -resize 50% -quality 80 photo-small.jpg
```

`-resize 50%` halves the dimensions; `-quality 80` sets JPG compression
(0 to 100, lower is smaller and softer).

**HEIC to JPG** — not verified on Windows. HEIC is the format iPhones save
photos in. On this machine ImageMagick can read HEIC files but has no
HEIC-writing component installed, and there was no way to test the read
side without a real iPhone HEIC file on hand. The command to try is the
same pattern as above:

```
magick photo.heic photo.jpg
```

If it fails with a delegate or codec error, you're missing the HEIC
read/write library your ImageMagick build needs — search for "ImageMagick
HEIC delegate windows" for the current fix, since this changes with
ImageMagick versions.

---

## Video and audio (ffmpeg)

**Windows**

```
winget install Gyan.FFmpeg
```

**Mac**

```
brew install ffmpeg
```

**MP4 to GIF**

```
ffmpeg -i clip.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" clip.gif
```

`fps=10` keeps the file size down; `scale=320:-1` sets the width to 320px
and keeps the aspect ratio.

**MP4 to MP3** (pull the audio track out of a video)

```
ffmpeg -i clip.mp4 -vn -acodec libmp3lame -q:a 2 clip.mp3
```

`-vn` drops the video stream; `-q:a 2` is a good-quality variable bitrate
(0 is highest quality, 9 is lowest).

---

## Documents (pandoc)

**Windows**

```
winget install --id JohnMacFarlane.Pandoc
```

**Mac**

```
brew install pandoc
```

**DOCX to Markdown**

```
pandoc document.docx -o document.md
```

**DOCX to PDF** — pandoc does not render PDFs itself; it hands the job to
a separate PDF engine (a LaTeX distribution such as MiKTeX or TinyTeX).
Verified working on this machine, but only because a LaTeX engine was
already installed here. On a fresh Windows machine this command will
likely fail until you install one — pandoc's own error message names
what's missing. The command itself is:

```
pandoc document.docx -o document.pdf
```

---

## Let Claude Code write the loop for you

Once ImageMagick is installed, you can hand the batch part to Claude Code
instead of writing it yourself. In a terminal, inside the folder with your
files, say:

```
claude "convert every jpg in this folder to pdf"
```

On 2026-09-04 that produced this loop (bash / Git Bash syntax — this is
what Claude Code writes when it's running in a bash-style shell, which on
Windows means Git Bash or WSL):

```bash
for f in *.jpg; do magick "$f" "${f%.jpg}.pdf"; done
```

If you're working directly in plain PowerShell instead of Git Bash, the
same batch job looks like this:

```powershell
Get-ChildItem *.jpg | ForEach-Object { magick $_.Name ($_.BaseName + ".pdf") }
```

Both were run and verified against a folder of test JPGs on 2026-09-04.

---

*NO. 047 — vektor — The AI frontier, cut to what ships — @vektor.fm*
