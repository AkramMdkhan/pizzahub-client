# PizzaHub — Pizza Ordering & Delivery Platform (Client)

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-ShadCN%20UI-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better%20Auth%20%2B%20JWT-orange)](https://www.better-auth.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe%20Checkout-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)

**PizzaHub** is a full-featured, role-based pizza ordering and delivery platform built with **Next.js (App Router)**, **ShadCN UI**, **Framer Motion**, and **Better Auth**. It connects **Customers** discovering local pizza shops and tracking orders, **Vendors (Restaurants)** managing menus, incoming orders, and Premium subscriptions, and **Admins** overseeing platform users, menu approvals, and transactions.

![PizzaHub Homepage Preview](./images/pizzabanner.JPG)

> **Note on Order Checkout:** As specified for PizzaHub, customers submit orders directly with delivery details without a Stripe checkout flow on food orders; **Stripe Checkout + Webhooks** is used exclusively for **Vendor Premium subscription upgrades**.

---

## Live Links & Repositories

- **Live Website:** `https://pizzahub-client-beige.vercel.app`
- **Client Repository:** `https://github.com/AkramMdLhan/pizzahub-client`
- **Server Repository:** `https://github.com/AkramMdkhan/pizzahub-server`

---

## Key Features

### Public & Authentication
- **Pizza-Themed Landing Page:** Hero banner, dynamic **Featured Menu Items** (approved & active items), **6 Pizza Categories** (*Classic Pizzas*, *Vegetarian Pizzas*, *Meat Lovers*, *Specialty / Gourmet Pizzas*, *Sides & Appetizers*, *Beverages & Desserts*), **Why Choose PizzaHub?**, and additional engaging sections with smooth **Framer Motion** transitions.
- **Browse Menu (`/menu`):** Public menu catalog with real-time search by item name, filtering by category and location/city, and **price sorting (ascending & descending)**, complete with loading skeletons and empty states.
- **Item Details (`/menu/[id]`):** Displays multi-image galleries, category, description, price, restaurant location, vendor details, and an **Order Now** modal/form for authenticated customers (blocking vendors from ordering their own items and admins from placing customer orders).
- **Authentication via Better Auth + JWT:** Email/password sign-up and sign-in with password strength validation (minimum 6 characters, at least one uppercase and one lowercase letter), **Google OAuth**, role selection (*Customer* or *Vendor* during registration; Admin accounts are provisioned securely), and instant navbar state updates.
- **Strict Role & Route Protection:** Dedicated dashboards and route guards ensuring users cannot access another role's dashboard via manual URL changes, and logged-in users remain authenticated across page reloads on private routes.

### Customer Dashboard
- **Overview:** Summary metrics for total, pending, accepted, and rejected orders alongside visual charts/statistics.
- **My Orders:** View item details, vendor info, delivery date & address, request date, and live order status (`pending`, `accepted`, `rejected`, `cancelled`), with the ability to **cancel pending orders** (preventing cancellation of already processed or other users' orders).
- **Profile Settings:** Update display name, optional profile image, and editable profile fields (with role and subscription fields locked from client tampering).

### Vendor (Restaurant) Dashboard
- **Overview:** Metrics for total menu items, active menu items, pending orders, accepted orders, active subscription tier (`free` or `premium`), and visual charts.
- **Add Menu Item:** Create items with **ImgBB** image upload, category, description, price, and location; saved with `pending` status until admin approval, enforcing the **Free plan limit of 3 active items** vs. **Premium unlimited active items**.
- **My Menu Items:** View owned menu items and approval statuses (`pending`, `approved`, `rejected`, `inactive`), edit details, toggle availability, and delete items (rejected items never appear to customers).
- **Customer Orders:** Inspect incoming orders (customer info, item, delivery date, address, special instructions, status) and **Accept** or **Reject** `pending` orders once.
- **Subscription & Stripe Checkout:** Compare **Free** vs. **Premium** (*Unlimited active items, Premium vendor badge, featured menu placement*) and initiate a **Stripe Checkout Session** leading to `/payment/success` or `/payment/cancel`, with Premium activation driven by verified Stripe webhooks on the backend.
- **Profile Settings:** Manage restaurant/business details, name, and profile image.

### Admin Dashboard
- **Overview:** Platform KPIs and charts for total users, vendors, customers, total menu items, pending menu items, and total transactions.
- **Manage Users:** Search by name or email, filter by role, and **Block / Unblock** users (immediately restricting blocked accounts from protected actions).
- **Manage Menu Items:** Search, filter, **Approve / Reject** pending items, update published item statuses, and remove inappropriate listings.
- **Transactions:** View subscription payment records (vendor info, plan, amount, currency, Stripe session/subscription IDs, status, date) in a read-only audit view (admins cannot manually alter payment statuses).

---

## Technology Stack & Packages

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framermotion.com/)
- **Authentication:** [Better Auth](https://www.better-auth.com/) + JWT session/token handling + Google OAuth
- **Notifications:** Toast notifications (e.g., `sonner` / ShadCN toast — no `alert()`)
- **Media Hosting:** [ImgBB API](https://api.imgbb.com/) for menu item image uploads

---

## Challenge Implementations

1. **Advanced Search & Price Sorting (`/menu`):**
   - The client synchronizes search queries (`search`), category (`category`), location (`location`), and price sort order (`sortBy=price&order=asc|desc`) via URL search parameters and sends them as query parameters to the Express API (`GET /api/menu-items?search=...&category=...&location=...&sort=price_asc|price_desc`).
   - Debounced search input and explicit sort/filter controls update results smoothly while handling loading and empty states.

2. **JWT / Token Verification & Protected Route Handling:**
   - Authenticated requests to protected Express endpoints include the user's JWT/auth token, verified server-side via authentication and role-guard middleware (`requireAuth`, `requireRole('customer' | 'vendor' | 'admin')`, and ownership checks).
   - Invalid or expired tokens return `401` (or `403` for insufficient role/ownership), prompting clean re-authentication or access-denied feedback on the client.

3. **Polished UI/UX & Theme Consistency:**
   - Designed around a warm pizza palette (reds, oranges, and cream surfaces) with consistent typography, uniform card dimensions and aspect ratios, responsive mobile/tablet/desktop layouts, custom `404` and error boundaries, and dashboard statistics with charts.

---

## Environment Variables

Create a `.env.local` file in the root of the client project. **Never commit `.env.local` or secret keys to GitHub.**

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# MongoDB Connection (if Better Auth adapter runs in Next.js)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Stripe (Publishable Key Only on Client; Secret & Webhook Secret Stay on Server)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# ImgBB Image Upload API
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
