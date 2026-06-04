# Pricing App Handoff

The website catalog is a project quote starter only. It should collect product
selections and hand the project data to the separate pricing app. Pricing rules
must stay inside the pricing app repo.

## Website Handoff URL

Placeholder pricing app URL:

```text
https://quotes.huegraphics.cc/apparel
```

The catalog currently builds URLs in this shape:

```text
https://quotes.huegraphics.cc/apparel?source=website-catalog&method=screenprint&sameDesign=true&totalQuantity=48&items=ENCODED_JSON&project=ENCODED_JSON
```

## Query Parameters

- `source`: `website-catalog`
- `method`: `screenprint`, `dtf`, `embroidery`, or `not-sure`
- `sameDesign`: `true`, `false`, or `unsure`
- `totalQuantity`: total pieces across all selected catalog items
- `items`: JSON array of selected products
- `project`: JSON object containing the full project quote starter payload

## Item Payload

Each item includes:

```json
{
  "productName": "Gildan - Heavy Cotton 100% Cotton T-Shirt.",
  "style": "5000",
  "sku": "5000",
  "brand": "Gildan",
  "color": "Black",
  "quantity": 24,
  "sizes": {}
}
```

## Project Payload

The `project` JSON includes:

- `source`
- `decorationMethod`
- `decorationMethodLabel`
- `sameDesign`
- `sameDesignLabel`
- `totalQuantity`
- `notes`
- `items`

## Pricing App Responsibilities

The pricing app should:

- Read incoming query parameters from the website catalog.
- Decode the project/items data.
- Preload selected products into the quote builder.
- Group items by same design when `sameDesign=true`.
- Calculate screen printing eligibility based on total compatible quantity, not
  just one garment style.
- Continue asking pricing-specific questions inside the pricing app:
  - print locations
  - ink colors
  - light vs dark garment setup
  - white underbase
  - sizes
  - quantities
  - due date
  - artwork upload
- Use the pricing app's own pricing rules for starting prices:
  - screen print "from" pricing should use the 1-color, 1-side setup.
  - embroidery "from" pricing should use the 5,000-stitch setup.
- Keep all pricing logic inside the pricing app repo.
- Do not duplicate pricing logic in this website repo.

## Notes

The website should remain a catalog and project handoff experience. It can give
eligibility guidance, but it should not calculate final pricing.
