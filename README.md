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

The asset check uses Pillow. `--download` refreshes the licensed images; runtime needs no Python or image API. Google Fonts are downloaded during the Next.js build.

## Pages and configuration

Home, all products, dress/kebaya and nine collections, product details, wishlist, cart, checkout and confirmation, about, contact, FAQ, editorial gallery, atelier, appointments, journal and articles, privacy policy.

- Brand, navigation, placeholder contacts, site URL and shipping: `src/config/brand.ts`.
- Colors, typography and shared layout: `src/app/globals.css`.
- Catalogue and collections: `src/data/`.
- Photography provenance: [asset credits](docs/asset-credits.md).
- Reference measurements and decisions: [implementation plan](docs/implementation-plan.md).
- Build, browser and responsive results: [verification report](docs/verification.md).

## Shopping behavior and limits

48 garments; search, filters, sorting, pagination, size selection, photographed colors, galleries, size charts, persistent wishlist/cart and local order receipts. Cart quantities are checked against catalogue stock. Most garments have one photographed color; alternate images appear only where available.

Licensed Pexels photography replaces reference assets because their reuse rights were unconfirmed. Layout follows the reference; photography differs. No customer testimonials or real store/contact claims are included.

No backend, authentication, inventory service, payment integration or shipping service. Checkout validates fields, saves an order in LocalStorage, clears the cart and opens its receipt. It does not charge money or initiate delivery. Contact and appointment forms produce local summaries; they send nothing. Clearing browser storage removes saved shopping data. Private browsing and storage restrictions can prevent persistence. The privacy page explains this behavior.

No credentials or environment variables are required. Set the brand site URL and contact placeholders before publishing. Next.js image optimization runs through the framework; no custom API routes exist.
