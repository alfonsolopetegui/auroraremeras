# Copilot Instructions

This project is an **e-commerce website for selling printed t-shirts**, built with **Next.js (App Router)** and **TypeScript**.
The goal is to guide GitHub Copilot to generate code that is **simple, clear, maintainable**, and appropriate for a **real MVP e-commerce**, avoiding overengineering.

---

## 🎯 Project Goals

* Sell printed t-shirts online
* Provide a clear and simple shopping experience
* Allow users to browse products, select variants, and complete purchases
* Integrate payments using Mercado Pago (Checkout Pro)
* Provide a minimal admin panel to manage products and orders
* Keep the codebase easy to understand and easy to extend

---

## 🧱 Tech Stack

* **Framework**: Next.js (latest stable version)
* **Router**: App Router (`app/`)
* **Language**: TypeScript
* **Styling**: Plain CSS (no Tailwind, no CSS-in-JS, no UI libraries)
* **Database**: Vercel Postgres
* **ORM**: Prisma
* **Deployment**: Vercel

---

## 🧠 General Principles

Copilot should:

* Prioritize **simplicity over complexity**
* Avoid unnecessary abstractions
* Generate **explicit, readable code**
* Follow consistent and predictable patterns
* Think in terms of a **real MVP**, not a large-scale platform
* Avoid adding features that were not explicitly requested

---

## 🗂️ Application Structure

* Public routes for the store
* Protected routes for the admin panel
* Prefer **Server Actions** for data mutations
* Use **API Routes** only when required (e.g. Mercado Pago webhooks)

Conceptual routes:

* `/` – Product listing (home)
* `/product/[id]` – Product detail page
* `/cart` – Shopping cart
* `/checkout` – Checkout flow
* `/admin` – Admin dashboard (protected)
* `/admin/login` – Admin login

---

## 🗄️ Data Model (Conceptual)

### Product

* id
* name
* description
* price (single base price)
* imageUrl (one image per product)
* active (boolean)
* createdAt

### Variant

* id
* productId
* size (S, M, L, XL)
* color
* stock

### Order

* id
* items (product + selected variant + quantity)
* totalAmount
* status (pending, paid, cancelled)
* mercadoPagoPreferenceId
* createdAt

### Admin

* id
* email
* passwordHash
* createdAt

Copilot should model these entities using **Prisma**, without adding unnecessary fields.

---

## 👕 Products

* Each product has **one image only**
* Price is defined at the product level
* Variants only manage:

  * size
  * color
  * stock
* Do **not** implement:

  * discounts
  * promotions
  * variant-specific pricing

---

## 🛒 Cart

* The cart is handled on the client side
* State can be stored using:

  * React state
  * simple global state
  * localStorage

Each cart item must include:

* product
* selected variant
* quantity

Avoid complex state management solutions.

---

## 💳 Checkout & Payments

* Use **Mercado Pago – Checkout Pro**

* Redirect users to Mercado Pago to complete payment

* Send **one item** to Mercado Pago:

  * title: product name
  * unit price: product base price

* Selected variant details are stored **only in the database**, not in Mercado Pago

Implement:

* preference creation
* payment response handling
* order persistence

---

## 📦 Shipping

* Do **not** calculate shipping costs in this version
* Display a clear message such as:

  * "Shipping will be coordinated after purchase"
* Do not request shipping address data

---

## 🔐 Admin Panel

### Authentication

* Custom, simple authentication
* Email + password
* Passwords must be hashed
* Use a simple session or httpOnly cookie

Do **not** use OAuth or third-party auth providers.

### Admin Features

* Login / logout
* Create products
* Edit products
* Activate / deactivate products
* Manage variants and stock
* View orders list

Avoid dashboards, charts, or advanced analytics.

---

## 🔒 Security Guidelines

* Protect `/admin` routes using middleware
* Validate data on the server
* Never expose private keys
* Use environment variables for:

  * Mercado Pago credentials
  * Database connection

---

## 🎨 Styling Guidelines

* Use plain CSS
* Organize styles by page or component
* Use clear, semantic class names
* Keep the design clean and functional

Do not introduce Tailwind, shadcn, MUI, or other UI frameworks.

---

## 🚫 What Copilot Must Avoid

* Adding features that were not requested
* Introducing new libraries without justification
* Overcomplicating the data model
* Designing for hypothetical future requirements

---

## 🧩 Mindset

This project is:

* A small but real e-commerce
* A functional MVP
* Easy to maintain
* Built to be iterated on

Copilot should behave like a **pragmatic senior developer**, always favoring clarity, simplicity, and real-world usefulness.
