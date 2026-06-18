#!/usr/bin/env bash
# Robust download with infinite retries per chunk
set -u
URL="https://registry.npmjs.org/next/-/next-16.1.1.tgz"
OUT="/tmp/next.tgz"
EXPECTED_SHA="e88970ea5b7fd61292afd66f86ae3030"

# Clear file
rm -f "$OUT"

# Try downloading the whole thing with curl, retry on failure
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  echo "=== Attempt $attempt ==="
  curl -sL --max-time 60 --retry 0 --tcp-fastopen \
       -H "Accept-Encoding: identity" \
       "$URL" -o "$OUT" 2>&1
  SIZE=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
  echo "  Got $SIZE bytes"
  # Verify tarball
  if [ $SIZE -gt 5000000 ]; then
    if tar -tzf "$OUT" >/dev/null 2>&1; then
      ACTUAL_SHA=$(sha1sum "$OUT" | awk '{print $1}')
      echo "  SHA: $ACTUAL_SHA (expected $EXPECTED_SHA)"
      if [ "$ACTUAL_SHA" == "$EXPECTED_SHA" ]; then
        echo "  SUCCESS"
        exit 0
      fi
    else
      echo "  Tarball invalid (truncated)"
    fi
  fi
  rm -f "$OUT"
  sleep 2
done
echo "All attempts failed"
exit 1
