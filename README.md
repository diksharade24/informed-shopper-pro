# Informed Shopper Pro

## 1. YOUR ROLE

Act as a senior frontend engineer, full-stack architect, UI/UX designer, and e-commerce product developer.

Build **ShopSmart AI**, a complete, modern, responsive e-commerce platform inspired by the shopping capabilities of Amazon, Flipkart, and Blinkit, with an original brand identity and AI-powered shopping experiences.

This is intended to become a genuinely deployable application, not a static website, basic college project, or visual prototype.

The frontend must be designed for integration with a real FastAPI backend, PostgreSQL database, authentication system, inventory management, payment gateway, order processing system, and AI/ML recommendation services.

The application must prioritize:

* Complete shopping functionality.
* Unique visual design.
* Maintainable architecture.
* Responsive layouts.
* Performance and accessibility.
* Type safety.
* Reliable API integration.
* Production readiness.

Do not sacrifice functionality for visual appearance.

---

## 2. PROJECT IDENTITY

**Brand:** ShopSmart AI

**Tagline:** Find your vibe. Love your buy.

**Product vision:** An intelligent shopping platform where customers discover products, compare options, make informed purchases, and receive personalized recommendations, while sellers manage inventory, orders, and business performance.

The design must be original. Do not copy the logos, exact layouts, or proprietary branding of Amazon, Flipkart, or Blinkit.

---

## 3. DESIGN SYSTEM: COLORFUL, LIGHT, GEN-Z

Create a distinctive, light-themed shopping experience that feels joyful, modern, youthful, polished, and premium.

### Color palette

* Warm cream: `#FFF9F0`
* White: `#FFFFFF`
* Soft lavender: `#E9DFFF`
* Peach: `#FFD9C7`
* Butter yellow: `#FFE99A`
* Mint green: `#CFF5DF`
* Coral: `#FF7568`
* Deep plum: `#342344`

Use cream and white as the primary surfaces. Use pastel colors for promotional sections, category cards, and product highlights. Use coral for primary actions and deep plum for readable text.

Maintain adequate contrast. Do not use every color in every component.

### Typography

Use Plus Jakarta Sans for headings and Inter for body text, or equivalent modern fonts.

### Visual style

Implement:

* Rounded cards and buttons.
* Editorial-style hero sections.
* Attractive product photography.
* Colorful category tiles.
* Spacious layouts.
* Subtle borders and restrained shadows.
* Consistent spacing and typography.
* Smooth, subtle transitions.
* Friendly microcopy.
* Polished loading skeletons.
* Thoughtful empty and error states.
* Professional icons using Lucide React.

Avoid excessive gradients, neon colors, glassmorphism, unnecessary animation, and generic dashboard aesthetics.

The interface should appeal to Gen-Z customers without appearing childish.

---

## 4. REQUIRED TECHNOLOGY STACK

Use:

* React.
* TypeScript with strict settings.
* Vite.
* Tailwind CSS.
* React Router.
* TanStack Query for server-state management.
* Zustand for appropriate client-side state.
* React Hook Form.
* Zod for validation.
* Lucide React for icons.
* Vitest and React Testing Library for frontend tests.

Use compatible, stable package versions.

Do not introduce unnecessary dependencies.

Do not use `any` as a shortcut.

Do not use Next.js unless the existing repository explicitly requires it.

Inspect the existing repository before changing files or dependencies. Preserve existing working code and avoid unnecessary rewrites.

---

## 5. APPLICATION ARCHITECTURE

Use a feature-based, modular architecture.

