# Hue Graphics Mobile Audit Report

## Critical Issues

- Mobile navigation is too compressed at small widths. The desktop navigation is hidden below large screens, but the header still keeps several CTA buttons visible, which can crowd 320px and 375px screens.
- Service links are not easy to reach from the mobile header. Customers on phones need a simple path to Screen Printing, Embroidery, DTF, Signs & Banners, and the catalog.
- Several hero sections use desktop-scale spacing and type on mobile, which pushes primary CTA buttons lower than needed.
- Estimator and catalog workflows have dense controls that need stronger mobile stacking, larger tap targets, and clearer spacing between actions.
- The floating quote basket works, but its mobile trigger and drawer need more phone-friendly sizing, spacing, and summary visibility.
- Long labels, uppercase headings, and multi-button card actions can create cramped layouts on 320px screens.

## Recommended Improvements

- Add a simplified mobile menu with primary navigation, services, quote tools, and contact links.
- Keep desktop header behavior intact while reducing mobile CTA clutter.
- Use full-width controls and 44px minimum tap targets for forms, buttons, selects, and quote actions.
- Tighten mobile hero padding and adjust responsive heading sizes so calls to action appear sooner.
- Improve estimator form layouts with clearer mobile spacing and full-width actions.
- Improve catalog product cards so images, details, and quote buttons scan cleanly on phones.
- Make the quote basket trigger easier to tap and keep quote totals more visible on mobile.
- Add global overflow protection to prevent horizontal scrolling.
- Preserve desktop visual layout by applying changes primarily through mobile-first and responsive classes.

## Nice-To-Have Improvements

- Add automated screenshot checks for the key pages at 320px, 375px, 390px, 430px, and 768px.
- Audit remote and catalog images for explicit dimensions, lazy loading, and consistent placeholders.
- Add reduced-motion alternatives for animated galleries and quote UI transitions.
- Add deeper Core Web Vitals monitoring after deployment to confirm real-device performance.
