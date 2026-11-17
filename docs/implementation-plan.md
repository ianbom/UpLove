# UpLove implementation

Approved plan: recreate the rendered composition of https://rtw.ivorystudio.id/ with UpLove identity and Olive/Ivory palette. Frontend only. No payments, backend, auth, analytics, or customer-data transmission.

Decisions: licensed internet stock photography replaces reference imagery; product options are size, color, quantity only; Indonesian main copy, IDR; local orders saved before cart is cleared; no fake customer endorsements or physical stores.

1. Theme, typed contracts, licensed catalogue and imagery.
2. Shared header/footer, homepage, catalogue/category and product details.
3. Persisted cart/wishlist, validated checkout, local order confirmation.
4. About, contact, FAQ, editorial gallery, atelier/appointment, articles/privacy.
5. Assertion checks, lint/types/build, browser shopping flow, six-width visual review.

Reference: header80.8px, hero1920:784; main container1280px/16px padding; portrait9:16 cards; homepage4/2 columns; category4/3/2; 24px desktop/16px mobile gaps; right cart448px; mobile menu below header. Homepage section order: hero, flagship products, atelier banner, ready stock, two square category banners, asymmetric editorial gallery, footer.

Design read: photography is the focal point, generous measured whitespace, serif wordmark/editorial headings, flat controls. ENERGY2 / RHYTHM3 / MOTION1. Lucide icons communicate only shopping/navigation. Olive small-label buttons use#747343 for4.58:1 contrast with Ivory; original Olive token#767545 retained.
