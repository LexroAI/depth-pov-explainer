# Depth POV Explainer - Claude Code skill

Make a ~10-minute "Why You'd Never Want To Meet A [ANIMAL]" documentary from one prompt: researched facts with sources, a second-person script, ElevenLabs narration and sound effects, animated flat-vector scenes in Remotion, real stock footage with credits, and a thumbnail.

## What you need

- **Windows** with a **D: drive** (Claude asks for another drive if you don't have one).
- **Claude Code** (desktop app or CLI).
- **Node.js LTS**, **Python 3** (`pip install requests`) and **ffmpeg** on PATH. Claude checks these on the first run.
- **ElevenLabs** account with an API key and a voice ID (paid; used for the voice and sound effects).
- **Pixabay** API key (free: log in at pixabay.com and copy the key from https://pixabay.com/api/docs/).

## Install

1. Click **Code → Download ZIP** and unzip it.
2. Rename the folder to `depth-pov-explainer` (remove the `-main` at the end). Claude won't find the skill otherwise.
3. Copy it into `C:\Users\<you>\.claude\skills\` (create the `skills` folder if it is not there), so you get `C:\Users\<you>\.claude\skills\depth-pov-explainer\SKILL.md`.
4. Open a new Claude Code session and type `/depth-pov-explainer`, or just ask: "Make a Depth POV video about the [animal]".
5. On the first run Claude creates `D:\DepthPOV\.env`. Open it in Notepad, paste your keys, save, and tell Claude to continue:
   ```
   ELEVENLABS_API_KEY=
   ELEVENLABS_VOICE_ID=
   ELEVENLABS_MODEL_ID=eleven_v4
   PIXABAY_API_KEY=
   ```

## First run: your own channel

Claude walks you through your channel name, your "you" character, your colours, font and opening style, and saves them to `D:\DepthPOV\brand\brand.json`. Every video then uses YOUR name, logo text and colours. Nothing from the skill author's channel appears in your videos.

## How a video gets made

1. Facts with sources (`facts.json`) and a fact check you approve before any credits are spent.
2. Script, then audio tags you approve once.
3. Voice and sound effects with ElevenLabs.
4. Stock footage: Pixabay automatically; NOAA and Pexels clips from links Claude gives you to download by hand.
5. Scenes built in Remotion, checked with still frames, then rendered to `out.mp4`.
6. `packaging.md` with titles, description, chapters, sources and footage credits, plus a thumbnail.

## Costs and licences

- ElevenLabs credits are used for the voice (~11,000 characters per video) and sound effects (generated once, then reused).
- Remotion is free for individuals and very small companies; larger companies need a licence (remotion.dev/license).
- Footage: keep every on-screen credit and the "Footage" section in the description. NOAA footage must keep NOAA's requested credit line; clips with third-party contributors are rejected by the skill.
- Scripts are written fresh from each animal's facts; the skill never copies another creator's wording.

## What's inside

- `SKILL.md` - the full workflow Claude follows
- `references/` - visual style guide and script patterns
- `scripts/` - voice, stock, sound-effect and brand tools (copied to `D:\DepthPOV\tools\`)
- `remotion-lib/` - the animation library and a complete example video
