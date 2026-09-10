# Visual upgrade 2.0

## Audit and scope
The live nova941.com was an earlier static export of this same site: seven pages, four service routes, anchor navigation, phone contact, no contact form. This checkout additionally contains the previously requested SMS links, corrected domain, red artwork and mountain artwork. These features and all existing routes/content are retained. No real projects, reviews or credentials were added.

## Design system
Warm paper #f5f3ed, charcoal #292a26, restrained NOVA red #a3392c. System Helvetica stack avoids font downloads. Display type uses clamp; body remains 15–18px. Shared gutters 24–100px, major section spacing 80–170px. Landscape hero, staggered services, detail diptych, small brand signature, full mountain artwork, quiet process and service area, charcoal contact. Native links and CSS hover transitions only; reduced motion respected.

## Photography
All interiors are inspiration, clearly labeled on the page, not NOVA projects. Preserve these labels until replacing images with verified NOVA work. Image source and display are isolated in the existing page; replace src, dimensions, alt and attribution together.
- Existing living room: GoodLifeConstruction, https://unsplash.com/photos/e0oJLc5FYsg
- Kitchen: Franco Debartolo, https://unsplash.com/photos/PkV2k48-N6E (Unsplash License, checked 2026-09-07)
- Bathroom: Peter Muniz, https://unsplash.com/photos/9OKuf13OidA (Unsplash License, checked 2026-09-07)
- Red NOVA art and Same Sky artwork: supplied by owner.
The detail images are intentional crops of reference photos, not construction progress documentation.

## Delivery
Sites remains a private noindex preview. The standalone Netlify export retains public canonical URLs, metadata, structured data, robots, sitemap and all seven routes. Production nova941.com needs the updated Netlify files uploaded to its connected repository. No public host or audience changes are made by the preview publication.

## Validation
Production build passes. Netlify export passes existing seven-route checks for links, assets, one H1, canonical domain, phone, executable-script exclusion, robots and sitemap. Browser inspected 320, 390, 768 and desktop widths. Original site has no forms; phone/SMS links are the conversion flow. Full scaffold lint has existing Next anchor/image conventions (native HTML is intentional for the static export) and unrelated unused chart component typing errors; targeted app lint excludes those two HTML conventions. No new cosmetic dependencies.
