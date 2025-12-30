#!/usr/bin/env bash
set -e

echo "[1/4] Checking curl"
if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required"
  exit 1
fi

echo "[2/4] Checking Node.js"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found, installing via system package manager"

  if command -v apt >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y nodejs npm
  elif command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nodejs
  elif command -v pacman >/dev/null 2>&1; then
    sudo pacman -Sy --noconfirm nodejs npm
  else
    echo "Unsupported package manager"
    exit 1
  fi
else
  echo "Node.js already installed ($(node -v))"
fi

echo "[3/4] Installing pnpm (via Corepack)"
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@latest --activate
else
  echo "pnpm already installed ($(pnpm -v))"
fi

echo "Installing dependencies"
pnpm add @clack/prompts picocolors execa

echo "[4/4] Running interactive installer"
sudo node installer.mjs
