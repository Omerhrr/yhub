#!/usr/bin/env bash
# Loop wget with continue until file is complete
set -u
URL="https://cdn.npmmirror.com/packages/next/16.1.1/next-16.1.1.tgz"
OUT="/tmp/next.tgz"
EXPECTED_SIZE=30653457

for attempt in $(seq 1 500); do
  SIZE=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
  if [ "$SIZE" -ge "$EXPECTED_SIZE" ]; then
    echo "DONE at attempt $attempt"
    exit 0
  fi
  echo "[$attempt] size=$SIZE / $EXPECTED_SIZE, retrying wget..."
  wget --tries=3 --timeout=30 --waitretry=1 --continue --retry-connrefused \
    -O "$OUT" \
    "$URL" >> /tmp/wget-loop.log 2>&1
  sleep 1
done
echo "Max attempts reached"
exit 1
