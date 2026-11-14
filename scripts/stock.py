"""Fetch Pixabay stock videos for stock_clip beats.

Usage: python stock.py <video_dir>
Caches API responses 24 h in assets/stock/_cache, downloads one 1920x1080 (or closest)
clip per stock_query into assets/stock/<slug>/, writes <video_dir>/stock.json with credits.
"""
import hashlib, json, os, sys, time
import requests

ROOT = r"D:\DepthPOV"
CACHE = os.path.join(ROOT, "assets", "stock", "_cache")


def key():
    for ln in open(os.path.join(ROOT, ".env"), encoding="utf-8-sig"):
        if ln.startswith("PIXABAY_API_KEY="):
            return ln.split("=", 1)[1].strip().strip('"')
    return ""


def search(k, q):
    os.makedirs(CACHE, exist_ok=True)
    cf = os.path.join(CACHE, "v_" + hashlib.md5(q.encode()).hexdigest() + ".json")
    if os.path.exists(cf) and time.time() - os.path.getmtime(cf) < 86400:
        return json.load(open(cf, encoding="utf-8"))
    r = requests.get("https://pixabay.com/api/videos/",
                     params={"key": k, "q": q, "per_page": 20, "safesearch": "true", "video_type": "film"}, timeout=60)
    r.raise_for_status()
    data = r.json()
    json.dump(data, open(cf, "w", encoding="utf-8"))
    time.sleep(1)
    return data


def pick(hits, used, q):
    """First relevance-ordered hit whose tags contain the query phrase, >=1280 wide, >=5 s."""
    for h in hits:
        if h["id"] in used or q.lower() not in [t.strip().lower() for t in h.get("tags", "").split(",")]:
            continue
        if h.get("duration", 0) < 5:
            continue
        for size in ("large", "medium"):
            v = h["videos"].get(size) or {}
            if v.get("url") and v.get("width", 0) >= 1280:
                return None, h, v
    return None


def main(vdir):
    k = key()
    if not k:
        sys.exit("PIXABAY_API_KEY empty")
    slug = os.path.basename(os.path.normpath(vdir))
    outdir = os.path.join(ROOT, "assets", "stock", slug)
    os.makedirs(outdir, exist_ok=True)
    beats = json.load(open(os.path.join(vdir, "beats.json"), encoding="utf-8"))
    credits, used = [], set()
    for b in beats:
        q = b.get("stock_query")
        if not q:
            continue
        hits = search(k, q).get("hits", [])
        if b.get("stock_id"):  # manual override after visual check
            hits = [h for h in hits if h["id"] == b["stock_id"]]
            q = next((t.strip() for t in hits[0]["tags"].split(",")), q) if hits else q
        res = pick(hits, used, q)
        if not res:
            print(f"{b['id']}: nothing usable for '{q}'")
            credits.append({"beat_id": b["id"], "query": q, "file": None})
            continue
        _, h, v = res
        used.add(h["id"])
        fn = f"{b['id']}_{h['id']}.mp4"
        path = os.path.join(outdir, fn)
        if not os.path.exists(path):
            with requests.get(v["url"], stream=True, timeout=300) as r:
                r.raise_for_status()
                with open(path, "wb") as f:
                    for chunk in r.iter_content(1 << 20):
                        f.write(chunk)
        credits.append({"beat_id": b["id"], "query": q, "file": fn, "pixabay_id": h["id"],
                        "author": h.get("user"), "source_url": h.get("pageURL"),
                        "width": v["width"], "height": v["height"], "duration": h.get("duration")})
        print(f"{b['id']}: '{q}' -> {fn} {v['width']}x{v['height']} by {h.get('user')}")
    json.dump(credits, open(os.path.join(vdir, "stock.json"), "w", encoding="utf-8", newline="\n"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1])
