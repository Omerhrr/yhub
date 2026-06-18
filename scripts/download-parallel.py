#!/usr/bin/env python3
"""Download next-16.1.1.tgz using parallel HTTP/1.1 range requests."""
import http.client
import ssl
import os
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

HOST = "registry.npmjs.com"
PATH = "/next/-/next-16.1.1.tgz"
OUT = "/tmp/next.tgz"
EXPECTED_SIZE = None  # We'll get this from a HEAD request
CHUNK_SIZE = 500_000  # 500KB chunks
MAX_WORKERS = 8  # parallel downloads

ssl_ctx = ssl.create_default_context()

def get_size():
    # Use a range request to determine total size
    conn = http.client.HTTPSConnection(HOST, timeout=20, context=ssl_ctx)
    conn.request("GET", PATH, headers={
        "User-Agent": "curl/8",
        "Accept-Encoding": "identity",
        "Range": "bytes=0-0",
    })
    r = conn.getresponse()
    r.read()
    cr = r.headers.get("Content-Range")
    conn.close()
    if cr and "/" in cr:
        return int(cr.split("/")[-1])
    # Fallback to known size for next-16.1.1.tgz
    return 30653457

def fetch_range(start, end, retries=30):
    last_err = None
    for attempt in range(retries):
        try:
            conn = http.client.HTTPSConnection(HOST, timeout=20, context=ssl_ctx)
            conn.request("GET", PATH, headers={
                "User-Agent": "curl/8",
                "Accept-Encoding": "identity",
                "Range": f"bytes={start}-{end}",
            })
            r = conn.getresponse()
            if r.status not in (200, 206):
                conn.close()
                last_err = f"HTTP {r.status}"
                time.sleep(0.3)
                continue
            data = r.read()
            conn.close()
            if len(data) == (end - start + 1):
                return data
            last_err = f"short read: got {len(data)}, want {end-start+1}"
        except Exception as e:
            last_err = str(e)
            time.sleep(0.3)
    raise RuntimeError(f"Failed @ {start}-{end} after {retries} retries: {last_err}")

def main():
    global EXPECTED_SIZE
    EXPECTED_SIZE = get_size()
    if not EXPECTED_SIZE:
        print("Could not determine size")
        return 1
    print(f"Total size: {EXPECTED_SIZE:,} bytes ({EXPECTED_SIZE/1e6:.1f} MB)")
    
    # Build list of chunks
    chunks = []
    start = 0
    while start < EXPECTED_SIZE:
        end = min(start + CHUNK_SIZE - 1, EXPECTED_SIZE - 1)
        chunks.append((start, end))
        start = end + 1
    print(f"Total chunks: {len(chunks)} ({CHUNK_SIZE/1000:.0f}KB each)")
    
    # Pre-allocate output file
    with open(OUT, 'wb') as f:
        f.truncate(EXPECTED_SIZE)
    
    completed = 0
    failed_chunks = []
    start_time = time.time()
    
    def do_chunk(chunk):
        s, e = chunk
        try:
            data = fetch_range(s, e)
            return (s, e, data, None)
        except Exception as err:
            return (s, e, None, str(err))
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(do_chunk, c): c for c in chunks}
        with open(OUT, 'r+b') as f:
            for future in as_completed(futures):
                s, e, data, err = future.result()
                if err:
                    failed_chunks.append((s, e))
                    print(f"  FAIL {s}-{e}: {err}")
                else:
                    f.seek(s)
                    f.write(data)
                    f.flush()
                completed += 1
                if completed % 10 == 0 or completed == len(chunks):
                    pct = completed / len(chunks) * 100
                    elapsed = time.time() - start_time
                    rate = completed / max(elapsed, 0.1)
                    eta = (len(chunks) - completed) / max(rate, 0.01)
                    print(f"  {completed}/{len(chunks)} ({pct:.0f}%) - {rate:.1f} chunks/s - ETA {eta:.0f}s", flush=True)
    
    # Retry failed chunks
    if failed_chunks:
        print(f"Retrying {len(failed_chunks)} failed chunks...")
        with open(OUT, 'r+b') as f:
            for s, e in failed_chunks:
                try:
                    data = fetch_range(s, e, retries=100)
                    f.seek(s)
                    f.write(data)
                    f.flush()
                except Exception as err:
                    print(f"  FATAL {s}-{e}: {err}")
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
