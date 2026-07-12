# Gatherer's Ascension Treasury and Audio System

## Current State

The Worldroot Treasury is now a persistent command surface displayed above every major game screen.

It shows:

- Coin Reserve
- Cargo Value
- Total Net Worth
- Estimated Automated Network Value Per Minute
- Current Capital Status
- Next Eligible Investment
- Progress toward the next investment
- One-click cargo liquidation

The treasury subscribes directly to the game state, so it updates after gathering, automated extraction, selling, recruiting, zone activation, equipment investment, and tool upgrades.

## Adaptive Music System

The game now includes an adaptive browser-music controller with:

- Worldroot Command Center music on strategic screens
- Greenveil Meadow music in Greenveil Field mode
- Ironfall Basin music in Ironfall Field mode
- Crystal Vale music in Crystal Vale Field mode
- Emberdeep Archive music in Emberdeep Field mode
- Looping playback
- 1.5-second crossfades
- Saved volume
- Saved mute state
- Browser autoplay protection
- Persistent music controls inside the treasury bar

## Required Browser Assets

The controller expects these optimized files in `app/public/audio/`:

- `worldroot-command-center.mp3`
- `greenveil-meadow.mp3`
- `ironfall-basin.mp3`
- `crystal-vale.mp3`
- `emberdeep-archive.mp3`

The source WAV masters should remain outside the public repository. Browser-optimized MP3 editions should be committed to keep loading practical.

## Validation

The treasury and audio code passed TypeScript validation and a Vite production build with 64 transformed modules. The Phaser bundle-size warning remains non-blocking.

## Next Move

Upload the five optimized MP3 files to `LUMAN_OS/game_lab/gatherers_ascension/app/public/audio/`, then confirm track switching in Dashboard and each biome's Field mode.