Suggested structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── products/
│   ├── cart/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── catalog/
│   ├── search/
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── orders/
│   ├── reviews/
│   ├── recommendations/
│   ├── comparison/
│   ├── account/
│   ├── seller/
│   └── admin/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── config/
├── styles/
├── mocks/
└── main.tsx
```

Adapt this structure when necessary, but preserve separation of concerns.

Create reusable components for buttons, inputs, dialogs, drawers, forms, product cards, price displays, rating displays, pagination, loading skeletons, notifications, and empty states.

Use centralized route definitions and typed API services.

Do not put the entire application into one component.

---

## 6. GLOBAL LAYOUT

### Announcement bar

Create a compact promotional announcement bar with configurable messages, an optional dismiss button, and accessible behavior.

### Main navigation

Include:

* Brand logo.
* Category navigation.
* Search input.
* Delivery-address selector.
* Account menu.
* Wishlist shortcut.
* Cart shortcut with a live item count.

Desktop layouts should use a spacious horizontal header.

Mobile layouts should use a compact header, accessible navigation drawer, and convenient search interface.

All important navigation elements must work.

### Footer

Include:

* About.
* Customer support.
* Orders and returns.
* Shipping information.
* Privacy policy.
* Terms.
* Contact information.
* Social links.
* Newsletter form.

Do not invent business claims or policies.

---

## 7. HOMEPAGE

Create a complete, visually distinctive shopping homepage.

### Hero section

Headline:

**Your next favorite thing is here.**

Supporting text:

Good finds, happy prices, and little discoveries worth sharing.

Include:

* Primary CTA: Explore products.
* Secondary CTA: Discover your picks.
* Product collage or editorial product imagery.
* Soft pastel surfaces.
* Organic decorative shapes.
* Responsive composition.

The primary CTA must open the product catalog.

### Category explorer

Include configurable categories:

* Electronics.
* Fashion.
* Beauty.
* Home and Living.
* Grocery.
* Sports and Fitness.
* Books and Stationery.
* Accessories.

Category cards must navigate to filtered catalog pages.

### Trending products

Display reusable product cards containing:

* Product image.
* Product name.
* Brand.
* Current price.
* Original price when valid.
* Discount when valid.
* Rating and review count.
* Availability.
* Wishlist action.
* Quick-view action.
* Add-to-cart action.

### Personalized recommendations

Create a section titled **Picked for your vibe**.

Support personalized recommendations when available and popularity-based fallback recommendations for new users.

Never fabricate personalization.

### Promotional campaigns

Display configurable campaigns, eligible products, applicable terms, and real expiry information when available.

Do not create fake countdown timers or discounts.

### New arrivals

Display products ordered by publication or creation date.

### Popular brands

Show brands that actually exist in the catalog.

### AI shopping discovery

Include an input where customers can express their requirements in natural language.

Example:

"I need comfortable headphones under ₹2,000 for online classes."

Display loading feedback, interpreted requirements when available, and relevant product results.

Connect this feature to a typed service interface for future backend integration. Do not claim AI inference is working until it is connected to a real service.

### Additional sections

Include recently viewed products, a newsletter section, and the complete footer.

---

## 8. PRODUCT CATALOG AND SEARCH

Build a fully functional catalog page.

Include:

* Breadcrumbs.
* Category title.
* Product count.
* Search summary.
* Sorting selector.
* Desktop filter sidebar.
* Mobile filter drawer.
* Product grid.
* Pagination or properly implemented incremental loading.
* Loading, empty, and error states.
* Clear-all-filters action.

Filters:

* Category.
* Price range.
* Brand.
* Rating.
* Availability.
* Relevant product attributes.

Sorting:

* Relevance.
* Price low to high.
* Price high to low.
* Rating.
* Newest.

Support:

* Search submission.
* Search suggestions.
* Recent searches.
* Keyboard navigation.
* Clear search.
* Debounced suggestions.
* Request cancellation for obsolete searches.
* URL-based query and filter persistence where practical.
* Browser back and forward navigation.

Use server-side filtering and pagination when the backend is available. Do not download an entire large catalog to the browser merely to filter it locally.

---

## 9. PRODUCT DETAILS

Build a detailed product page containing:

* Breadcrumbs.
* Image gallery and thumbnails.
* Product name and brand.
* Current and original prices.
* Valid discount information.
* Rating and review count.
* Variant selector.
* Quantity selector.
* Availability.
* Delivery information.
* Product description.
* Specifications.
* Product highlights.
* Return policy when provided.
* Add-to-cart and Buy Now buttons.
* Wishlist action.
* Customer reviews.
* Related products.
* Similar products.
* Recently viewed products.

Variant selection must update the relevant product information.

Cart actions must respect the selected variant.

Unavailable products must not be purchasable.

Use backend-provided prices and availability whenever connected.

Do not invent warranty, return, or delivery guarantees.

---

## 10. CART AND WISHLIST

### Shopping cart

Implement:

* Add item.
* Remove item.
* Update quantity.
* Update variant when supported.
* Persistent cart.
* Guest cart where supported.
* Guest-cart merge after login.
* Line-item totals.
* Subtotal.
* Shipping and taxes when provided.
* Validated discounts.
* Estimated total.
* Price-change handling.
* Stock-change handling.
* Empty cart.
* Error and recovery states.
* Continue shopping.
* Checkout navigation.

The backend must remain authoritative for prices, discounts, stock, and final totals.

For authenticated users, cart data should persist across sessions and devices.

### Wishlist

Implement:

* Add and remove products.
* Wishlist page.
* Duplicate prevention.
* Availability indicators.
* Add-to-cart actions.
* Empty state.
* Login-aware persistence.
* Guest behavior where supported.

Keep wishlist state synchronized across product cards and product detail pages.

---

## 11. AUTHENTICATION AND ACCOUNT MANAGEMENT

Create:

* Registration.
* Login.
* Forgot password.
* Reset password.
* Account overview.
* Edit profile.
* Manage addresses.
* Change password.
* Logout.

Include appropriate validation, accessible labels, field-level error messages, password visibility controls, loading states, and server-error handling.

Do not implement a fake login that always succeeds.

Use the actual backend authentication design when available.

Do not expose access tokens in URLs or unnecessarily store sensitive credentials in browser storage.

Protected frontend routes improve navigation, but the backend must independently enforce authorization.

---

## 12. CHECKOUT AND PAYMENTS

Create a responsive, multi-step checkout:

1. Delivery address.
2. Delivery option.
3. Order review.
4. Payment.
5. Confirmation.

Include:

* Saved addresses.
* Add-address form.
* Address validation.
* Delivery availability.
* Order summary.
* Shipping fees and taxes when applicable.
* Validated discounts.
* Final payable amount.
* Payment-provider handoff.
* Payment pending state.
* Payment failure state.
* Retry where supported.
* Order confirmation.

Critical requirements:

* The backend calculates the final amount.
* The backend validates inventory.
* The backend creates and tracks orders.
* Payment success is verified through trusted backend responses and provider verification.
* Failed and abandoned checkouts have recoverable states.
* Never store card numbers or CVVs.
* Never fabricate a successful payment or order.

Payment-provider test mode may be used during development.

---

## 13. ORDERS AND REVIEWS

### Orders

Create:

* Order history.
* Order details.
* Purchased-item snapshots.
* Payment status.
* Shipment information.
* Order timeline.
* Cancellation requests where permitted.
* Return requests where permitted.
* Refund status where available.
* Reorder action where supported.

Represent states clearly, including pending payment, confirmed, processing, shipped, out for delivery, delivered, cancelled, and refunded.

Only show valid status transitions supplied by the backend.

### Reviews

Implement:

* Rating and written review.
* Rating breakdown.
* Sorting and pagination.
* Helpful-review interaction where supported.
* Verified-purchase indicator supplied by the backend.
* Review validation.
* Empty and error states.
* AI review insights when available.

Do not fabricate reviews or claim a purchase is verified without backend confirmation.

---

## 14. PRODUCT COMPARISON

Allow customers to compare products by:

* Price.
* Brand.
* Specifications.
* Rating.
* Availability.
* Relevant product attributes.

Support adding and removing products.

Use category-specific comparison attributes.

Provide an accessible, horizontally scrollable comparison layout on mobile.

Do not compare incompatible specifications as if they were equivalent.

---

## 15. AI SHOPPING ASSISTANT

Create a dedicated shopping assistant interface.

It should eventually support:

* Natural-language queries.
* Budget constraints.
* Product feature preferences.
* Product recommendations.
* Product comparisons.
* Similar-product discovery.
* Explanations of recommendation relevance.

Example:

"I need a backpack under ₹1,500 for college that fits a 15-inch laptop."

Show interpreted requirements, matching products, reasons for recommendations, and alternatives when provided by the backend.

Keep the UI separate from the underlying AI service.

Until a real ML service is available, use clearly identified sample data. Do not present mock responses as actual AI predictions.

---

## 16. SELLER AND ADMIN DASHBOARDS

### Seller interface

Include:

* Sales overview.
* Product listings.
* Add and edit products.
* Product image management.
* Inventory management.
* Low-stock indicators.
* Order list.
* Order details.
* Authorized fulfilment actions.
* Product performance metrics.

### Administrator interface

Include:

* Platform overview.
* Product moderation.
* Category management.
* User management.
* Seller management.
* Order oversight.
* Promotion management.
* Sales analytics.

Use separate, protected routes and layouts.

The backend must enforce all permissions.

Do not treat hiding an admin link as security.

---

## 17. API INTEGRATION

Prepare for a real FastAPI backend.

Create typed service modules for:

* Authentication.
* Products.
* Categories.
* Search.
* Cart.
* Wishlist.
* Checkout.
* Orders.
* Reviews.
* Recommendations.
* Addresses.
* Seller operations.
* Admin operations.

Use:

* Centralized API client.
* Configurable API base URL.
* Typed request and response models.
* Centralized error handling.
* Request cancellation.
* Loading states.
* Authentication-aware requests.
* Query caching and invalidation.
* Appropriate timeout handling.

Read the API URL from:

`VITE_API_BASE_URL`

Do not expose secrets in frontend environment variables.

Use TanStack Query for server state and Zustand for appropriate client state.

Do not duplicate server state unnecessarily.

Create mock services behind the same interfaces as real services so the frontend can be developed before the backend is ready.

Mock mode must be explicit and configurable.

Never mix mock data and production data silently.

---

## 18. DATA AND MOCKING POLICY

Use deterministic sample data during initial UI development.

Include realistic examples across multiple product categories, with:

* Product names.
* Descriptions.
* Brands.
* Prices.
* Valid original prices where applicable.
* Images.
* Variants.
* Ratings.
* Stock states.

Keep fixtures separate from production service code.

Clearly identify simulated payment and order flows.

Do not display fabricated transactions as real purchases.

Switching from mock services to backend APIs must not require rewriting product components.

Use real, relevant product imagery from permitted sources when available. Provide robust image fallbacks.

---

## 19. RESPONSIVE DESIGN AND ACCESSIBILITY

Support:

* 320px mobile screens.
* 375px mobile screens.
* 768px tablets.
* 1024px laptops.
* 1440px desktop screens.

Ensure:

* No horizontal overflow on narrow screens.
* Touch-friendly controls.
* Responsive product grids.
* Accessible mobile navigation.
* Mobile filter drawers.
* Usable forms and checkout.
* Proper image sizing.
* Visible focus indicators.
* Semantic HTML.
* Keyboard navigation.
* Screen-reader-friendly feedback.
* Accessible dialogs.
* Appropriate contrast.
* Reduced-motion support.
* No functionality available only through hover.

Follow practical WCAG 2.2 AA accessibility principles.

---

## 20. PERFORMANCE

Implement:

* Route-level code splitting.
* Lazy loading of substantial route components.
* Optimized images.
* Responsive image sizing.
* Image dimensions to reduce layout shifts.
* Debounced search suggestions.
* Request cancellation.
* Pagination.
* Appropriate query caching.
* Efficient rendering.
* Sensible cache invalidation.
* Lightweight dependencies.

Do not introduce unnecessary memoization.

Measure performance and optimize demonstrated bottlenecks.

Report actual performance results rather than claiming unmeasured Lighthouse scores.

---

## 21. ERROR HANDLING

Every major workflow must include loading, success, validation, empty, network-error, and recoverable-failure states where applicable.

Handle:

* Product unavailable.
* Cart update failure.
* Expired session.
* Empty search results.
* Price changes.
* Stock changes.
* Payment pending.
* Payment failure.
* Order-loading failure.
* Invalid form input.

Provide consistent toast notifications and inline errors.

Do not expose technical stack traces to customers.

Preserve form data during recoverable errors where practical.

Never show success before the operation succeeds.

---

## 22. TESTING AND ACCEPTANCE CRITERIA

The frontend is complete only when the implemented functionality has been verified.

Test that:

1. Navigation links work.
2. Product cards display correct data.
3. Product details open for the selected product.
4. Search submits the correct query.
5. Filters and sorting work.
6. Pagination works.
7. Wishlist state updates correctly.
8. Cart quantities and item counts remain consistent.
9. Forms validate correctly.
10. Protected routes handle unauthenticated users.
11. Checkout follows valid states.
12. Payment status comes from trusted backend responses.
13. Order history uses real API data when connected.
14. Seller and admin interfaces respect permissions.
15. Loading and error states work.
16. Browser refresh does not break application routes.
17. Browser back and forward navigation work.
18. Mobile interactions are usable.
19. Images have appropriate fallbacks.
20. No primary button is decorative or silently nonfunctional.

Add automated tests for important user interactions.

Run TypeScript checks, tests, and production builds.

Fix errors before declaring a stage complete.

---

## 23. IMPLEMENTATION PLAN

Implement the project incrementally.

### Phase 1: Foundation

* Inspect the repository.
* Configure React, TypeScript, Vite, and Tailwind.
* Establish design tokens.
* Configure routing.
* Create reusable UI primitives.
* Build the global layout.

### Phase 2: Storefront

* Homepage.
* Navigation.
* Category pages.
* Product catalog.
* Search and filtering.
* Product details.

### Phase 3: Shopping

* Cart.
* Wishlist.
* Registration and login interfaces.
* Account pages.
* Address management.

### Phase 4: Commerce workflows

* Checkout.
* Payment handoff.
* Orders.
* Order tracking.
* Reviews.

### Phase 5: Advanced features

* Product comparison.
* Recently viewed products.
* Recommendation interface.
* AI shopping assistant.

### Phase 6: Seller and administration

* Seller dashboard.
* Product management.
* Inventory management.
* Order management.
* Administrative interfaces.

### Phase 7: Verification

* Automated testing.
* Responsive testing.
* Accessibility checks.
* Error-state testing.
* Performance checks.
* API integration verification.

After each phase:

1. Run the application.
2. Check TypeScript errors.
3. Run tests.
4. Run the production build.
5. Test implemented workflows.
6. Fix regressions.
7. Summarize completed features and outstanding work.

Do not generate the entire application as one enormous component or one unverified code dump.

---

## 24. FINAL EXECUTION INSTRUCTIONS

Begin by inspecting the existing repository and its package configuration.

Do not delete existing working files without a clear reason.

If the repository is empty, initialize a React + TypeScript + Vite application with a compatible Tailwind CSS setup.

Then implement the first milestone:

* Design system.
* Responsive navigation.
* Homepage.
* Product cards.
* Product catalog.
* Product details.
* Search and filtering.
* Basic cart interactions using explicitly identified mock data.
* Loading, empty, and error states.
* Reusable components.
* Typed service layer for future backend integration.

Run the application and verify that it builds successfully.

If a required feature cannot be completed in the current stage, document it clearly rather than pretending it works.

Do not stop after producing a design description. Create and modify the actual project files when repository tools are available.

Do not replace functional behavior with decorative buttons.

Do not claim authentication, payments, inventory, orders, or AI are production-ready until their real backend integrations exist and have been tested.

## FINAL GOAL

Deliver a distinctive, light-themed, colorful, joyful Gen-Z shopping experience with the complete frontend structure required for a real e-commerce application.

The result must combine:

* Original visual identity.
* Functional shopping interactions.
* Responsive layouts.
* Maintainable React and TypeScript architecture.
* Backend integration readiness.
* Accessibility.
* Performance.
* Automated testing.
* Production-oriented engineering practices.

**Build a real application, not merely a visual mockup.**

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fd5ff141-bb01-4d34-ac3e-80e6ef3a0407).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
