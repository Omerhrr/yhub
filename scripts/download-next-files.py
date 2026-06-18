#!/usr/bin/env python3
"""Download missing next@16.1.1 files from jsdelivr."""
import json
import os
import sys
import time
import urllib.request
import concurrent.futures
from pathlib import Path

CACHE_DIR = Path.home() / ".bun" / "install" / "cache" / "next@16.1.1@@@1"
API_URL = "https://data.jsdelivr.com/v1/packages/npm/next@16.1.1"
BASE_URL = "https://cdn.jsdelivr.net/npm/next@16.1.1"

def get_file_list():
    req = urllib.request.Request(API_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())

def walk_files(node, prefix=""):
    """Walk the file tree and yield (path, size) tuples."""
    for item in node.get("files", []):
        name = item["name"]
        path = f"{prefix}/{name}" if prefix else name
        if item["type"] == "directory":
            yield from walk_files(item, path)
        else:
            yield (path, item.get("size", 0))

def download_file(rel_path, retries=10):
    url = f"{BASE_URL}/{rel_path}"
    dest = CACHE_DIR / rel_path
    dest.parent.mkdir(parents=True, exist_ok=True)
    
    if dest.exists() and dest.stat().st_size > 0:
        return (rel_path, True, "cached")
    
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as r:
                data = r.read()
            with open(dest, 'wb') as f:
                f.write(data)
            return (rel_path, True, f"downloaded {len(data)} bytes")
        except Exception as e:
            time.sleep(0.2)
    return (rel_path, False, "failed")

def main():
    print("Fetching file list from jsdelivr...", flush=True)
    tree = get_file_list()
    
    all_files = list(walk_files(tree))
    print(f"Total files in next@16.1.1: {len(all_files)}", flush=True)
    
    # Check which are missing
    missing = []
    for path, size in all_files:
        dest = CACHE_DIR / path
        if not dest.exists() or dest.stat().st_size == 0:
            missing.append(path)
    print(f"Missing files: {len(missing)}", flush=True)
    
    if not missing:
        print("All files present!")
        return 0
    
    # Download missing files in parallel
    completed = 0
    failed = []
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as pool:
        futures = {pool.submit(download_file, p): p for p in missing}
        for future in concurrent.futures.as_completed(futures):
            path, ok, msg = future.result()
            completed += 1
            if not ok:
                failed.append(path)
            if completed % 50 == 0 or completed == len(missing):
                elapsed = time.time() - start_time
                rate = completed / max(elapsed, 0.1)
                eta = (len(missing) - completed) / max(rate, 0.01)
                print(f"  {completed}/{len(missing)} ({rate:.1f}/s, ETA {eta:.0f}s) - failed: {len(failed)}", flush=True)
    
    print(f"\nDone. Downloaded: {completed - len(failed)}, Failed: {len(failed)}", flush=True)
    if failed:
        print("Failed files:")
        for p in failed[:20]:
            print(f"  {p}")
    return 0 if not failed else 1

if __name__ == '__main__':
    sys.exit(main())
