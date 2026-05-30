# Reckron SP Portal

A modern, premium, production-ready pharmaceutical company portal built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **MongoDB + Mongoose**, and **JWT-based session authentication**.

---

## 🌟 Key Features

### 1. Client Website (Public)
*   **Homepage (`/`)**: Features a responsive hero banner, dynamic company about cards, product showcases, certified counters, customer testimonials, and an enquiry CTA.
*   **Pharmaceutical Catalog (`/products`)**: Dynamic product lists populated straight from MongoDB with search querying and therapy category filters.
*   **Product Details (`/products/[slug]`)**: Specification sheets containing chemical compositions, dosage administrations, packaging details, related Products suggestions, and a downloadable specifications sheet.
*   **Corporate Story (`/about`)**: Lists company history, dynamic milestones timeline, and leadership profiles.
*   **Enquiry Portal (`/contact`)**: Capture customer requests with Google Maps coordinates and dynamic product selection.

### 2. Admin Dashboard Console (`/admin`)
*   **Overview Analytics (`/admin/dashboard`)**: Visual card metrics showing total Products size, therapy categories, pending reviews, and recent enquiry list logs.
*   **Specification Catalog (`/admin/dashboard/products`)**: CRUD panel allowing administrators to add, edit, and delete products, toggle featured status, write dosage specs, and configure custom SEO keywords.
*   **Therapy Manager (`/admin/dashboard/categories`)**: Group Products into distinct therapeutic segments (e.g. Cardiology, Oncology).
*   **Enquiry Inbox (`/admin/dashboard/enquiries`)**: Review customer stock queries and toggle status between `pending`, `reviewed`, and `resolved`.
*   **Headless CMS (`/admin/dashboard/content`)**: Dynamically edit home hero slogans, mission/vision declarations, and statistics numbers.
*   **Office Coordinates (`/admin/dashboard/contact`)**: Edit telephone lines, support mail, social media handles, and maps embeds.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16 (App Router)
*   **Styles**: Tailwind CSS v4 + Framer Motion
*   **Database**: MongoDB & Mongoose ORM
*   **Validation**: React Hook Form + Zod
*   **Email Transmissions**: Nodemailer SMTP
*   **Uploads**: Cloudinary (with local public folder uploads fallback)
*   **Authentication**: Secure Cookie-based JWT Session

---

## 🚀 Setup & Execution

### 1. Configure Mappings
Create a `.env.local` file in the root directory (defaults are set up already):
```env
MONGODB_URI=mongodb://localhost:27017/reckron_sp
JWT_SECRET=super-secret-reckron-sp-jwt-token-2026-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional SMTP Mail
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@reckronsp.com

# Optional Cloudinary Uploads (Fallback: public/uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 2. Database Seeding
Ensure you have a MongoDB instance running. Once active, run the automatic database seeding script:
```bash
npx tsx src/scripts/seed.ts
```
This cleans database collections and injects:
1.  **Default Admin User**:
    *   **Username**: `admin`
    *   **Password**: `password123`
2.  Initial therapy categories, featured products, CMS defaults, and contact details.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.
To access the admin dashboard, visit `/admin` and log in using the seed credentials.

---

## 📦 Production Builds
To test the production compilation:
```bash
npm run build
npm run start
```
The application dynamically handles all database content requests via Server-Side Rendering (SSR) to ensure instant reflections of admin edits.
