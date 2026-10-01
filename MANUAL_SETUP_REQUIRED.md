# Manual Setup Required - Digital Products Feature

**Status**: Code is complete and all automated tests pass (324/324) ✅  
**Blocker**: Environment configuration and manual verification required ⚠️

---

## Summary

The QA Agent has verified that the **code implementation is excellent and complete**:
- ✅ All 324 automated tests passing
- ✅ Security implementations verified against official docs
- ✅ Code follows established patterns
- ✅ No regressions

However, **environment/infrastructure setup** is required before the feature can be manually verified and approved.

---

## What You Need to Do

### 1. Configure Stripe API Keys (REQUIRED)

**Location**: `.env.local`

**What to do**:
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
   ```

**Why**: Required for checkout functionality and payment processing.

---

### 2. Configure Stripe Webhook Secret (REQUIRED)

**Option A: Using Stripe CLI (Recommended for local testing)**

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Start webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook secret (starts with `whsec_`)
5. Update `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```
6. **Keep the Stripe CLI running** while testing

**Option B: Using Stripe Dashboard**

1. Go to Stripe Dashboard → Developers → Webhooks
2. Create endpoint: `http://localhost:3000/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret
5. Update `.env.local` with the secret

**Why**: Required to receive purchase notifications and send download emails.

---

### 3. Verify Sanity Connectivity (REQUIRED)

The products page was returning 404 due to Sanity API connectivity issues.

**What to check**:
1. Verify network allows connections to `*.sanity.io`
2. Check if VPN is blocking connections
3. Test connectivity:
   ```bash
   curl https://kswuh3pq.api.sanity.io/v2021-10-21/data/query/production
   ```
   - **Expected**: JSON response (not DNS error)
   - **If fails**: Disable VPN, check firewall settings

**Why**: Products are stored in Sanity CMS - app cannot function without connectivity.

---

### 4. Create Test Products in Sanity Studio (REQUIRED)

**Steps**:
1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Navigate to Sanity Studio: http://localhost:3000/studio
3. Create **at least 2 digital products**:

**Product 1: Free Starter Template**
- **Name**: "Next.js Starter Template"
- **Slug**: "nextjs-starter-template" (auto-generated)
- **Description**: "A production-ready Next.js starter with TypeScript, Tailwind, and best practices"
- **Category**: "Templates"
- **Price (display)**: "Free"
- **Base Price (number)**: 0
- **Download URL**: Upload a zip file or use a test URL
- **Preview Image**: Upload product image
- **Features**: ["TypeScript setup", "Tailwind CSS", "ESLint + Prettier", "Dark mode"]
- **What's Included**: ["Source code", "Documentation", "MIT license"]
- **Published**: ✅ Check this box

**Product 2: Premium E-book**
- **Name**: "Modern Web Development Guide"
- **Slug**: "web-dev-guide" (auto-generated)
- **Description**: "Complete guide to building modern web applications"
- **Category**: "E-books"
- **Price (display)**: "$29"
- **Base Price (number)**: 29
- **Stripe Price ID**: (see next step)
- **Download URL**: Upload PDF or use test URL
- **Preview Image**: Upload ebook cover
- **Features**: ["300 pages", "Code examples", "Best practices", "PDF format"]
- **What's Included**: ["PDF download", "Bonus resources", "Lifetime updates"]
- **Published**: ✅ Check this box

**Why**: Products are needed to test catalog display, filtering, and purchase flow.

---

### 5. Create Stripe Products for Paid Items (REQUIRED for paid products)

For each **paid product** (e.g., the $29 e-book):

1. Go to Stripe Dashboard → Products
2. Click "Add product"
3. Enter product name: "Modern Web Development Guide"
4. Set price: $29.00 USD, One-time payment
5. Save product
6. **Copy the Price ID** (starts with `price_`)
7. **Go back to Sanity Studio**
8. Edit the product
9. Paste the Price ID into the **Stripe Price ID** field
10. Save

**Why**: Stripe needs a Price object to create checkout sessions for paid products.

---

### 6. Configure Resend API Key (OPTIONAL - for email testing)

If you want to test purchase confirmation emails:

1. Go to https://resend.com/api-keys
2. Create an API key
3. Update `.env.local`:
   ```bash
   RESEND_API_KEY=re_YOUR_KEY_HERE
   ```

**Note**: Email configuration is already set:
```bash
PURCHASE_EMAIL_FROM=JLang Development <orders@jlang.dev>
```

**Why**: Purchase confirmation emails include download links.

---

