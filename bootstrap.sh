#!/usr/bin/env bash
set -e

echo "┌  Bootstrap script starting"
echo "│"

echo "◇  Checking curl"
if ! command -v curl >/dev/null 2>&1; then
  echo "│ curl is required"
  echo "└  Setup failed"
  exit 1
else
  echo "│   curl already installed ($(curl --version | head -n 1)), skipping"
fi

echo "│"
echo "◇  Checking Node.js"
if ! command -v node >/dev/null 2>&1; then
  echo "◒  Node.js not found, installing via system package manager"
  if command -v apt >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y nodejs npm
  elif command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nodejs
  elif command -v pacman >/dev/null 2>&1; then
    sudo pacman -Sy --noconfirm nodejs npm
  else
    echo "│  Unsupported package manager"
    echo "└  Setup failed"
    exit 1
  fi
  echo "│   Node.js installed ($(node -v))"
else
  echo "│   Node.js already installed ($(node -v)), skipping"
fi

echo "│"
echo "◇  Installing dependencies"
npm add @clack/prompts picocolors execa  > /dev/null 2>&1

echo "│"
echo "└  Bootstrap script complete"

sudo node installer.mjs
