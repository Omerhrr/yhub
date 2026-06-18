#!/usr/bin/env python3
"""Download next-16.1.1.tgz using byte-range requests with aggressive retries."""
import urllib.request
import os
import sys
import time
import hashlib

URL = "https://registry.npmjs.org/next/-/next-16.1.1.tgz"
OUT = "/tmp/next.tgz"
EXPECTED_SHA = "e88970ea5b7fd61292afd66f86ae3030"
CHUNK_SIZE = 200_000  # 200KB chunks

def get_size():
    req = urllib.request.Request(URL, method='HEAD', headers={
        'User-Agent': 'curl/8',
        'Accept-Encoding': 'identity',
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        cl = r.headers.get('Content-Length')
        if cl:
            return int(cl)
        # No content-length — try a Range request to get total
        req2 = urllib.request.Request(URL, headers={
            'User-Agent': 'curl/8',
            'Accept-Encoding': 'identity',
            'Range': 'bytes=0-0',
        })
        with urllib.request.urlopen(req2, timeout=30) as r2:
            cr = r2.headers.get('Content-Range')
            if cr:
                # bytes 0-0/12345678
                return int(cr.split('/')[-1])
    return None

def download_chunk(start, end, retries=20):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(URL, headers={
                'User-Agent': 'curl/8',
                'Accept-Encoding': 'identity',
                'Range': f'bytes={start}-{end}',
            })
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(0.5)
                continue
            raise

def main():
    size = get_size()
    print(f"Total size: {size}")
    if size is None:
        print("Could not determine size")
        return 1

    # Open output file
    mode = 'wb' if not os.path.exists(OUT) else 'r+b'
    if not os.path.exists(OUT):
        # Pre-allocate
        with open(OUT, 'wb') as f:
            f.truncate(size)
    
    with open(OUT, 'r+b') as f:
        start = 0
        while start < size:
            end = min(start + CHUNK_SIZE - 1, size - 1)
            expected_len = end - start + 1
            try:
                data = download_chunk(start, end)
                if len(data) != expected_len:
                    print(f"  Chunk {start}-{end}: got {len(data)} bytes (expected {expected_len}), retry")
                    continue
                f.seek(start)
                f.write(data)
                start = end + 1
                if start % 1_000_000 < CHUNK_SIZE:
                    print(f"  {start/1e6:.1f}MB / {size/1e6:.1f}MB")
            except Exception as e:
                print(f"  Error at {start}: {e}, retrying")
                time.sleep(1)
                continue
    
    # Verify
    with open(OUT, 'rb') as f:
        actual_sha = hashlib.sha1(f.read()).hexdigest()
    print(f"SHA: {actual_sha} (expected {EXPECTED_SHA})")
    if actual_sha == EXPECTED_SHA:
        print("SUCCESS")
        return 0
    else:
        print("SHA mismatch")
        return 1

if __name__ == '__main__':
    sys.exit(main())
