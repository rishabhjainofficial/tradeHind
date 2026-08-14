# TradeHind — Master Implementation Plan
*Last updated: August 15, 2026 | Full codebase + competitive analysis merged*

---

## What TradeHind Is

A hybrid B2B marketplace combining:
- **IndiaMART model** — wholesale RFQs, buy-lead credit marketplace, seller CRM Kanban, GST quotation generator
- **Justdial model** — hyperlocal directory, instant call/WhatsApp, geo-proximity ranking, TrustSEAL badges

**Positioning**: India's only B2B marketplace where fake leads are auto-refunded, no annual lock-in, and sellers own their buyer data.

---

## Competitor Gaps We're Filling (Research-Based)

From Reddit, Voxya, MouthShut, Quora, consumer courts — real user pain points:

| Competitor Pain Point | TradeHind Answer |
|---|---|
| IndiaMART ₹40K–₹1.2L/yr, no refund on fake leads | Pay-per-credit from ₹999, auto-refund in 24hrs |
| Justdial ECS auto-debit, can't cancel | Cancel anytime, no auto-debit ever |
| Platform owns buyer data — sellers can't export | Sellers get CSV download of all unlocked leads |
| Same RFQ sent to 50+ sellers — race to the bottom | Max 5 sellers per broadcast RFQ |
| TrustSEAL = just paperwork check | Video-verified factory walkthrough required |
| Ranking is a black box | Transparent rank score with actionable tips |
| No repeat order infrastructure | 30-day WhatsApp re-engagement after deal closed |
| Aggressive telemarketing by platform | Zero cold calling, inbound-only sales, publicly stated |

---

## Pricing Model (60–80% cheaper than IndiaMART)

| Plan | Price | What You Get |
|---|---|---|
| **Free Listing** | ₹0 | Profile, 3 products, search visibility, call/WA button |
| **Starter Pack** | ₹999 (20 credits) | ₹50/lead. 90-day expiry. Auto-refund on fake leads |
| **Growth Pack** | ₹3,499 (100 credits) | ₹35/lead + TrustSEAL badge + rank boost + CSV export |
| **Pro Monthly** | ₹2,499/month | Unlimited leads in category+city, Gold badge, featured slot |
| **Pro Annual** | ₹19,999/year | Pro Monthly + 2 months free + brochure PDF + analytics |

**Revenue Streams:**
1. Lead Credits (core) — ₹35–50/credit
2. Pro subscriptions — recurring MRR
3. Featured listing spots — ₹2,000–5,000/month per slot
4. Value-added services — catalog photoshoot ₹2,500, brochure ₹1,499, GSTIN fast-track ₹499

---

## 9 Bugs to Fix (P0 — Executing Now)

