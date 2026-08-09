#!/usr/bin/env bash
set -euo pipefail
# Simple gallery asset generator:
# - reads images from assets/gallery/originals
# - writes resized JPGs to assets/gallery with suffixes -400/-800/-1200/-1600
# - generates a WebP for the 1600px file

mkdir -p assets/gallery

shopt -s nullglob
for src in assets/gallery/originals/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  [ -f "$src" ] || continue
  name=$(basename "$src")
  base="${name%.*}"
  echo "Processing: $name"
  # 1600
  magick "$src" -strip -quality 82 -resize 1600x "assets/gallery/${base}-1600.jpg"
  # 1200
  magick "$src" -strip -quality 78 -resize 1200x "assets/gallery/${base}-1200.jpg"
  # 800
  magick "$src" -strip -quality 74 -resize 800x "assets/gallery/${base}-800.jpg"
  # 400
  magick "$src" -strip -quality 70 -resize 400x "assets/gallery/${base}-400.jpg"

  # WebP (from largest JPG)
  if command -v cwebp >/dev/null 2>&1; then
    cwebp -q 80 "assets/gallery/${base}-1600.jpg" -o "assets/gallery/${base}-1600.webp" >/dev/null 2>&1 || true
  fi
done

echo "Done. Generated files in assets/gallery/. Update index.html gallery items to point to the generated files." 
