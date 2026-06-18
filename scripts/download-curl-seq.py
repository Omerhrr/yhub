#!/usr/bin/env python3
"""Sequential download using curl subprocess."""
import subprocess
import os
import sys
import time

URL = "https://registry.npmjs.org/next/-/next-16.1.1.tgz"
OUT = "/tmp/next.tgz"
EXPECTED_SIZE = 30653457
CHUNK_SIZE = 100_000  # 100KB chunks

def fetch_range_curl(start, end, retries=50):
    """Fetch a byte range using curl subprocess."""
    expected_len = end - start + 1
    for attempt in range(retries):
        try:
            result = subprocess.run([
                "curl", "-s", "--max-time", "20",
                "-H", "User-Agent: Mozilla/5.0",
                "-H", "Accept-Encoding: identity",
                "-H", f"Range: bytes={start}-{end}",
                "-o", "-",  # output to stdout
                URL
            ], capture_output=True, timeout=30)
            
            if result.returncode != 0:
                time.sleep(0.5)
                continue
            
            data = result.stdout
            if len(data) == expected_len:
                return data
            # short read - retry
            time.sleep(0.3)
        except subprocess.TimeoutExpired:
            time.sleep(0.5)
        except Exception as e:
            print(f"  curl error @ {start}: {e}", flush=True)
            time.sleep(0.5)
    raise RuntimeError(f"Failed @ {start}-{end} after {retries} retries")

def main():
    chunks = []
    start = 0
    while start < EXPECTED_SIZE:
        end = min(start + CHUNK_SIZE - 1, EXPECTED_SIZE - 1)
        chunks.append((start, end))
        start = end + 1
    print(f"Total: {EXPECTED_SIZE:,} bytes, {len(chunks)} chunks", flush=True)
    
    # Pre-allocate
    with open(OUT, 'wb') as f:
        f.truncate(EXPECTED_SIZE)
    
    completed = 0
    failed = 0
    start_time = time.time()
    last_print = 0
    
    with open(OUT, 'r+b') as f:
        for s, e in chunks:
            try:
                data = fetch_range_curl(s, e)
                f.seek(s)
                f.write(data)
                f.flush()
                completed += 1
            except Exception as err:
                failed += 1
                print(f"  FAIL {s}-{e}: {err}", flush=True)
                if failed > 5:
                    print("Too many failures, aborting", flush=True)
                    return 1
            
            if completed % 10 == 0 and completed != last_print:
                pct = completed / len(chunks) * 100
                elapsed = time.time() - start_time
                rate = completed / max(elapsed, 0.1)
                eta = (len(chunks) - completed) / max(rate, 0.01)
                print(f"  {completed}/{len(chunks)} ({pct:.0f}%) - {rate:.1f}/s - ETA {eta:.0f}s", flush=True)
                last_print = completed
    
    actual_size = os.path.getsize(OUT)
    print(f"Done. Size: {actual_size} (expected {EXPECTED_SIZE})", flush=True)
    if actual_size == EXPECTED_SIZE:
        print("SUCCESS", flush=True)
        return 0
    else:
        print("SIZE MISMATCH", flush=True)
        return 1

if __name__ == '__main__':
    sys.exit(main())
