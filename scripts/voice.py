"""Generate ElevenLabs voice + timing.json for a DepthPOV video.

Usage: python voice.py <video_dir>
Reads D:\\DepthPOV\\.env, <video_dir>\\script_tagged.txt (### chapter headers),
<video_dir>\\beats.json. Writes voice_partN.mp3/json, voice.mp3, timing.json.
Never prints key values.
"""
import base64, json, os, re, subprocess, sys, time
import requests

ROOT = r"D:\DepthPOV"
FPS = 30
MAX_CHARS = 9500
TAG_RE = re.compile(r"\[[a-z ]+\]")


def load_env():
    env = {}
    with open(os.path.join(ROOT, ".env"), encoding="utf-8-sig") as f:
        for ln in f:
            if "=" in ln and not ln.strip().startswith("#"):
                k, v = ln.split("=", 1)
                env[k.strip()] = v.strip().strip('"')
    for k in ("ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID", "ELEVENLABS_MODEL_ID"):
        if not env.get(k):
            sys.exit(f"Missing {k} in .env")
    return env


def read_chapters(path):
    chapters, cur = [], None
    for ln in open(path, encoding="utf-8"):
        ln = ln.rstrip("\n")
        if ln.startswith("### "):
            cur = {"name": ln[4:], "lines": []}
            chapters.append(cur)
        elif ln.strip():
            cur["lines"].append(ln.strip())
    return chapters


def split_parts(chapters):
    """Split at the chapter boundary that best balances size, each part < MAX_CHARS."""
    sizes = [sum(len(l) + 1 for l in c["lines"]) + 1 for c in chapters]
    total = sum(sizes)
    if total <= MAX_CHARS:
        return [chapters]
    best, acc = None, 0
    for i in range(1, len(chapters)):
        acc += sizes[i - 1]
        if acc <= MAX_CHARS and total - acc <= MAX_CHARS:
            if best is None or abs(acc - total / 2) < abs(best[1] - total / 2):
                best = (i, acc)
    if best is None:
        sys.exit("Script too long for two requests; add a 3-way split.")
    return [chapters[: best[0]], chapters[best[0]:]]


def build_text(chs):
    """Return text plus per-line (start,end) char spans."""
    text, spans = "", []
    for ci, c in enumerate(chs):
        if ci:
            text += "\n"
        for l in c["lines"]:
            a = len(text)
            text += l
            spans.append((a, len(text)))
            text += "\n"
    return text.rstrip("\n"), spans


def plain(s):
    return re.sub(r"\s+", " ", TAG_RE.sub("", s)).strip()


def tts(env, text, prev_text, next_text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{env['ELEVENLABS_VOICE_ID']}/with-timestamps"
    body = {"text": text, "model_id": env["ELEVENLABS_MODEL_ID"]}
    if prev_text:
        body["previous_text"] = prev_text
    if next_text:
        body["next_text"] = next_text
    for attempt in range(3):
        r = requests.post(url, params={"output_format": "mp3_44100_128"},
                          headers={"xi-api-key": env["ELEVENLABS_API_KEY"]}, json=body, timeout=600)
        if r.status_code == 200:
            return r.json()
        print(f"  HTTP {r.status_code}: {r.text[:300]}")
        if r.status_code in (429, 500, 502, 503) and attempt < 2:
            time.sleep(10 * (attempt + 1))
            continue
        sys.exit(1)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return float(out.strip())


def line_times(text, spans, al):
    chars = al["characters"]
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    if "".join(chars) != text:
        raise ValueError("alignment text mismatch")
    # mask characters inside [tags]
    mask = [False] * len(text)
    for m in TAG_RE.finditer(text):
        for i in range(m.start(), m.end()):
            mask[i] = True
    res = []
    for a, b in spans:
        idx = [i for i in range(a, b) if not mask[i] and not text[i].isspace()]
        res.append((st[idx[0]], en[idx[-1]]))
    return res


def main(vdir):
    env = load_env()
    chapters = read_chapters(os.path.join(vdir, "script_tagged.txt"))
    beats = json.load(open(os.path.join(vdir, "beats.json"), encoding="utf-8"))
    parts = split_parts(chapters)
    texts = [build_text(p) for p in parts]
    nlines = sum(len(s) for _, s in texts)
    if nlines != len(beats):
        sys.exit(f"Line count {nlines} != beats {len(beats)}")
    for (t, spans), bi in zip(texts, [0, len(texts[0][1])]):
        for k, (a, b) in enumerate(spans):
            if plain(t[a:b]) != plain(beats[bi + k]["text"]):
                sys.exit(f"Text mismatch at beat {beats[bi + k]['id']}")

    all_times, offset, files = [], 0.0, []
    for i, (t, spans) in enumerate(texts):
        mp3 = os.path.join(vdir, f"voice_part{i + 1}.mp3")
        js = os.path.join(vdir, f"voice_part{i + 1}.json")
        if os.path.exists(mp3) and os.path.exists(js):
            data = json.load(open(js, encoding="utf-8"))
            print(f"Part {i + 1}: using cached audio")
        else:
            prev_t = plain(texts[i - 1][0])[-500:] if i > 0 else None
            next_t = plain(texts[i + 1][0])[:500] if i + 1 < len(texts) else None
            print(f"Part {i + 1}: {len(t)} chars -> ElevenLabs ({env['ELEVENLABS_MODEL_ID']})")
            resp = tts(env, t, prev_t, next_t)
            open(mp3, "wb").write(base64.b64decode(resp["audio_base64"]))
            data = {"alignment": resp.get("alignment"), "normalized_alignment": resp.get("normalized_alignment")}
            json.dump(data, open(js, "w", encoding="utf-8"))
        times = line_times(t, spans, data["alignment"])
        all_times += [(a + offset, b + offset) for a, b in times]
        offset += duration(mp3)
        files.append(mp3)

    out = os.path.join(vdir, "voice.mp3")
    lst = os.path.join(vdir, "_concat.txt")
    open(lst, "w", encoding="utf-8").write("".join(f"file '{os.path.basename(f)}'\n" for f in files))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c:a", "libmp3lame", "-b:a", "192k", out], check=True, cwd=vdir)
    os.remove(lst)
    total = duration(out)

    timing = []
    for k, (b, (s, e)) in enumerate(zip(beats, all_times)):
        nxt = all_times[k + 1][0] if k + 1 < len(all_times) else total
        sf = round(s * FPS) if k else 0
        ef = round(nxt * FPS) if k + 1 < len(all_times) else round(total * FPS)
        timing.append({"beat_id": b["id"], "start_s": round(s, 3), "end_s": round(e, 3),
                       "start_frame": sf, "end_frame": ef})
    json.dump({"fps": FPS, "duration_s": round(total, 3), "duration_frames": round(total * FPS),
               "beats": timing}, open(os.path.join(vdir, "timing.json"), "w", encoding="utf-8", newline="\n"), indent=1)
    print(f"voice.mp3 {total:.1f}s ({total / 60:.2f} min), {len(timing)} beats timed")


if __name__ == "__main__":
    main(sys.argv[1])