### 7. Restart Development Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)

# Restart
npm run dev
```

**Why**: Environment variable changes require a server restart.

---

### 8. Manual Verification Checklist

Once environment is configured, verify the feature works:

#### Visual Verification

- [ ] **Product Catalog** (http://localhost:3000/products)
  - [ ] Products display in grid
  - [ ] Product images load
  - [ ] Prices and descriptions visible
  - [ ] Category badges display
  - [ ] Search works (type "next")
  - [ ] Category filter works
  - [ ] Price filter works (Free/Paid)

- [ ] **Product Detail** (http://localhost:3000/products/nextjs-starter-template)
  - [ ] Product info displays correctly
  - [ ] Features list visible
  - [ ] Purchase/Download button shows
  - [ ] Correct button text ("Free Download" vs "Purchase Now")

- [ ] **Responsive Design**
  - [ ] Desktop: 3-column grid
  - [ ] Tablet: 2-column grid
  - [ ] Mobile: 1-column grid

- [ ] **Dark Mode**
  - [ ] Toggle works
  - [ ] Products styled correctly in dark mode

- [ ] **Browser Console**
  - [ ] No errors
  - [ ] No 404s for images
  - [ ] No React warnings

#### Functional Verification

- [ ] **Free Product Download**
  - [ ] Click "Free Download" on free product
  - [ ] Redirects to download URL immediately
  - [ ] File downloads successfully

- [ ] **Paid Product Purchase**
  - [ ] Click "Purchase Now" on paid product
  - [ ] Button shows "Processing..." with spinner
  - [ ] Redirects to Stripe Checkout page
  - [ ] Complete payment with test card: `4242 4242 4242 4242`
  - [ ] Redirects to `/products/success`
  - [ ] Success page shows order details

- [ ] **Purchase Email** (if Resend configured)
  - [ ] Email received at checkout email address
  - [ ] Subject: "Your purchase is ready - Download now"
  - [ ] Email shows product name and order ID
  - [ ] Download link present

- [ ] **Download with Token**
  - [ ] Click download link from email
  - [ ] Token verified successfully
  - [ ] Redirects to product download URL
  - [ ] File downloads

#### Security Verification

- [ ] **Invalid Download Token**
  - [ ] Try: http://localhost:3000/api/download/invalid-token
  - [ ] Returns 401 Unauthorized
  - [ ] Error message: "Invalid or expired download token"

- [ ] **SEO Verification**
  - [ ] Navigate to http://localhost:3000/sitemap.xml
  - [ ] Products section present
  - [ ] Product URLs listed

---

## Current Status

✅ **Completed**:
- Code implementation (all 324 tests passing)
- Security implementations verified
- Linting fixes applied
- Environment variables template created
- Download token secret generated

⚠️ **Pending** (requires your action):
- Add Stripe API keys to `.env.local`
- Configure Stripe webhook secret
- Verify Sanity connectivity
- Create test products in Sanity Studio
- Create Stripe Price objects for paid products
- Manual verification of feature functionality

---

## Files Modified

This fix session applied the following changes:

1. **`.env.local`**: Added Stripe and download token configuration (with TODOs)
2. **Linting fixes**:
   - `src/app/products/success/page.tsx`: Fixed TypeScript types, apostrophe encoding
   - `src/components/products/ProductDetail.tsx`: Fixed apostrophe encoding
   - `src/components/products/ProductGrid.tsx`: Fixed apostrophe encoding
   - `package.json`: Removed unused `@stripe/stripe-js` dependency

---

## Next Steps

1. **You**: Complete manual setup steps 1-7 above
2. **You**: Run through manual verification checklist
3. **You**: If any issues found, document them
4. **QA Agent**: Will re-run validation once manual verification is complete

---

## Questions or Issues?

**Sanity won't connect**:
- Check network/VPN
- Verify project ID is correct: `kswuh3pq`

**Stripe keys not working**:
- Ensure using TEST mode keys (not LIVE)
- Check keys start with `pk_test_` and `sk_test_`

**Webhook not receiving events**:
- Stripe CLI must be running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check console shows "Ready! Your webhook signing secret is..."

**Email not sending**:
- Check RESEND_API_KEY is configured
- Check Resend dashboard for errors

**Download link broken**:
- Verify DOWNLOAD_TOKEN_SECRET is set (it is: generated automatically)
- Check token not expired (24h limit)

---

**Generated**: 2026-10-01  
**QA Session**: 4  
**Fix Session**: 1

**Ready for**: Manual setup → Manual verification → QA re-validation
