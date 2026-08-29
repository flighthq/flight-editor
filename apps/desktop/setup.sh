#!/usr/bin/env bash
set -euo pipefail

check_rust() {
  if command -v rustc &>/dev/null; then
    echo "  rustc $(rustc --version | awk '{print $2}')"
  else
    echo "  rustc: NOT FOUND"
    echo "    Install: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    missing=1
  fi
}

check_linux() {
  local packages=(
    libwebkit2gtk-4.1-dev
    libgtk-3-dev
    libgdk-pixbuf2.0-dev
    libglib2.0-dev
    libappindicator3-dev
    librsvg2-dev
    patchelf
  )
  local to_install=()

  for pkg in "${packages[@]}"; do
    if dpkg -s "$pkg" &>/dev/null; then
      echo "  $pkg: installed"
    else
      echo "  $pkg: MISSING"
      to_install+=("$pkg")
    fi
  done

  if [ ${#to_install[@]} -gt 0 ]; then
    missing=1
    echo ""
    echo "Install missing packages:"
    echo "  sudo apt install ${to_install[*]}"

    if [ "${1:-}" = "--install" ]; then
      echo ""
      echo "Installing..."
      sudo apt install -y "${to_install[@]}"
    fi
  fi
}

check_macos() {
  if command -v xcodebuild &>/dev/null; then
    echo "  Xcode CLT: installed"
  else
    echo "  Xcode CLT: MISSING"
    echo "    Install: xcode-select --install"
    missing=1
  fi
  echo "  (macOS includes WebView natively — no extra packages needed)"
}

missing=0

echo "Tauri desktop prerequisites"
echo ""
echo "Rust toolchain:"
check_rust
echo ""

case "$(uname -s)" in
  Linux)
    echo "Linux system libraries:"
    check_linux "${1:-}"
    ;;
  Darwin)
    echo "macOS dependencies:"
    check_macos
    ;;
  MINGW*|MSYS*|CYGWIN*)
    echo "Windows: install WebView2 from https://developer.microsoft.com/en-us/microsoft-edge/webview2/"
    ;;
  *)
    echo "Unknown platform: $(uname -s)"
    ;;
esac

echo ""
if [ "$missing" -eq 0 ]; then
  echo "All prerequisites met. Run: npm run dev"
else
  echo "Some prerequisites are missing. See above."
fi
