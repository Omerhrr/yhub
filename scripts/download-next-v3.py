#!/usr/bin/env python3
"""Download next-16.1.1.tgz using sequential append (no pre-allocation)."""
import urllib.request
import os
import sys
import time

URL = "https://cdn.npmmirror.com/packages/next/16.1.1/next-16.1.1.tgz"
OUT = "/tmp/next.tgz"
EXPECTED_SIZE = 30_653_457
CHUNK_SIZE = 100_000  # 100KB

def fetch_range(start, end, retries=100):
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(URL, headers={
                'User-Agent': 'Mozilla/5.0',
                'Accept-Encoding': 'identity',
                'Range': f'bytes={start}-{end}',
            })
            with urllib.request.urlopen(req, timeout=15) as r:
                data = r.read()
                if len(data) == (end - start + 1):
                    return data
                last_err = f"short read: got {len(data)}, want {end-start+1}"
        except Exception as e:
            last_err = str(e)
        time.sleep(0.1)
    raise RuntimeError(f"Failed after {retries} retries @ {start}: {last_err}")

def main():
    if os.path.exists(OUT):
        os.remove(OUT)
    
    start = 0
    last_print = 0
    start_time = time.time()
    with open(OUT, 'wb') as f:
        while start < EXPECTED_SIZE:
            end = min(start + CHUNK_SIZE - 1, EXPECTED_SIZE - 1)
            try:
                data = fetch_range(start, end)
                f.write(data)
                f.flush()
                start = end + 1
                if start - last_print > 1_000_000:
                    pct = start / EXPECTED_SIZE * 100
                    elapsed = time.time() - start_time
                    rate = start / 1e6 / max(elapsed, 0.1)
                    eta = (EXPECTED_SIZE - start) / 1e6 / max(rate, 0.01)
                    print(f"  {start/1e6:.1f}MB / {EXPECTED_SIZE/1e6:.1f}MB ({pct:.0f}%) - {rate:.2f}MB/s - ETA {eta:.0f}s", flush=True)
                    last_print = start
            except Exception as e:
                print(f"  FATAL at {start}: {e}", flush=True)
                return 1
    
    actual_size = os.path.getsize(OUT)
    print(f"Done. Size: {actual_size} (expected {EXPECTED_SIZE})", flush=True)
    return 0 if actual_size == EXPECTED_SIZE else 1

if __name__ == '__main__':
    sys.exit(main())
