---
name: "depth-pov-explainer"
description: "Build a 10-minute second-person creature documentary end to end in Claude Code on Windows: channel brand, facts, script, beats, ElevenLabs v4 voice with audio tags, Pixabay stock, Remotion render, thumbnail."
---

# Depth POV Explainer

Produces one ~10 min video "Why You'd Never Want To Meet A [ANIMAL]": flat-vector motion graphics animated with Remotion (everything moves; no static slides), narrated with ElevenLabs Eleven v4, one visual idea per sentence. Always talk to the user in English, whatever language they write in; script, labels and prompts are also in US English. Write every JSON/TXT/.env as UTF-8 without BOM.

## Step 0 - Workspace on D: (run every time, create what is missing)
Root: `D:\DepthPOV` (if D: does not exist, ask the user for another drive).
```
D:\DepthPOV\.env
D:\DepthPOV\studio\            Remotion project (npx create-video@latest studio, Blank template)
D:\DepthPOV\studio\src\lib\    shared visual library (core.tsx, sets.tsx, art.tsx, ui.tsx)
D:\DepthPOV\tools\             voice.py stock.py stock_pick.py sfx.py
D:\DepthPOV\videos\<slug>\     facts.json script.txt script_tagged.txt beats.json timing.json stock.json packaging.md voice.mp3 out.mp4 FINAL\
D:\DepthPOV\assets\stock\ music\ sfx\ thumbnails\
D:\DepthPOV\brand\brand.json
```
Bundled with this skill (copy into the workspace when missing, never overwrite newer local copies): `scripts/*.py` -> `D:\DepthPOV\tools\`; `remotion-lib/lib/*.tsx` and `brand.ts` -> `studio\src\lib\`; `remotion-lib/stills.mjs` -> `studio\`; `remotion-lib/example-blue-whale/` is a complete finished video by the skill's author (13 chapter files, ~66 persistent scenes, Main.tsx, Thumb.tsx) to read as the reference implementation, not to copy scene by scene. The library takes the channel name, accent colours and character colours from `studio\src\lib\brand.ts`, which `tools\sync_brand.py` generates from brand.json; never hard-code a channel name or colour in a scene. After creating the studio run `npx remotion add @remotion/media @remotion/google-fonts`. Python needs `requests`.
If `.env` is missing, create it with empty values and STOP, telling the user to open it in Notepad and fill the keys:
```
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ELEVENLABS_MODEL_ID=eleven_v4
PIXABAY_API_KEY=
```
PIXABAY_API_KEY is free: log in at pixabay.com and copy the key shown on https://pixabay.com/api/docs/ (one key covers both videos and photos). Ignore any extra keys an older .env may contain.
Never print key values. Check Node.js LTS is installed; install Remotion agent skills once with `npx skills add remotion-dev/skills` and load them before writing Remotion code. If the user says "Retention", they mean Remotion. Mention once that Remotion is free only for individuals and very small companies (`/remotion-license`).

## Step 1 - Brand (first run only, saved to brand.json; skip if brand.json exists)
Ask these in order, one message each, always with a recommendation:
1. **Channel name.** Ask whether the user already has a name. If not, propose 8 names in 3 styles (mysterious e.g. "Abyss Files", explorer e.g. "Into The Deep", direct e.g. "Why You'd Never"): 1-3 words, easy to say aloud, no existing big-channel names, no "Depth Theory" look-alikes, works if the channel later leaves the ocean. For each give a matching @handle. Tell the user to search the name + handle on YouTube before committing (Claude cannot confirm availability). Save channel_name, handle, tagline.
2. **The "you" character**, recommend one:
   1. Scuba diver (orange suit, red head lamp) - ocean; closest to Depth Theory, least distinctive.
   2. Mini-submarine pilot - deep sea; whole video framed by a round porthole + HUD (depth, oxygen). Recommended for an ocean-only channel.
   3. Raft survivor after a shipwreck - surface ocean; top-down raft view.
   4. Explorer with head lamp - jungle, caves, rivers, ice; circle of light in darkness. Recommended if the channel expands beyond the ocean.
   5. Ranger / field biologist - land animals; binoculars + field notebook.
   6. Time traveler - prehistoric creatures; year counter (-66,000,000).
3. **Accent colour + font**, and the channel's own opener style (show 3 sample cold opens, user picks).
Save {channel_name, handle, tagline, character, look, signature_frame, accent {threat, safe, danger}, character_colors {suit, suit2, stripe, fins, fins_dark, lamp} (fins in a high-visibility colour), font, opening_style} to brand.json, then run `python D:\DepthPOV\tools\sync_brand.py` to write studio\src\lib\brand.ts, and reuse it every video. The bundled art library draws the scuba diver; for any other character (sub pilot, explorer, ranger, time traveler) build a new component in art.tsx with the same anatomy rules (references/visual-style.md). Never use Depth Theory's "Picture this." opener, its exact palette or diver design.
Use channel_name in: the cross-video callback line ("if you've been watching [channel_name] for a while..."), the CTA/end-screen line, the description, and a small logo bug in the last 10 s of the video.

## Step 2 - Facts (before any script)
Web-search the animal. facts.json: 25-35 items {id, claim, number, unit, everyday_comparison, source_url, confidence}. No superlative (biggest/deepest/only/ever) unless a fetched source states it. List popular myths and the truth.

## Step 3 - Script (fixed structure; read references/script-patterns.md first)
Use script-patterns.md for section budgets, devices and the originality rules: learn the rhythm from the reference, never its wording. Every script is written fresh from this animal's facts; if the animal was already covered by the reference (sperm whale), avoid the angles listed there.
1. Cold open 0:00-0:25. Line 1 is ALWAYS the brand's signature opener, short (under 3 s), so viewers learn it: "Dive log, entry [n]. [depth]. Air: [PSI]." Line 2 onward is the HOOK, still inside the first 7 s: put the viewer in danger right now - something touches, grabs, circles or blocks the light, a shark-like shape, a shadow, an unseen thing - present tense, unexplained, and shown on screen the same instant (silhouette, tentacle, shadow, eye). Only then the setting (night dive, tether, depth below), a RULE the viewer trusts, and a sensory sign that breaks it and rises toward you. Never spend the first 7 s on calm scenery or logistics. Plant the sensory detail for a mid-video payoff and echo the opening danger later (the real encounter, the close). No intro.
2. Reframe: animals people usually fear, concede, then three claims for [ANIMAL]; end with "...why you'd never want to meet one."
3. Five chapters: SIZE, FOOD, HOW IT HUNTS/SENSES, BRAIN/BEHAVIOUR, HAS IT EVER TURNED ON PEOPLE. Each ends with a question the next opens with. Every number gets an everyday comparison.
4. Payoff of the planted detail around 3:30.
5. "What would you actually do?": 4 options knocked down one by one, dry joke each, verdict line.
6. Twist 1: it almost never targets people. Twist 2: the real danger goes the other way.
7. Ecosystem role. 8. Close: repeat the RULE with new meaning. 9. CTA: ask which creature to cover next, in the channel's own words from brand.json (never copy Depth Theory's "I do actually read them").
Voice: second person (35+ "you"), sentences under 20 words, 5-7 dry metaphor jokes, 1,600-1,800 words at ~170 wpm. No "let's dive in", no emoji. Save as script.txt (no tags).

## Step 4 - Scenes and beats (read references/visual-style.md first)
The video is about 60 persistent SCENES, not one card per sentence. scenes.json: {scene_id, chapter, setting (deep|mid|surface-split|paper|radar|xray|black|stock), camera (drift|push-in|follow-dive|tilt|top-down|macro), cast (illustrated subjects), beats:[...]}. A scene lasts 6-20 s and covers 2-6 sentences; each sentence ADDS one element to the scene (subject enters, measure line draws, counter runs, label appears, stamp hits, FX fires) instead of replacing it.
Beat = {id, scene_id, text, add (what appears/changes), label (0-5 words or empty; never repeats the narration), label_pos (top|under-subject|near:<subject>), accent, fact_ids, stock_query?}.
Use the reference toolkit per sentence type: number -> in-scene diagram (measure line, meter, counter, icon array, grid, pie); comparison -> object enters beside the subject (bus drives in, elephants pop in); history -> paper/sepia props and surface sets; joke -> prop or stick figure (receipt, form, whiteboard, stamp, UI dialog); danger -> red label + impact FX; sensing -> radar/x-ray mode switch. The "you" character appears in cold open, payoff, options chapter and close, always tiny next to the animal.

## Step 5 - Fact gate (blocking)
Table: sentence | fact_id | source | OK/FIX for every sentence with a number or superlative. Fix all FIX rows and show the table to the user before spending ElevenLabs credits.

## Step 6 - Voice (Eleven v4 + audio tags)
- Create script_tagged.txt by adding v4 audio tags the way ElevenLabs Auto-tag does: [thoughtful], [curious], [uneasy], [dry], [whispers], [short pause], [long pause]. Max one tag per 2-3 sentences; whisper/pause around reveals and the payoff; [dry] before jokes; no tag inside a sentence carrying a statistic. Show a 10-line sample to the user once per channel to approve the tag density.
- Call `POST https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}/with-timestamps` with model_id from .env (eleven_v4). Limit 10,000 characters per request: split at chapter boundaries (usually 2 requests), pass previous_text/next_text for continuity, concatenate with ffmpeg.
- If with-timestamps is rejected for v4, use the plain endpoint, then ElevenLabs Forced Alignment (`POST /v1/forced-alignment`) with the audio + script.txt (tags removed).
- Map word timings to sentences -> timing.json {beat_id, start_s, end_s, start_frame, end_frame} at 30 fps.

## Step 6b - Sound effects (ElevenLabs Sound Effects, no CapCut needed)
Keep a reusable SFX library in D:\DepthPOV\assets\sfx\ generated with `POST https://api.elevenlabs.io/v1/sound-generation` {text, duration_seconds, prompt_influence 0.6} using the same ELEVENLABS_API_KEY (tools/sfx.py; only missing files are generated, so credits are spent once). Core set: whoosh_soft, whoosh_deep, pop_soft, tick_ui, counter_roll, stamp, paper_slide, impact_heavy, splash_big, bubbles, sonar_ping, low_hum, whale_moan, heartbeat_slow, riser_tension, scan_beep, warning_beep, strike_line, gulp, boat_motor; add creature-specific sounds when needed. Normalize copies to -20 LUFS into studio/public/sfx/. Place each SFX on the action it belongs to (element entrance, counter, stamp, impact, scene change) with `<Sfx at=... vol=...>` inside the scene, 0.3-0.6 volume, never more than one per second; the voice stays on top.

## Step 7 - Stock footage (target 6-10 clips, 3-6 s each, at emotional peaks; max 8% of runtime)
Sources, in this order (only these; never YouTube/TikTok rips, documentary footage, or anything marked "editorial use only"):
1. **Pixabay (automatic, API).** One PIXABAY_API_KEY serves videos `https://pixabay.com/api/videos/?key=...&q=...` and photos `https://pixabay.com/api/?key=...&q=...`. Max 100 requests/60 s; cache every response 24 h in assets/stock/_cache; no mass downloads. Tools: tools/stock.py, tools/stock_pick.py.
2. **NOAA (manual, best for the real species).** NOAA has no stock-video API. Claude finds the clips (NOAA Fisheries species pages and video gallery, NOAA Ocean Exploration, NOAA Photo Library, NOAA's own uploads on Wikimedia Commons) and gives the user a numbered list: direct page link, what the clip shows, the slot it fills, the exact credit line, and the file to pick (largest MP4, ideally 1080p). The user downloads into assets/stock/<slug>/noaa/. Footage made by NOAA staff is generally public domain, but read each page: many whale clips are shot under a research permit or by a contractor and require a credit line such as "NOAA Fisheries, permit #XXXX" or the photographer's name; if a page restricts reuse, skip the clip. After download, ALWAYS read the opening slate and the end credits of the file: NOAA Fisheries B-roll slates say "All footage courtesy of NOAA... Please credit NOAA Fisheries" plus any permit number (safe); educational films (e.g. Ocean Today) often list outside contributors such as production houses or stock agencies in the end credits, so their shots are NOT public domain and must be rejected; also reject files with burned-in subtitles or logos. Use only the segments whose slate names the target species (B-roll packages mix species), and say "NOAA does not endorse this channel" in the description. Never use the NOAA logo.
3. **Pexels (manual links).** API key issuance was paused when last checked (Nov 2026), so Claude searches pexels.com/videos (Claude in Chrome or web search) and gives the user direct clip page links with what to download (Full HD 1920x1080) into assets/stock/<slug>/pexels/. Downloading a few clips by hand for one video is fine under the Pexels license (commercial use allowed); no bulk or scripted scraping. If a PEXELS_API_KEY later appears in .env, use the API instead (header `Authorization: <key>`, `GET https://api.pexels.com/v1/videos/search?query=...&orientation=landscape&size=medium&per_page=..`, 200 requests/hour).
4. **Wikimedia Commons (manual, occasional).** Only files with a clear PD / CC BY / CC BY-SA licence; record author + licence.
Place clips where the reference does: right after the cold open (the real animal or a diver), on "real world" claims (breach, pod, ship, whaling, aerial), and at the twist/ecosystem; spread them out (never 3 in a row). For each slot search 3-5 synonyms, keep only hits whose tags/titles contain the subject, then extract one frame per candidate with ffmpeg and LOOK at it; reject wrong species (a humpback is not a blue whale) and off-topic shots. A clip of a different species may only be used for a general line ("great whales") with an on-screen note "(shown: humpback whale)". Grade clips darker/cooler to match the palette, 8-frame blur dissolve in and out.
**Credits are mandatory for every source.** Each clip shows a small on-screen credit bottom-left for its whole duration ("FOOTAGE: <author or credit line> / <SOURCE>"), stock.json records {file, source, author/credit_line, licence, source_url}, and packaging.md has a "Footage" section listing every clip: what it shows, source (Pixabay / NOAA / Pexels / Wikimedia), author or required credit line (with permit number if given), licence, and link.
Prefer 1920x1080, save to assets/stock/<slug>/<source>/. Any still photo gets slow zoom/pan, never sits static.

## Step 8 - Visual system (follow references/visual-style.md; identical across videos)
- 1920x1080, 30 fps. Desaturated navy/teal water darkening with depth, god rays near the surface, slow particles, vignette. Surface scenes: grey sky + waterline split. History/documents: sepia paper. Sensing: green radar or x-ray mode.
- Illustrations, not icons: each subject is a hand-built SVG component with 3-4 shading tones, texture (wrinkles, scars, mottling), a soft shadow and correct proportions, drawn big (40-70% of frame). Keep them in a reusable asset library (studio/src/lib/) and grow it every video: the brand "you" character (front, side, silhouette, x-ray), each animal (side, dive pose, head close-up, cutaway), ships/boats, stick figures, paper props (receipt, form, book, document), stamps, UI dialog, meters/charts.
- Text: small (about 2.5% of frame height), uppercase bold sans from brand.json, white; threat text red with a thin underline; safe/scan green with a check. Max 2 text items on screen, placed in the world (top-center, under or beside the subject). No pill stacks.
- Motion: camera always drifts (1-3% scale or a slow pan); push-ins to details, follow-dives with a scrolling depth ruler, top-down spotlight shots. Subjects swim with body undulation, objects enter with eased slides or springs, counters and meters fill, stamps slam, impacts fire flash + shockwave ring + debris + 4-frame shake. Scene changes: 6-10 frame blur dissolve.

## Step 9 - Build and check
One Chapter_XX.tsx per chapter in studio/src/videos/<slug>/; inside it each SCENE is a `<Sequence>` from its first beat's start_frame to its last beat's end_frame, and each beat's addition is timed with `useCurrentFrame()` relative to the scene (elements stay on screen once added). Build from shared library components (OceanBackground, SurfaceSet, PaperSet, RadarSet, YouCharacter, animal components, MeasureLine, Counter, Meter, IconArray, Pie, DepthRuler, SonarRings, OptionsList, Stamp, PaperProp, StickFigure, ImpactFX, StockClip with credit, SmallLabel, ChannelBug). Main.tsx holds `<Audio>` + chapters + ambient music at about -20 dB.
Reusable tools live in D:\DepthPOV\tools\ (voice.py, stock.py, stock_pick.py, sfx.py) and the visual library in studio/src/lib/ (core.tsx engine with Scene/Show/Tag/Sfx/Count, sets.tsx, art.tsx, ui.tsx); reuse and extend them, never start from scratch. Run `npx tsc --noEmit`. Then QA against the reference: render a contact sheet of one still every 4 s, compare it side by side with references/visual-style.md, and fix any scene that looks like a slide (static, icon-like, text-heavy) before rendering `out.mp4`.

## Step 10 - Packaging
packaging.md: 5 titles (main = "Why You'd Never Want To Meet A [ANIMAL]"), 5 thumbnail texts (2-3 words preferred, 4 max, mark the one red word, usually YOU, not repeating the title), 1 thumbnail image prompt (black-and-white pen-and-ink stipple engraving, pure black background, giant [ANIMAL] filling right two-thirds and bleeding off frame, the brand's tiny "you" character on the left third, no text, 16:9), description opening with the channel_name tagline, chapter timestamps from timing.json, a Sources section listing every source_url from facts.json, and a Footage section crediting each Pixabay clip (author + link). Render thumbnail text with a Remotion `<Still>` (1280x720) over the generated image so font and placement stay consistent. The user saves the image in assets/thumbnails/. Thumbnail rules: one line of text near the TOP edge with a clear margin (about 40-50 px, never cramped or bleeding off); 2-3 words preferred, 4 max; exactly ONE word in red (#E8322E) - YOU or the most important word - the rest white; text must not cover or crowd the subjects, so shift the image down to open a dark band for the text and keep a visible gap to the animal; add a curved red arrow from near the text to the tiny "you" diver, its head stopping just short of the diver. Export 2 word variants (thumb_A, thumb_B) for testing.

When the user approves the video, finalize: copy the approved render to videos/<slug>/FINAL/ as "<main title> - <channel_name>.mp4", together with the chosen thumbnail (main + alt) and packaging.md, and tell the user that folder is ready to upload. Never delete earlier renders unless the user asks.
