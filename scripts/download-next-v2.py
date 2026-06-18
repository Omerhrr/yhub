#!/usr/bin/env python3
"""Download next-16.1.1.tgz using tiny byte-range requests with infinite retries."""
import urllib.request
import os
import sys
import time
import hashlib

URL = "https://cdn.npmmirror.com/packages/next/16.1.1/next-16.1.1.tgz"
OUT = "/tmp/next.tgz"
CHUNK_SIZE = 50_000  # 50KB chunks - smaller means less likely to fail mid-chunk
EXPECTED_SIZE = 30_653_457

def download_chunk(start, end, retries=50):
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(URL, headers={
                'User-Agent': 'curl/8',
                'Accept-Encoding': 'identity',
                'Range': f'bytes={start}-{end}',
            })
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read()
        except Exception as e:
            last_err = e
            time.sleep(0.2)
    raise RuntimeError(f"Failed after {retries} retries: {last_err}")

def main():
    # Pre-allocate
    with open(OUT, 'wb') as f:
        f.truncate(EXPECTED_SIZE)
    
    start = 0
    last_print = 0
    start_time = time.time()
    with open(OUT, 'r+b') as f:
        while start < EXPECTED_SIZE:
            end = min(start + CHUNK_SIZE - 1, EXPECTED_SIZE - 1)
            expected_len = end - start + 1
            try:
                data = download_chunk(start, end)
                if len(data) != expected_len:
                    print(f"  Short read at {start}: got {len(data)}, expected {expected_len}, retry")
                    continue
                f.seek(start)
                f.write(data)
                start = end + 1
                if start - last_print > 500_000:
                    pct = start / EXPECTED_SIZE * 100
                    elapsed = time.time() - start_time
                    rate = start / 1e6 / max(elapsed, 0.1)
                    eta = (EXPECTED_SIZE - start) / 1e6 / max(rate, 0.01)
                    print(f"  {start/1e6:.1f}MB / {EXPECTED_SIZE/1e6:.1f}MB ({pct:.0f}%) - {rate:.1f}MB/s - ETA {eta:.0f}s")
                    last_print = start
            except Exception as e:
                print(f"  Fatal error at {start}: {e}")
                time.sleep(1)
                continue
    
    actual_size = os.path.getsize(OUT)
    print(f"Done. Size: {actual_size} (expected {EXPECTED_SIZE})")
    if actual_size == EXPECTED_SIZE:
        print("SUCCESS")
        return 0
    else:
        print("SIZE MISMATCH")
        return 1

if __name__ == '__main__':
    sys.exit(main())
