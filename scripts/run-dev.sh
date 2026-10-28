#!/usr/bin/env bash
# Windows children need native process ownership, rather than MSYS PID mapping.
set -euo pipefail
case "$OSTYPE" in
    msys*|cygwin*)
        exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/run-dev.ps1 "$@"
        ;;
esac
set -m

pids=()
cleanup() {
    trap '' INT TERM
    local pid
    for pid in "${pids[@]}"; do
        kill -TERM -- "-$pid" 2>/dev/null || true
    done
    wait || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

cargo run --locked --features catalog --bin catalog -- serve "$@" &
pids+=("$!")
wait -n
