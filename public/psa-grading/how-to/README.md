# PSA how-to background assets

Phase 1 uses scroll-scrubbed **still images**. Phase 2 can swap in MP4 video legs without changing page layout.

## Current assets (Phase 1)

| File | Step | Scene |
|------|------|-------|
| `scene-0-intake.webp` | 01 | 138 Arena intake counter |
| `scene-1-outbound.webp` | 02 | Batch consolidation / outbound |
| `scene-2-grading.webp` | 03 | Grading bench |
| `scene-3-pickup.webp` | 04 | Return shelf / pickup |

Paths are registered in `src/lib/grading/how-to-scenes.ts`.

## Phase 2 — MP4 video upgrade

Drop encoded clips here with matching names:

| File | Replaces |
|------|----------|
| `leg-0-intake.mp4` | Scene 0 still (scroll band 1) |
| `leg-1-outbound.mp4` | Scene 1 still |
| `leg-2-grading.mp4` | Scene 2 still |
| `leg-3-pickup.mp4` | Scene 3 still |

Optional mobile siblings: `leg-*-m.mp4` (720p, `-g 4` GOP).

### Encode settings (desktop scrub)

```bash
ffmpeg -i src.mp4 -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart leg-N-name.mp4
```

### Wiring in code

1. Add files to this folder.
2. Update `PsaGradingHowToScrollBackground.tsx` to detect `leg-*.mp4` (or a `useVideo` prop) and render `<video>` layers instead of `<img>`.
3. In `how-to-background-scrub.ts`, set `video.currentTime` from scroll progress per band instead of opacity crossfade (blob URLs recommended for seekability).
4. Keep `scene-*.webp` as posters and `prefers-reduced-motion` fallbacks.

Scroll bands, scrim, and timeline layout stay unchanged.

## Sources for Phase 2 video

- **Higgsfield + ffmpeg** — scroll-world Architecture A (4 sequential forward legs, frame-locked seams)
- **Runway / Kling web** — export MP4 manually using Phase 1 stills as start frames
- **Stock / b-roll** — single ambient loop possible but weaker step sync
