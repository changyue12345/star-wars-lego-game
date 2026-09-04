# WebGL Build - GitHub Pages Setup

This guide will help you build and host your Star Wars LEGO game on GitHub Pages for personal play.

## Quick Setup (5 minutes)

### 1. Build WebGL in Unity
- File → Build Settings → Select WebGL → Switch Platform
- Build Settings → Build (choose output folder, e.g., `docs`)
- Wait for build to complete

### 2. Upload to GitHub
```bash
cd your-local-repo
git add -A
git commit -m "Add WebGL build"
git push origin main
```

### 3. Enable GitHub Pages
- Go to your repo on GitHub
- Settings → Pages
- Source: Deploy from a branch
- Branch: main, folder: /docs
- Save
- Wait 1-2 minutes

### 4. Play!
- Visit: `https://yourusername.github.io/star-wars-lego-game`
- Works on iPad Safari too!

## That's it! 🎮

No publishing, no app store, just a private link for yourself to play.

Touch controls work on iPad automatically.
