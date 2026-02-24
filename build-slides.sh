#!/usr/bin/env bash

set -e

SOURCE_DIR="./content"
OUTPUT_DIR="./dist"

# Clean and prepare output
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "🎞️ Generating all slides from '$SOURCE_DIR'..."

# Generate all HTML slides in-place under content/
npx @marp-team/marp-cli@latest "$SOURCE_DIR/**/*.md"

# Move generated .html files into dist/
find "$SOURCE_DIR" -type f -name "*.html" | while IFS= read -r htmlfile; do
  # relpath e.g. "talks/oop.html" or "index.html" or "lectures/index.html"
  relpath="${htmlfile#"$SOURCE_DIR"/}"
  dir="$(dirname "$relpath")"           # e.g. "talks" or "." for root
  base="$(basename "$relpath")"         # e.g. "oop.html"
  name="${base%.html}"                  # e.g. "oop" or "index"

  # normalize dir: if it's "." then make it empty
  if [ "$dir" = "." ]; then
    dir=""
  fi

  if [ "$name" = "index" ]; then
    # keep index in the same directory inside dist
    if [ -n "$dir" ]; then
      outdir="$OUTPUT_DIR/$dir"
    else
      outdir="$OUTPUT_DIR"
    fi
  else
    # create directory dist/<dir>/<name>/ and move there as index.html
    if [ -n "$dir" ]; then
      outdir="$OUTPUT_DIR/$dir/$name"
    else
      outdir="$OUTPUT_DIR/$name"
    fi
  fi

  mkdir -p "$outdir"
  echo "🧩 Moving: $htmlfile → $outdir/index.html"
  mv -f "$htmlfile" "$outdir/index.html"
done

echo "✅ All slides built successfully in '$OUTPUT_DIR'"