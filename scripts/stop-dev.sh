#!/usr/bin/env bash
set -euo pipefail

case "$OSTYPE" in
    msys*|cygwin*)
        # Bacon passes a Windows PID, not an MSYS PID. Stop the complete native
        # tree and wait before allowing Bacon to restart or quit.
        exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/stop-dev.ps1 "$1"
        ;;
    *) kill -s INT "$1" ;;
esac
