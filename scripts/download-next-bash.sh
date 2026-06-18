#!/usr/bin/env bash
# Download next-16.1.1.tgz using curl with byte-range requests, in a loop.
set -u
URL="https://cdn.npmmirror.com/packages/next/16.1.1/next-16.1.1.tgz"
OUT="/tmp/next.tgz"
EXPECTED_SIZE=30653457
CHUNK=50000

rm -f "$OUT"
touch "$OUT"

START=0
LAST_PRINT=0
START_TIME=$(date +%s)

while [ $START -lt $EXPECTED_SIZE ]; do
  END=$((START + CHUNK - 1))
  if [ $END -ge $EXPECTED_SIZE ]; then
    END=$((EXPECTED_SIZE - 1))
  fi
  EXPECTED_LEN=$((END - START + 1))
  
  # Try up to 30 times to get this chunk
  SUCCESS=0
  for attempt in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    TMP=$(mktemp)
    HTTP_CODE=$(curl -s -o "$TMP" -w "%{http_code}" --max-time 15 \
      -H "User-Agent: Mozilla/5.0" \
      -H "Accept-Encoding: identity" \
      -H "Range: bytes=${START}-${END}" \
      "$URL" 2>/dev/null)
    ACTUAL_LEN=$(stat -c%s "$TMP" 2>/dev/null || echo 0)
    if [ "$HTTP_CODE" = "206" ] && [ "$ACTUAL_LEN" -eq "$EXPECTED_LEN" ]; then
      cat "$TMP" >> "$OUT"
      rm -f "$TMP"
      SUCCESS=1
      break
    fi
    rm -f "$TMP"
    sleep 0.1
  done
  
  if [ $SUCCESS -eq 0 ]; then
    echo "FATAL at $START after 20 attempts"
    exit 1
  fi
  
  START=$((END + 1))
  
  PRINT_DIFF=$((START - LAST_PRINT))
  if [ $PRINT_DIFF -ge 1000000 ]; then
    NOW=$(date +%s)
    ELAPSED=$((NOW - START_TIME))
    RATE=$(awk "BEGIN { printf \"%.2f\", $START / 1000000 / ${ELAPSED:-1} }")
    PCT=$((START * 100 / EXPECTED_SIZE))
    echo "${PCT}% - ${START}/$EXPECTED_SIZE - ${RATE}MB/s"
    LAST_PRINT=$START
  fi
done

ACTUAL_SIZE=$(stat -c%s "$OUT")
echo "Done. Size: $ACTUAL_SIZE (expected $EXPECTED_SIZE)"
if [ "$ACTUAL_SIZE" -eq "$EXPECTED_SIZE" ]; then
  echo "SUCCESS"
  exit 0
else
  echo "SIZE MISMATCH"
  exit 1
fi
