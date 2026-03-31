# NEWBOY Brand Site — V9 Major Feature Overhaul

## Current State

The app is a cyberpunk NFT brand site with:
- Loading intro screen with glitch logo animation
- Sticky nav: HOME, COLLECTION, ABOUT + BUY button
- Hero: logo + "NEWBOY" h1 + tagline + Zora/Twitter buttons
- Collection section: grid of NFT cards with hover Buy/Share overlays
- About section: bio text + logo + Zora/Twitter links
- Drop Alerts CTA section
- Footer with links, Verified Creator badge, Admin button
- Dark/cyberpunk aesthetic: #070A0F bg, neon cyan/purple glows, particle canvas
- Backend: getAllNFTItems, addNFTItem, deleteNFTItem (admin-managed gallery)
- Static fallback NFTs hardcoded in STATIC_NFTS if backend is empty

## Requested Changes (Diff)

### Add
1. **Hero redesign** — Replace current h1 "NEWBOY" with bold headline "NEWBOY: BUILT DIFFERENT." and subtitle "For the ones who move early." Keep logo, add featured NFT visual below headline (use first static NFT image as showcase piece)
2. **NFT click modal** — When user clicks a card, open a full modal showing: NFT image (large), name, ticker (@newboy01), short story/description per piece, edition badge (1/1). Add a close button and Buy on Zora CTA in the modal
3. **Story / Lore section** — New full-width section with ID "lore". Quote prominently: "Newboy isn't just a character. It's a phase. A mindset. A journey from unseen to undeniable." Then three short answers: Who is Newboy? / What does he represent? / Why should people care?
4. **Early Signals section** — New section titled "EARLY SIGNALS" / "First Believers". Display a list of early holder wallets/usernames (hardcoded starter data: 5 placeholder usernames). Include tagline: "The ones who saw it first." Style like a leaderboard/recognition wall
5. **Roadmap section** — New section titled "THE JOURNEY". Three phases: Phase 1: Build & Drop (COMPLETE), Phase 2: Community + Identity (IN PROGRESS / current), Phase 3: Expansion — Collabs, Deeper World (UPCOMING). Visual timeline layout with phase status indicators
6. **Phase Tracker** — Small persistent status bar or pill in the hero area (below subtitle) showing "CURRENT PHASE: EARLY SIGNALS" with a pulsing dot indicator. Makes the site feel alive.
7. **Collect/Mint CTA button** — Add a "COLLECT" button alongside the existing Zora button in the hero. Style it as the primary action (gold/cyan, glow). Links to Zora.
8. **Social Proof section** — New compact section between collection and lore: show X handle + Zora link prominently, + a "community" stat block (6 pieces · on-chain · Web3 native)
9. **Nav update** — Add LORE and ROADMAP to navigation links. Final order: HOME, COLLECTION, LORE, ROADMAP, ABOUT + BUY button
10. **Ambient sound toggle** — Small speaker icon button in the top-right nav area. On click, plays a very subtle low-frequency ambient hum (use Web Audio API to generate programmatically, no file needed). Shows muted/unmuted state.

### Modify
- Hero: update headline copy as described above
- NFT cards: make entire card clickable (not just hover buttons) to open modal
- Collection section: keep grid but reduce default to 3 columns max on large screens for a more premium feel
- About section: update bio text to be deeper/more brand-focused (add the lore angle)

### Remove
- Nothing removed — all existing sections retained

## Implementation Plan

1. **Update hero section**: Change h1 to "NEWBOY: BUILT DIFFERENT." with subtitle "For the ones who move early." Add Phase Tracker pill. Add Collect button. Show first NFT image as a featured visual alongside text.
2. **NFT click modal**: Add `selectedNft` state. On card click, open full-screen modal with large image, name, description, edition, ticker, Buy CTA. Each NFT in STATIC_NFTS gets a `description` field (short lore/story per piece).
3. **Lore section**: New `<section id="lore">` with quote block, three Q&A blocks (Who/What/Why), cinematic layout.
4. **Early Signals section**: New `<section id="early-signals">` with 5 hardcoded early holder entries (wallet shorthand or username style), recognition wall grid.
5. **Roadmap section**: New `<section id="roadmap">` with vertical/horizontal timeline. Phase 1 complete, Phase 2 active (glowing), Phase 3 upcoming.
6. **Social proof block**: Brief inline section showing stats + social links.
7. **Nav update**: Add LORE and ROADMAP links to desktop nav.
8. **Ambient sound**: Add speaker icon button in nav. Use Web Audio API OscillatorNode + GainNode to generate a very low-volume ambient drone on click. Toggle on/off.
9. **Keep all existing functionality**: Admin panel, gallery load from backend, loading screen, particles, glitch animation, footer.
