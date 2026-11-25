"""
Pulsenmore Clinical Scan Gallery - Video Manifest Generator (Python 3)
Scans the /videos directory for ultrasound clips (.mp4, .mov, .webm)
and updates videos/videos.json automatically.

Usage:
    python generate-manifest.py
    python generate-manifest.py --watch
"""

import os
import sys
import json
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEOS_DIR = os.path.join(SCRIPT_DIR, "videos")
MANIFEST_PATH = os.path.join(VIDEOS_DIR, "videos.json")
VALID_EXTENSIONS = {".mp4", ".mov", ".webm"}

def update_manifest():
    if not os.path.exists(VIDEOS_DIR):
        print(f"[Error] Directory not found: {VIDEOS_DIR}")
        return []

    files = [
        f for f in os.listdir(VIDEOS_DIR)
        if os.path.isfile(os.path.join(VIDEOS_DIR, f))
        and os.path.splitext(f)[1].lower() in VALID_EXTENSIONS
    ]
    files.sort()

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(files, f, indent=2)

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] Successfully updated {MANIFEST_PATH} with {len(files)} video clips.")
    return files

if __name__ == "__main__":
    current_files = update_manifest()

    if "--watch" in sys.argv:
        print(f"Watching '{VIDEOS_DIR}' for new video clips (Ctrl+C to stop)...")
        last_mtime = os.path.getmtime(VIDEOS_DIR)
        try:
            while True:
                time.sleep(1.0)
                mtime = os.path.getmtime(VIDEOS_DIR)
                if mtime != last_mtime:
                    last_mtime = mtime
                    time.sleep(0.3)
                    update_manifest()
        except KeyboardInterrupt:
            print("\nStopped watching.")
