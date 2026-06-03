# SEO Migration Notes

## Live Site Crawl Inventory

Crawled current live site: `https://www.huegraphics.cc` / `https://huegraphics.cc`.

Public page URLs identified:

- `https://huegraphics.cc/`
- `https://huegraphics.cc/contact-us`
- `https://huegraphics.cc/request-a-quote`
- `https://huegraphics.cc/company`
- `https://huegraphics.cc/screen-printing`
- `https://huegraphics.cc/signs%2C-banners-%26-more`
- `https://huegraphics.cc/contract-printing`
- `https://huegraphics.cc/screen-print-transfers`

External links found on the old site but not treated as internal site pages:

- `https://www.companycasuals.com/...` online apparel catalog
- `https://huegraphics.company.site/...` online ordering / graduation banners
- Google Privacy Policy / Terms links

## New Route Inventory

Current Next.js routes:

- `/`
- `/about`
- `/services`
- `/screen-printing`
- `/embroidery`
- `/dtf-transfers`
- `/signs-banners`
- `/vehicle-graphics`
- `/business-printing`
- `/portfolio`
- `/contact`
- `/request-a-quote`
- `/quote-app`

## Redirect Plan

Permanent redirects added in `next.config.ts`:

| Old URL | New URL | Reason |
| --- | --- | --- |
| `/company` | `/about` | Company/about content moved to the about page. |
| `/contact-us` | `/contact` | Contact page slug changed. |
| `/signs%2C-banners-%26-more` | `/signs-banners` | Old encoded GoDaddy signs page slug replaced by clean service route. |
| `/signs,-banners-&-more` | `/signs-banners` | Decoded variant of the old signs page slug. |
| `/signs-banners-more` | `/signs-banners` | Normalized fallback variant. |
| `/signs-banners-and-more` | `/signs-banners` | Normalized fallback variant. |
| `/contract-printing` | `/screen-printing` | Old page was thin/coming soon; closest current service is screen printing. |
| `/screen-print-transfers` | `/dtf-transfers` | Old page was thin/coming soon; closest current service is DTF transfers and DTG. |

URLs preserved without redirects:

- `/`
- `/screen-printing`
- `/request-a-quote`

## Metadata Added

Unique metadata and Open Graph title/description were added to:

- Home
- About
- Services
- Screen Printing
- Embroidery
- DTF Transfers & DTG
- Signs & Banners
- Vehicle Graphics
- Business Printing
- Portfolio
- Contact
- Request a Quote
- Beta Quote App

Metadata uses local business-focused wording where appropriate, including Bethlehem, GA, Barrow County, and Northeast Georgia.

## Schema Added

LocalBusiness schema was added in `src/app/layout.tsx`.

Schema includes:

- Business name: Hue Graphics & Apparel, LLC
- Website: `https://www.huegraphics.cc`
- Phone: `770-867-3520`
- Address: 741 Harry McCarty Road, Suite 101, Bethlehem, GA 30620
- Founding date: 2013
- Family-owned and operated local print shop / custom apparel / sign shop positioning
- Services: screen printing, embroidery, DTF transfers, DTG printing, signs, banners, vehicle graphics, business printing, promotional products
- Service area: Bethlehem, Barrow County, Auburn, Winder, Statham, Monroe, Braselton, Hoschton, Jefferson, Commerce, and Northeast Georgia
- Social profiles: Facebook and Instagram

## Local SEO Copy Updates

Natural local wording was added to:

- Home hero and services copy
- Services page intro
- Service page hero copy
- Contact page metadata
- Request a Quote page intro
- LocalBusiness schema

Local terms used naturally include Bethlehem, GA, Barrow County, Auburn, Winder, Statham, Monroe, Braselton, Hoschton, Jefferson, Commerce, Northeast Georgia, and Georgia businesses/schools/churches/teams/organizations.

## Uncertain Matches

- `/contract-printing` and `/screen-print-transfers` were old thin "Coming Soon" pages. They were mapped to the closest active service routes rather than recreated as thin pages.
- No dedicated old URLs were found for embroidery, DTF transfers, vehicle graphics, business printing, or portfolio during the live crawl/search inventory.
