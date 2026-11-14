"""Generate a reusable documentary SFX library with ElevenLabs Sound Effects.

Usage: python sfx.py            (generates any missing files)
Writes D:\\DepthPOV\\assets\\sfx\\<name>.mp3 and sfx_library.json. Never prints keys.
"""
import json, os, sys, time
import requests

ROOT = r"D:\DepthPOV"
OUT = os.path.join(ROOT, "assets", "sfx")

LIB = {
    "whoosh_soft": ("soft airy whoosh transition, cinematic, clean, no music", 1.0),
    "whoosh_deep": ("deep underwater whoosh, large object passing by the camera, muffled", 1.5),
    "pop_soft": ("tiny soft UI pop, element appearing, subtle, clean", 0.5),
    "tick_ui": ("single soft digital tick, minimal user interface click", 0.5),
    "counter_roll": ("fast soft digital counter ticking up, rolling numbers, clean UI", 1.5),
    "stamp": ("heavy rubber stamp slammed on paper on a wooden desk", 0.8),
    "paper_slide": ("sheet of paper sliding onto a desk, short", 0.8),
    "impact_heavy": ("massive muffled underwater impact, hull hit, deep thud with debris", 2.0),
    "splash_big": ("large ocean splash, small boat flipping over, water crash", 2.0),
    "bubbles": ("scuba diver exhaling, regulator bubbles rising underwater, close", 2.0),
    "sonar_ping": ("single submarine sonar ping with long underwater echo", 2.0),
    "low_hum": ("very low frequency underwater rumble hum, ominous, felt more than heard", 4.0),
    "whale_moan": ("distant deep low whale moan underwater, long and haunting", 4.0),
    "heartbeat_slow": ("one slow deep heartbeat thump, muffled, cinematic", 1.5),
    "riser_tension": ("short dark cinematic tension riser, underwater, building", 3.0),
    "scan_beep": ("sci-fi scanner sweep with soft electronic beep, x-ray scan", 1.5),
    "warning_beep": ("dive computer warning alarm, three short urgent beeps", 1.5),
    "strike_line": ("quick marker pen strike-through on paper", 0.6),
    "gulp": ("enormous underwater gulp, huge mouth closing on water, deep", 2.0),
    "boat_motor": ("small outboard motor boat idling on calm sea, distant", 3.0),
}


def key():
    for ln in open(os.path.join(ROOT, ".env"), encoding="utf-8-sig"):
        if ln.startswith("ELEVENLABS_API_KEY="):
            return ln.split("=", 1)[1].strip().strip('"')
    sys.exit("ELEVENLABS_API_KEY missing")


def main():
    os.makedirs(OUT, exist_ok=True)
    k = key()
    for name, (prompt, dur) in LIB.items():
        fn = os.path.join(OUT, name + ".mp3")
        if os.path.exists(fn):
            continue
        r = requests.post("https://api.elevenlabs.io/v1/sound-generation",
                          headers={"xi-api-key": k},
                          json={"text": prompt, "duration_seconds": dur, "prompt_influence": 0.6},
                          timeout=120)
        if r.status_code != 200:
            print(f"{name}: HTTP {r.status_code} {r.text[:200]}")
            continue
        open(fn, "wb").write(r.content)
        print(f"{name}: ok ({len(r.content) // 1024} KB)")
        time.sleep(0.5)
    json.dump({n: {"prompt": p, "duration": d} for n, (p, d) in LIB.items()},
              open(os.path.join(OUT, "sfx_library.json"), "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main()
