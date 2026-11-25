/**
 * Pulsenmore Clinical Scan Gallery - Video Manifest Generator
 * Cross-platform Node.js script to scan /videos and update videos/videos.json
 * 
 * Usage:
 *   node generate-manifest.js
 *   node generate-manifest.js --watch
 */

const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, 'videos');
const MANIFEST_FILE = path.join(VIDEOS_DIR, 'videos.json');
const VALID_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);

function updateManifest() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error(`Directory not found: ${VIDEOS_DIR}`);
    return;
  }

  const files = fs.readdirSync(VIDEOS_DIR);
  const videoFiles = files
    .filter(file => VALID_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort();

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(videoFiles, null, 2), 'utf8');
  console.log(`[${new Date().toLocaleTimeString()}] Updated ${MANIFEST_FILE} with ${videoFiles.length} video clips.`);
}

// Run initial scan
updateManifest();

// If --watch passed, watch the folder
if (process.argv.includes('--watch')) {
  console.log(`Watching ${VIDEOS_DIR} for changes (Ctrl+C to stop)...`);
  fs.watch(VIDEOS_DIR, (eventType, filename) => {
    if (filename && VALID_EXTENSIONS.has(path.extname(filename).toLowerCase())) {
      setTimeout(updateManifest, 300);
    }
  });
}
