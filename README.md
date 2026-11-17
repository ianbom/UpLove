# UpLove

Fashion storefront built with Next.js App Router, TypeScript, Tailwind CSS, customized shadcn/ui, Lucide, Motion and Zustand.

## Run locally

Requires Node.js 22.6+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production:

```sh
npm run build
npm start
```

## Checks

```sh
npm run lint
npm run typecheck
npm test
python scripts/download-assets.py
```

The asset check uses Pillow. `--download` refreshes only the Pexels library; runtime needs no Python or image API. Google Fonts are downloaded during the Next.js build.

## Instagram catalogue

50 curated posts from [@uplove](https://www.instagram.com/uplove/), 227 model/product photographs. Each post has its own `public/insta/<shortcode>/` folder. The reviewed slide numbers, names, colors and descriptions are in `src/data/instagram-posts.json`; the generated storefront data is in `src/data/products.ts`.

The importer uses [Instaloader](https://github.com/instaloader/instaloader) 4.16 and Pillow:

```sh
python -m pip install instaloader==4.16 Pillow
python scripts/import-instagram.py self-test
python scripts/import-instagram.py scan --count 120
python scripts/import-instagram.py download
python scripts/import-instagram.py sheets
python scripts/import-instagram.py apply
```

Scanning creates private candidate metadata and contact sheets in `.cache/instagram/`. Review every slide and edit the manifest before `apply`; publishing requires exactly 50 distinct, complete posts. `photos` contains one-based source slide numbers in gallery order. Posters, collages, food, group portraits and unrelated garments were excluded. A single photographed garment/color is used per product. Original JPEGs retain their bytes; WebP and MPO source slides are converted to JPEG at original dimensions. No captions, contacts, credentials or Instagram sessions are published. Access restrictions stop the importer; it does not bypass them.

Prices, sizes and stock retain the existing frontend patterns. Material composition is unspecified. New product IDs keep previous order snapshots intact; unavailable products drop from saved carts and wishlists. The import script keeps the previous dataset privately under `.cache/instagram/`.

## Pages and configuration

Home, all products, dress/kebaya and nine collections, product details, wishlist, cart, checkout and confirmation, about, contact, FAQ, editorial gallery, atelier, appointments, journal and articles, privacy policy.

- Brand, navigation, placeholder contacts, site URL and shipping: `src/config/brand.ts`.
- Colors, typography and shared layout: `src/app/globals.css`.
- Catalogue and collections: `src/data/`.
- Photography provenance: [asset credits](docs/asset-credits.md).
- Reference measurements and decisions: [implementation plan](docs/implementation-plan.md).
- Build, browser and responsive results: [verification report](docs/verification.md).

## Shopping behavior and limits

UpLove uses its own product IDs, storage keys and order prefix. Existing cart, wishlist and order data migrate automatically; previous receipt links remain valid. Legacy copies stay intact as a fallback, and customer-entered text is preserved.

50 products: 26 kebaya, 23 dresses and one ready-to-wear set; search, filters, sorting, pagination, size selection, photographed colors, galleries, size charts, persistent wishlist/cart and local order receipts. Cart quantities are checked against catalogue stock. Each product has one photographed color; all suitable model photos from its selected post appear in its gallery.

Catalogue photography comes from the Instagram account specified by the user. Existing licensed Pexels files remain for campaign/editorial placements and historical receipts. Instagram images have separate provenance; the Pexels license does not cover them. No customer testimonials or real store/contact claims are included.

No backend, authentication, inventory service, payment integration or shipping service. Checkout validates fields, saves an order in LocalStorage, clears the cart and opens its receipt. It does not charge money or initiate delivery. Contact and appointment forms produce local summaries; they send nothing. Clearing browser storage removes saved shopping data. Private browsing and storage restrictions can prevent persistence. The privacy page explains this behavior.

No credentials or environment variables are required. Set the brand site URL and contact placeholders before publishing. Next.js image optimization runs through the framework; no custom API routes exist.
