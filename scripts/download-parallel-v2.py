#!/usr/bin/env python3
"""Robust parallel download of next-16.1.1.tgz with retries."""
import http.client
import ssl
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

HOST = "registry.npmjs.com"
PATH = "/next/-/next-16.1.1.tgz"
OUT = "/tmp/next.tgz"
EXPECTED_SIZE = 30653457
CHUNK_SIZE = 200_000  # 200KB chunks - smaller means less likely to fail
MAX_WORKERS = 5  # parallel downloads

ssl_ctx = ssl.create_default_context()

def fetch_range(start, end, retries=200):
    """Fetch a byte range with infinite retries."""
    expected_len = end - start + 1
    last_err = None
    for attempt in range(retries):
        try:
            conn = http.client.HTTPSConnection(HOST, timeout=15, context=ssl_ctx)
            conn.request("GET", PATH, headers={
                "User-Agent": "Mozilla/5.0",
                "Accept-Encoding": "identity",
                "Range": f"bytes={start}-{end}",
            })
            r = conn.getresponse()
            if r.status not in (200, 206):
                r.read()
                conn.close()
                last_err = f"HTTP {r.status}"
                time.sleep(0.5)
                continue
            data = r.read()
            conn.close()
            if len(data) == expected_len:
                return data
            last_err = f"short read: got {len(data)}, want {expected_len}"
        except Exception as e:
            last_err = str(e)
            time.sleep(0.5)
    raise RuntimeError(f"Failed @ {start}-{end} after {retries} retries: {last_err}")

def main():
    # Build list of chunks
    chunks = []
    start = 0
    while start < EXPECTED_SIZE:
        end = min(start + CHUNK_SIZE - 1, EXPECTED_SIZE - 1)
        chunks.append((start, end))
        start = end + 1
    print(f"Total size: {EXPECTED_SIZE:,} bytes ({EXPECTED_SIZE/1e6:.1f} MB)")
    print(f"Total chunks: {len(chunks)} ({CHUNK_SIZE/1000:.0f}KB each)")
    
    # Open file in write mode (truncate)
    with open(OUT, 'wb') as f:
        f.truncate(EXPECTED_SIZE)
    
    # Use a lock to coordinate file writes
    from threading import Lock
    file_lock = Lock()
    completed = [0]
    failed = []
    start_time = time.time()
    
    def do_chunk(chunk):
        s, e = chunk
        try:
            data = fetch_range(s, e)
            with file_lock:
                with open(OUT, 'r+b') as f:
                    f.seek(s)
                    f.write(data)
                    f.flush()
            return (s, e, True, None)
        except Exception as err:
            return (s, e, False, str(err))
    
    # Process in batches to avoid memory pressure
    BATCH = 30
    for batch_start in range(0, len(chunks), BATCH):
        batch = chunks[batch_start:batch_start + BATCH]
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
            futures = {pool.submit(do_chunk, c): c for c in batch}
            for future in as_completed(futures):
                s, e, ok, err = future.result()
                if not ok:
                    failed.append((s, e))
                    print(f"  FAIL {s}-{e}: {err}", flush=True)
                completed[0] += 1
                if completed[0] % 10 == 0:
                    pct = completed[0] / len(chunks) * 100
                    elapsed = time.time() - start_time
                    print(f"  {completed[0]}/{len(chunks)} ({pct:.0f}%) - {elapsed:.0f}s elapsed", flush=True)
    
    # Retry failed chunks sequentially
    if failed:
        print(f"Retrying {len(failed)} failed chunks sequentially...", flush=True)
        for s, e in failed:
            try:
                data = fetch_range(s, e, retries=500)
                with open(OUT, 'r+b') as f:
                    f.seek(s)
                    f.write(data)
                    f.flush()
                print(f"  recovered {s}-{e}", flush=True)
            except Exception as err:
                print(f"  FATAL {s}-{e}: {err}", flush=True)
                return 1
    
    actual_size = os.path.getsize(OUT)
    print(f"Done. Size: {actual_size:,} (expected {EXPECTED_SIZE:,})")
    if actual_size == EXPECTED_SIZE:
        print("SUCCESS")
        return 0
    else:
        print("SIZE MISMATCH")
        return 1

if __name__ == '__main__':
    sys.exit(main())
