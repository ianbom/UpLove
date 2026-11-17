"""Import reviewed product photographs from @uplove with Instaloader 4.16."""

import argparse
import json
import re
import shutil
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

import instaloader
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".cache/instagram"
INDEX = CACHE / "candidates.json"
MANIFEST = ROOT / "src/data/instagram-posts.json"
LIMIT = 50


def shortcode(value):
    if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9_-]{5,30}", value):
        raise ValueError("Invalid Instagram shortcode")
    return value


def image_url(value):
    parsed = urlparse(value)
    host = parsed.hostname or ""
    if parsed.scheme != "https" or parsed.username or parsed.password or not any(
        host == domain or host.endswith("." + domain) for domain in ("cdninstagram.com", "fbcdn.net")
    ):
        raise ValueError("Expected an HTTPS Instagram image CDN URL")
    return value


def read_json(path, default):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def loader():
    return instaloader.Instaloader(
        download_videos=False, download_video_thumbnails=False, download_geotags=False,
        download_comments=False, save_metadata=False, post_metadata_txt_pattern="",
        max_connection_attempts=1, request_timeout=30, fatal_status_codes=[401, 403, 429], quiet=True,
    )


def cache_image(client, post, index):
    folder = CACHE / "photos" / shortcode(post["shortcode"])
    folder.mkdir(parents=True, exist_ok=True)
    stem = f"{index + 1:02d}"
    matches = [folder / (stem + extension) for extension in (".jpg", ".jpeg", ".webp", ".png")]
    target = next((path for path in matches if path.exists()), None)
    if target is None:
        client.download_pic(str(folder / stem), image_url(post["images"][index]), datetime.fromisoformat(post["date"]))
        target = next((path for path in matches if path.exists()), None)
    if target is None:
        raise ValueError("Instagram did not return a supported photograph")
    with Image.open(target) as picture:
        picture.verify()
    return target