| # | Severity | File | Bug | Fix |
|---|---|---|---|---|
| 1 | 🔴 | [`SupplierCard.tsx#L14`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/client/SupplierCard.tsx#L14), [`supplier/[id]/page.tsx#L18`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/supplier/%5Bid%5D/page.tsx#L18) | WhatsApp URL uses `supplier.userId` not phone | Add `phone` to `SellerProfile`, use it in `wa.me` |
| 2 | 🔴 | [`SupplierCard.tsx#L136`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/client/SupplierCard.tsx#L136), [`product/[id]/page.tsx#L100`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/product/%5Bid%5D/page.tsx#L100) | `tel:${supplier.userId}` — userId is not a phone | Use `seller.phone` |
| 3 | 🔴 | [`RFQWizardModal.tsx#L33`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/client/RFQWizardModal.tsx#L33), [`post-requirement/page.tsx#L23`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/post-requirement/page.tsx#L23) | Guest RFQs submit hardcoded `sunil@mehtabuilders.in` | Collect real buyer contact if not logged in |
| 4 | 🟡 | [`RoleContext.tsx#L51`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/context/RoleContext.tsx#L51) | `activeSeller` falls back to `sellers[0]` silently | Return `null` when no match |
| 5 | 🟡 | [`RoleContext.tsx#L80`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/context/RoleContext.tsx#L80) | `unlockBuyLead` has no idempotency guard | Check `unlockedBySellerIds.includes(sellerId)` first |
| 6 | 🟡 | [`seller/buyleads/page.tsx#L15`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/seller/buyleads/page.tsx#L15) | Category filter logic exists but no `<select>` rendered | Add category dropdown to filter bar |
| 7 | 🟡 | [`login/page.tsx#L19`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/login/page.tsx#L19) | Pre-filled email `rajesh@apexind.com` doesn't exist | Update to valid seed user email |
| 8 | 🟡 | [`seller/lead-manager/page.tsx#L17`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/seller/lead-manager/page.tsx#L17) | No "Closed - Lost" Kanban column | Add 5th column with `status: 'lost'` |
| 9 | 🟢 | [`Footer.tsx#L28`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/layout/Footer.tsx#L28) | Footer links to `cat_electronics` which doesn't exist | Fix to `cat_industrial` |

---

## Phase P0 — Bug Fixes (Executing Now)

### Files to modify:
- [`types.ts`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/lib/types.ts) — Add `phone` to `SellerProfile`
- [`data-store.ts`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/lib/data-store.ts) — Populate `phone` from `INITIAL_USERS`
- [`RoleContext.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/context/RoleContext.tsx) — Fix `activeSeller` fallback + unlock idempotency
- [`SupplierCard.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/client/SupplierCard.tsx) — Fix WA/phone links
- [`supplier/[id]/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/supplier/%5Bid%5D/page.tsx) — Fix WA/phone links
- [`product/[id]/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/product/%5Bid%5D/page.tsx) — Fix phone link
- [`seller/buyleads/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/seller/buyleads/page.tsx) — Add missing category filter dropdown
- [`login/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/login/page.tsx) — Fix pre-filled email
- [`Footer.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/layout/Footer.tsx) — Fix dead category link
- [`RFQWizardModal.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/client/RFQWizardModal.tsx) — Gate guest RFQ submissions
- [`post-requirement/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/post-requirement/page.tsx) — Gate guest submissions

---

## Phase P1 — Business Logic (Week 1–2)

### Files to modify/create:
- [`ranking.ts`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/lib/ranking.ts) — Category-aware ranking (+40 pts for category match)
- [`QuotationModal.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/components/seller/QuotationModal.tsx) — GST rate dropdown (5/12/18/28%)
- [`seller/lead-manager/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/seller/lead-manager/page.tsx) — "Closed - Lost" 5th column + mobile responsive
- [`types.ts`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/lib/types.ts) — Add `'lost'` to `LeadStatus`
- [NEW] [`src/app/buyer/dashboard/page.tsx`](file:///Volumes/Rish%20SSD/projects/active/tradeHind/src/app/buyer/dashboard/page.tsx) — Buyer quote inbox + RFQ tracker
- Business features tied to competitive strategy:
  - Lead quality flag + auto-refund UI in BuyLeads
  - Rank score breakdown visible to seller in dashboard
  - `isOpenNow` computed dynamically from `businessHours`

---

## Phase P2 — Production Foundation (Week 2–4)

### Architecture:
- Connect Prisma to real API routes (`src/app/api/`)
- NextAuth.js authentication with middleware protecting `/seller/*` and `/admin/*`
- Server Components for `/directory`, `/supplier/[id]`, `/product/[id]` (SEO critical)
- Programmatic SEO routes: `/suppliers/[city]/[category]`

### Monetization Infrastructure:
- [NEW] Seller credit wallet with balance + transaction history
- [NEW] Credit recharge modal with Razorpay integration stub
- [NEW] Featured listing admin controls
- [NEW] Lead CSV export for sellers (competitive differentiator)

---

## Phase P3 — Retention & Scale (Month 1–2)

### Retention features (both sides of the marketplace):

**Seller retention:**
- Monthly PDF report delivered via WhatsApp (lead stats, conversion rate)
- Rank score transparency with "do this to rank higher" tips
- Repeat order nudge: 30 days after "Closed Won" → auto-WA message to buyer
- Seller analytics: profile views, search terms that found them, product click rates

**Buyer retention:**
- Supplier shortlist + side-by-side comparison
- RFQ status tracker (how many sellers viewed/responded)
- "Source Again" one-click repeat order from saved suppliers
- Buying guides (SEO content) — "How to source marble without getting cheated"

**Platform trust (differentiators):**
- Video-verified TrustSEAL (30-sec factory video required)
- Max 5 sellers per broadcast RFQ (vs. IndiaMART's 50+)
- Zero cold calling policy, publicly stated on homepage
- PDF quotation export (branded, GSTIN, HSN codes, bank details)

---

## Phase P4 — Year 2 Vision

- **Embedded payments**: Buyer deposits through TradeHind, released after delivery → enables 1–2% commission model
- **MSME credit line**: Partner with NBFC, sellers with 6+ months transaction history get working capital loans inside app
- **WhatsApp Business API**: Full lead alerts, quote delivery, repeat order nudges via WhatsApp

---

## Go-To-Market (First 100 Sellers)

**Month 1–2**: Udaipur hyperlocal launch
- Visit Bhuwana Bypass (marble) + Hathipole (chemicals) in person
- Free 3-month Pro plan for 5 anchor sellers in exchange for video testimonial
- Handle their full profile setup (catalog photos, PDF brochure) for free

**Month 3–4**: SEO buyer acquisition
- 20 buying guides targeting zero-competition long-tail: "marble suppliers udaipur," "IPA solvent wholesale price india"
- Each article has a "Post Requirement" CTA

**Month 5–6**: Referral program
- Seller: invite → both get ₹500 credit
- Buyer: share RFQ link → 10% off next unlock

**Month 7–12**: Adjacent cities
- Bhilwara (textiles), Jodhpur (furniture), Jaipur (gems/jewelry)

---

## Revenue Projection (Conservative)

| Metric | Month 6 | Month 12 | Month 24 |
|---|---|---|---|
| Active sellers | 200 | 800 | 3,000 |
| Lead credits MRR | ₹40,000 | ₹2,00,000 | ₹8,00,000 |
| Pro subscriptions MRR | ₹50,000 | ₹3,00,000 | ₹15,00,000 |
| Featured listings + services | ₹25,000 | ₹1,25,000 | ₹5,00,000 |
| **Total MRR** | **₹1.15L** | **₹6.25L** | **₹28L** |

---

## Verification Checklist

### After P0:
- [ ] WhatsApp opens `wa.me/91<real_phone>` not `wa.me/91user_amrit`
- [ ] Phone button dials actual number
- [ ] Guest RFQ prompts for real name + phone
- [ ] Double-clicking "Unlock Lead" only deducts 1 credit
- [ ] BuyLeads has working category filter dropdown
- [ ] Footer electronics link works

### After P1:
- [ ] Marble seller ranks below chemical seller in chemical search
- [ ] GST rate dropdown on quotation (not hardcoded 18%)
- [ ] Buyer dashboard shows their RFQs + received quotes
- [ ] Seller can mark leads "Closed - Lost"
- [ ] `isOpenNow` badge reflects real current time

### After P2:
- [ ] Page refresh preserves all data (real DB)
- [ ] `/supplier/udaipur/marble-granite` Google-indexable
- [ ] Auth middleware blocks routes without session
- [ ] Credit recharge flow works end-to-end
