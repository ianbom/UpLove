"""Verify local photography; pass --download to refresh it from Pexels."""

import argparse
import io
import json
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import urlopen

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--download", action="store_true")
args = parser.parse_args()
credits = (ROOT / "docs/asset-credits.md").read_text(encoding="utf-8")
ids = re.findall(r"`public/images/pexels-(\d+)\.webp`", credits)
wide = {"33478087", "7240876", "32244627", "39842677", "34362952", "40801628", "8526942", "39310979"}


def download(photo_id):
    width = 1920 if photo_id in wide else 1200
    url = f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg?auto=compress&cs=tinysrgb&w={width}"
    with urlopen(url, timeout=45) as response:
        photo = ImageOps.exif_transpose(Image.open(io.BytesIO(response.read()))).convert("RGB")
    target = ROOT / "public/images" / f"pexels-{photo_id}.webp"
    temporary = target.with_suffix(".tmp")
    photo.save(temporary, "WEBP", quality=82, method=6)
    temporary.replace(target)


if args.download:
    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(download, ids))

source = (ROOT / "src/data/products.ts").read_text(encoding="utf-8-sig")
products = json.loads(source.split("export const products: Product[] = ", 1)[1].split(";\n\nexport const getProduct", 1)[0])
assets = json.loads((ROOT / "src/data/assets.ts").read_text(encoding="utf-8").split("export const assets = ", 1)[1].rstrip().removesuffix(";"))
collection_source = (ROOT / "src/data/collections.ts").read_text(encoding="utf-8-sig")
collections = json.loads(collection_source.split("export const collections: Collection[] = ", 1)[1].split(";\n\nexport const getCollection", 1)[0])
category_routes = {"/category/" + slug for slug in {"kebaya", "dress", "ready-to-wear"} | {collection["slug"] for collection in collections}}
assert all(hero["href"] in category_routes for hero in assets["heroes"])
assert len(products) == len({p["slug"] for p in products}) == 48
assert len(ids) == len(set(ids)) == 67
for filename in re.findall(r'"(/images/[^"\n]+\.webp)"', source + (ROOT / "src/data/assets.ts").read_text(encoding="utf-8")):
    assert (ROOT / "public" / filename.lstrip("/")).is_file(), filename
for photo_id in ids:
    with Image.open(ROOT / "public/images" / f"pexels-{photo_id}.webp") as photo:
        assert photo.format == "WEBP" and photo.width >= 600 and photo.height >= 600, photo_id
        photo.verify()
for product in products:
    assert product["price"] > 0 and product["images"] and product["variants"]
    assert product["readyStock"] == any(size["stock"] > 0 for variant in product["variants"] for size in variant["sizes"])
print("48 distinct product slugs; 67 credited WebPs; all image paths, hero routes and stock states valid.")