def contact_sheets(posts):
    CACHE.mkdir(parents=True, exist_ok=True)
    for start in range(0, len(posts), 20):
        canvas = Image.new("RGB", (1200, 1560), "#F8F7F2")
        draw = ImageDraw.Draw(canvas)
        for offset, post in enumerate(posts[start:start + 20]):
            files = sorted((CACHE / "photos" / shortcode(post["shortcode"])).glob("01.*"))
            if not files:
                continue
            with Image.open(files[0]) as photo:
                tile = ImageOps.contain(ImageOps.exif_transpose(photo).convert("RGB"), (280, 340))
            x, y = (offset % 4) * 300, (offset // 4) * 312
            tile.thumbnail((280, 270))
            canvas.paste(tile, (x + (300 - tile.width) // 2, y))
            draw.text((x + 8, y + 274), f"{start + offset + 1:02d} {post['shortcode']}", fill="#292B25")
            label = re.sub(r"\s+", " ", post["caption"]).encode("ascii", "replace").decode()[:43]
            draw.text((x + 8, y + 290), label, fill="#292B25")
        canvas.save(CACHE / f"contact-{start // 20 + 1:02d}.jpg", quality=90)


def scan(count):
    posts = read_json(INDEX, [])
    seen = {post["shortcode"] for post in posts}
    with loader() as client:
        profile = instaloader.Profile.from_username(client.context, "uplove")
        for post in profile.get_posts():
            if len(posts) >= count:
                break
            if post.shortcode in seen or post.is_video:
                continue
            pictures = [node.display_url for node in post.get_sidecar_nodes() if not node.is_video] if post.typename == "GraphSidecar" else [post.url]
            if not pictures:
                continue
            item = {"shortcode": shortcode(post.shortcode), "date": post.date_utc.isoformat(),
                    "caption": post.caption or "", "images": [image_url(url) for url in pictures]}
            cache_image(client, item, 0)
            posts.append(item)
            seen.add(item["shortcode"])
            write_json(INDEX, posts)
            print(f"Candidate {len(posts):03d}: {item['shortcode']} ({len(pictures)} photos)", flush=True)
    contact_sheets(posts)
    print(f"Review {len(posts)} candidates in {CACHE}", flush=True)


def validate_review(rows, candidates, require_full=False):
    if not isinstance(rows, list) or not 1 <= len(rows) <= LIMIT or (require_full and len(rows) != LIMIT):
        raise ValueError(f"Expected {'exactly' if require_full else 'up to'} {LIMIT} reviewed posts")
    codes = set()
    for row in rows:
        if not isinstance(row, dict) or not {"shortcode", "category", "name", "description", "color", "colorHex", "photos"} <= row.keys():
            raise ValueError("Incomplete product review")
        code = shortcode(row["shortcode"])
        if code in codes or code not in candidates:
            raise ValueError("Duplicate or unknown reviewed post")
        codes.add(code)
        if row["category"] not in ("dress", "kebaya", "ready-to-wear"):
            raise ValueError("Unknown product category")
        for key in ("name", "description", "color"):
            if not isinstance(row[key], str) or not 2 <= len(row[key].strip()) <= 600:
                raise ValueError(f"Invalid reviewed {key}")
        if not isinstance(row["colorHex"], str) or not re.fullmatch(r"#[0-9A-Fa-f]{6}", row["colorHex"]):
            raise ValueError("Expected a six-digit product color")
        selected = row["photos"]
        if not isinstance(selected, list) or not selected or any(type(index) is not int for index in selected):
            raise ValueError("Photo selection must be a nonempty list of slide numbers")
        if len(selected) != len(set(selected)) or any(not 1 <= index <= len(candidates[code]["images"]) for index in selected):
            raise ValueError("Invalid reviewed photo selection")


def reviewed_posts(require_full=False):
    rows = read_json(MANIFEST, [])
    candidates = {post["shortcode"]: post for post in read_json(INDEX, [])}
    validate_review(rows, candidates, require_full)
    return rows, candidates


def download():
    rows, candidates = reviewed_posts()
    with loader() as client:
        for position, row in enumerate(rows, 1):
            post = candidates[row["shortcode"]]
            for index in row["photos"]:
                cache_image(client, post, index - 1)
            print(f"Gallery {position:02d}/{len(rows)}: {row['shortcode']} ({len(row['photos'])} photos)", flush=True)
    gallery_sheets(rows)


def gallery_sheets(rows):
    # ponytail: Fifty posts use visual review; automate classification only for recurring imports.
    tiles = [(row, index) for row in rows for index in row["photos"]]
    for start in range(0, len(tiles), 24):
        canvas = Image.new("RGB", (1440, 1320), "#F8F7F2")
        draw = ImageDraw.Draw(canvas)
        for offset, (row, index) in enumerate(tiles[start:start + 24]):
            folder = CACHE / "photos" / shortcode(row["shortcode"])
            files = [p for p in folder.glob(f"{index:02d}.*") if p.suffix in (".jpg", ".jpeg", ".webp", ".png")]
            if len(files) != 1:
                raise ValueError(f"Missing or ambiguous photo: {row['shortcode']}/{index:02d}")
            with Image.open(files[0]) as photo:
                tile = ImageOps.contain(ImageOps.exif_transpose(photo).convert("RGB"), (224, 292))
            x, y = (offset % 6) * 240, (offset // 6) * 330
            canvas.paste(tile, (x + (240 - tile.width) // 2, y))
            draw.text((x + 4, y + 298), f"{row['shortcode']} / {index:02d}", fill="#292B25")
        canvas.save(CACHE / f"gallery-{start // 24 + 1:02d}.jpg", quality=90)


def product_data():
    source = ROOT / "src/data/products.ts"
    original = CACHE / "products-before-import.ts"
    text = (original if original.exists() else source).read_text(encoding="utf-8-sig")
    return json.JSONDecoder().raw_decode(text.split("export const products: Product[] = ", 1)[1])[0]


def slugify(value):
    text = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def apply():
    rows, candidates = reviewed_posts(require_full=True)
    templates = product_data()
    products = []
    files = []
    counters = {}
    for position, row in enumerate(rows):
        code = row["shortcode"]
        choices = [product for product in templates if product["category"] == row["category"]]
        counter = counters.get(row["category"], 0)
        template = choices[counter % len(choices)]
        counters[row["category"]] = counter + 1
        images = []
        for index in row["photos"]:
            folder = CACHE / "photos" / code
            matches = [p for p in folder.glob(f"{index:02d}.*") if p.suffix in (".jpg", ".jpeg", ".webp", ".png")]
            if len(matches) != 1:
                raise ValueError(f"Missing or ambiguous photo: {code}/{index:02d}")
            with Image.open(matches[0]) as photo:
                photo.verify()
            public_path = f"/insta/{code}/{index:02d}.jpg"
            images.append(public_path)
            files.append((matches[0], ROOT / "public" / public_path.lstrip("/")))
        product_id = "uplove-ig-" + code
        sizes = [dict(size) for size in template["variants"][0]["sizes"]]
        ready = any(size["stock"] > 0 for size in sizes)
        collections = [value for value in template["collections"] if value not in ("ready-stock", "new-arrivals")]
        collections += (["ready-stock"] if ready else []) + (["new-arrivals"] if position < 12 else [])
        slug = slugify(row["name"] + " " + code)
        products.append({
            "id": product_id, "slug": slug, "name": row["name"], "category": row["category"],
            "collections": collections, "price": template["price"], "description": row["description"],
            "material": "Komposisi bahan belum tersedia. Lihat detail busana pada foto dan panduan ukuran.",
            "care": template["care"], "images": images,
            "variants": [{"id": product_id + "-main", "color": row["color"], "colorHex": row["colorHex"], "sizes": sizes, "images": images}],
            "readyStock": ready, "newArrival": position < 12, "popularity": 1000 - position,
            "createdAt": candidates[code]["date"].rstrip("Z") + "Z",
        })
    if len({p["slug"] for p in products}) != LIMIT:
        raise ValueError("Product slugs must be unique")
    for source, target in files:
        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as photo:
            if photo.format == "JPEG":
                shutil.copyfile(source, target)
            else:
                ImageOps.exif_transpose(photo).convert("RGB").save(target, "JPEG", quality=94)
    target = ROOT / "src/data/products.ts"
    original = CACHE / "products-before-import.ts"
    if not original.exists():
        shutil.copyfile(target, original)
    temporary = target.with_suffix(".tmp")
    temporary.write_text('import type { Product } from "../types/shop.ts";\n\nexport const products: Product[] = ' + json.dumps(products, ensure_ascii=False, indent=2) + ';\n\nexport const getProduct = (slug: string): Product | undefined => products.find((product) => product.slug === slug);\n', encoding="utf-8")
    temporary.replace(target)
    print(f"Published {len(products)} products and {len(files)} reviewed photographs.")


def self_test():
    assert shortcode("Dc-XFUBCwAD") == "Dc-XFUBCwAD"
    assert image_url("https://scontent.cdninstagram.com/photo.jpg")
    for function, value in [(shortcode, "../secret"), (shortcode, ""),
                            (image_url, "http://scontent.cdninstagram.com/photo.jpg"),
                            (image_url, "https://cdninstagram.com.evil.test/photo.jpg")]:
        try:
            function(value)
        except ValueError:
            continue
        raise AssertionError(value)
    assert slugify("Lumière Dress DOaN_VukfGl") == "lumiere-dress-doan-vukfgl"
    sample = {"shortcode": "Test00001", "name": "Ivory Dress", "category": "dress", "color": "Ivory",
              "colorHex": "#E8E0D1", "description": "Dress with a lace bodice.", "photos": [1]}
    candidates = {f"Test{i:05d}": {"images": ["photo"]} for i in range(LIMIT)}
    rows = [{**sample, "shortcode": code} for code in candidates]
    validate_review(rows, candidates, require_full=True)
    invalid = [rows[:-1], rows + [rows[0]], [rows[0]] * LIMIT,
               [{**row, "photos": [1, 1]} for row in rows],
               [{**row, "photos": [2]} for row in rows],
               [{**row, "category": "unknown"} for row in rows]]
    for selection in invalid:
        try:
            validate_review(selection, candidates, require_full=True)
        except ValueError:
            continue
        raise AssertionError("Invalid catalogue passed review")
    print("Instagram import checks passed: safe URLs/paths, slugs, exact count, unique posts and reviewed slides.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["scan", "download", "sheets", "apply", "self-test"])
    parser.add_argument("--count", type=int, default=80)
    args = parser.parse_args()
    try:
        if args.action == "scan":
            if not 1 <= args.count <= 500:
                raise ValueError("Candidate count must be between 1 and 500")
            scan(args.count)
        elif args.action == "download":
            download()
        elif args.action == "sheets":
            gallery_sheets(reviewed_posts()[0])
        elif args.action == "apply":
            apply()
        else:
            self_test()
    except (instaloader.InstaloaderException, OSError, ValueError) as error:
        raise SystemExit(f"Import stopped; existing catalogue unchanged. {type(error).__name__}: {error}") from error
