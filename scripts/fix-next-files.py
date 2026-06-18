#!/usr/bin/env python3
"""
Iteratively fix missing next@16.1.1 files by running `next --version`,
parsing the error, downloading the missing file from jsdelivr, and retrying.
"""
import os
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

PROJECT_DIR = Path("/home/z/my-project")
NEXT_BIN = PROJECT_DIR / "node_modules" / "next" / "dist" / "bin" / "next"
NEXT_ROOT = PROJECT_DIR / "node_modules" / "next"
BASE_URL = "https://cdn.jsdelivr.net/npm/next@16.1.1"

# Patterns to detect missing module errors
PATTERNS = [
    re.compile(r"Cannot find module '([^']+)'"),
    re.compile(r"Cannot find module \"([^\"]+)\""),
]

# Map of common missing modules - these often need recursive handling
def resolve_module_path(requested, parent_file):
    """
    Resolve a module request relative to its parent file.
    Returns (absolute_path_to_create, jsdelivr_url_path) or None if not resolvable.
    """
    parent = Path(parent_file)
    
    # Skip external packages (start with @ or don't start with . or /)
    if not (requested.startswith('.') or requested.startswith('/')):
        # Special case: 'next/dist/...' resolves inside the next package
        if requested.startswith('next/dist/'):
            target = NEXT_ROOT.parent.parent / requested.replace('next/', '', 1)
            # try with .js
            candidates = [
                target.with_suffix('.js') if target.suffix != '.js' else target,
                target,
                target.with_suffix('.json'),
                target / 'index.js',
            ]
            for cand in candidates:
                if cand.exists():
                    return None
                try:
                    rel_to_next = cand.relative_to(NEXT_ROOT)
                    url_path = f"{BASE_URL}/{rel_to_next}"
                    return (cand, url_path)
                except ValueError:
                    continue
        # External package - skip for now
        return None
    
    # Try various resolutions
    candidates = []
    
    # Relative to parent's directory
    if requested.startswith('./') or requested.startswith('../'):
        base = parent.parent
        rel = requested
    elif requested.startswith('/'):
        # Absolute - relative to next package root
        base = NEXT_ROOT
        rel = requested.lstrip('/')
    else:
        base = parent.parent
        rel = './' + requested
    
    # Normalize the path
    target = (base / rel).resolve()
    
    # Try .js, .json, /index.js
    candidates = [
        target.with_suffix('.js') if target.suffix != '.js' else target,
        target,
        target.with_suffix('.json'),
        target / 'index.js',
        target / 'index.json',
    ]
    
    for cand in candidates:
        if cand.exists():
            return None  # Already exists
        
        # Compute jsdelivr URL path
        try:
            rel_to_next = cand.relative_to(NEXT_ROOT)
            url_path = f"{BASE_URL}/{rel_to_next}"
            return (cand, url_path)
        except ValueError:
            continue
    
    return None


def parse_error_and_download(error_text):
    """Find missing module errors in the error text and download them."""
    # Find the deepest "Require stack" to know which file is failing
    stack_match = re.search(r"Require stack:\s*\n(- .+)", error_text)
    parent_file = None
    if stack_match:
        # Get the first item in the stack
        first_line = stack_match.group(1)
        parent_file = first_line.replace("- ", "").strip()
    
    # Find the missing module
    for pattern in PATTERNS:
        match = pattern.search(error_text)
        if match:
            requested = match.group(1)
            if parent_file:
                result = resolve_module_path(requested, parent_file)
                if result:
                    dest, url = result
                    return download_file(dest, url)
    return None


def download_file(dest, url, retries=5):
    """Download a file from jsdelivr."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as r:
                data = r.read()
            with open(dest, 'wb') as f:
                f.write(data)
            return (dest, True, f"downloaded {len(data)} bytes from {url}")
        except Exception as e:
            last_err = e
            time.sleep(0.5)
    return (dest, False, f"failed: {last_err}")


def main():
    max_iterations = 200
    for i in range(max_iterations):
        # Run next --version
        result = subprocess.run(
            ["node", str(NEXT_BIN), "--version"],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=str(PROJECT_DIR),
        )
        
        if result.returncode == 0:
            print(f"\n[{i}] SUCCESS! Next version: {result.stdout.strip()}", flush=True)
            return 0
        
        # Parse error
        error_text = result.stderr
        if "Cannot find module" in error_text:
            print(f"[{i}] Missing module detected", flush=True)
            res = parse_error_and_download(error_text)
            if res:
                dest, ok, msg = res
                print(f"  {msg}", flush=True)
                if not ok:
                    print(f"  FATAL - could not download", flush=True)
                    return 1
            else:
                print(f"  Could not resolve - error:\n{error_text[:500]}", flush=True)
                return 1
        else:
            print(f"[{i}] Other error:\n{error_text[:500]}", flush=True)
            return 1
    
    print(f"Max iterations ({max_iterations}) reached", flush=True)
    return 1


if __name__ == '__main__':
    sys.exit(main())
