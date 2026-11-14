"""Download specific Pixabay video ids (from cached searches) for review.
Usage: python stock_pick.py <slug> <query>:<id> [<query>:<id> ...]"""
import json, os, sys, requests, subprocess
import stock
slug = sys.argv[1]; k = stock.key()
out = os.path.join(stock.ROOT, "assets", "stock", slug); os.makedirs(out, exist_ok=True)
for arg in sys.argv[2:]:
    q, vid = arg.rsplit(":", 1); vid = int(vid)
    h = next(h for h in stock.search(k, q)["hits"] if h["id"] == vid)
    v = h["videos"]["large"] if h["videos"]["large"].get("url") else h["videos"]["medium"]
    if v["width"] > 1920 and h["videos"]["medium"].get("width", 0) >= 1920:
        v = h["videos"]["medium"]
    fn = os.path.join(out, f"px_{vid}.mp4")
    if not os.path.exists(fn):
        with requests.get(v["url"], stream=True, timeout=300) as r:
            r.raise_for_status(); open(fn, "wb").write(r.content)
    meta = {"pixabay_id": vid, "file": f"px_{vid}.mp4", "author": h["user"], "source_url": h["pageURL"], "tags": h["tags"], "duration": h["duration"], "width": v["width"]}
    json.dump(meta, open(fn + ".json", "w", encoding="utf-8"))
    print(meta["file"], meta["author"], meta["width"], meta["duration"])
