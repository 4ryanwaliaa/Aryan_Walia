# Keeping portfolio claims current

Review product descriptions, links, availability wording and service promises before each release and periodically thereafter. Every number the portfolio shows should have a public source and a date in the table below. If a figure can no longer be confirmed at its source, update it or remove it.

## Dated figures

Last checked: 15 November 2026. All of these live in `components/portfolioData.js` (`proofs`, `apps`, and the `metrics` on each project).

| Claim on the site | Value | Source |
| --- | --- | --- |
| MyRecon installs | 1K+ | [Google Play listing](https://play.google.com/store/apps/details?id=com.Myrecon.osint) |
| MyRecon rating | 4.7 from 50 reviews | Same listing |
| MyRecon last updated | Nov 8, 2026 | Same listing |
| Wake Me installs | 100+ | [Google Play listing](https://play.google.com/store/apps/details?id=makeme.aryan.makeme) |
| Wake Me rating | 4.3 from 8 reviews | Same listing |
| Wake Me last updated | Nov 10, 2026 | Same listing |
| Android apps on Google Play | 2 | [Developer page](https://play.google.com/store/apps/developer?id=Aryan+Walia) |
| Security tools in the BugSnaps toolkit | 4 (MyPentest, MyRecon, EndpointRadar, PhishLens) | [bugsnaps.in/products](https://bugsnaps.in/products) |
| MyPentest checks per assessment | 56 (32 passive, 24 safe-active) | [bugsnaps.in](https://bugsnaps.in) homepage |
| MyRecon platform coverage | 500+ standard, 3,000+ extended | [myrecon.xyz](https://www.myrecon.xyz) |
| EndpointRadar free workspace | Up to 100 scan records | [bugsnaps.in/endpointradar](https://bugsnaps.in/endpointradar) |
| PhishLens batch review | Up to 100 links | [bugsnaps.in/phishing-detector](https://bugsnaps.in/phishing-detector) |
| Current role | Analyst at Deloitte, from November 2026 | LinkedIn profile |

The MyPentest check count is published on the product's own homepage, which is why it now appears here. It is the deployed figure, not a local test count. If the homepage stops stating it, take it off the portfolio too.

The MyRecon review quote on the Google Play shelf is copied from a public review on the listing, shown without the reviewer's name. Replace it if the review is removed.

## What to re-check

- [MyPentest product](https://bugsnaps.in/mypentest): feature, pricing and report claims against the product and scanner source.
- [MyRecon source and documentation](https://github.com/4ryanwalia/Myrecon): supported search modes, platform coverage and limits; interfaces do not necessarily offer identical coverage.
- [MyRecon on Google Play](https://play.google.com/store/apps/details?id=com.Myrecon.osint): rating, installs, update date and the feature list.
- [Wake Me on Google Play](https://play.google.com/store/apps/details?id=makeme.aryan.makeme): rating, installs, update date and the feature list.
- [EndpointRadar](https://bugsnaps.in/endpointradar) and [PhishLens](https://bugsnaps.in/phishing-detector): beta or availability wording and the stated limits.
- [BugSnaps](https://bugsnaps.in): current services and the product line.

## Assets taken from the live products

- App icons and store posters in `public/wakeme-icon.png` and `public/apps/` come from the Google Play listings.
- `public/myrecon-logo.svg` is the mark served by myrecon.xyz.
- Screenshots in `public/shots/` were captured from the live sites on 15 November 2026.
- `public/phishlens-logo.svg` was drawn for this portfolio. PhishLens has no official logo on bugsnaps.in yet; swap this file when one exists.
