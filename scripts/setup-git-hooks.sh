#!/usr/bin/env bash
# Install ValueBite git hooks (pre-commit secret scanner)
# Run once after cloning: bash scripts/setup-git-hooks.sh

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_SRC="$REPO_ROOT/scripts/git-hooks"
HOOKS_DST="$REPO_ROOT/.git/hooks"

if [ ! -d "$HOOKS_SRC" ]; then
  echo "Error: $HOOKS_SRC not found"
  exit 1
fi

mkdir -p "$HOOKS_DST"

for HOOK in "$HOOKS_SRC"/*; do
  NAME=$(basename "$HOOK")
  ln -sf "$HOOKS_SRC/$NAME" "$HOOKS_DST/$NAME"
  chmod +x "$HOOKS_SRC/$NAME"
  echo "  installed: $NAME"
done

echo
echo "✓ Git hooks installed."
echo "  pre-commit: scans staged files for common secret patterns (Google API, Anthropic, OpenAI, GitHub tokens, JWTs, AWS keys, DB URLs)."
echo "  Bypass (NOT recommended): git commit --no-verify"
