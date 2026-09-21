# 🐘 Ganpati Festival & Social Trust Donation Management Application

A **simple, modern, attractive single-page donation management application** tailored for Ganpati festival trusts and social welfare organizations.

Built with **Laravel 11**, **React 18 (Inertia.js)**, **MongoDB**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Features

- **Multi-Tenant Trust Isolation**: Signup creates a Trust & User account; all financial queries are strictly scoped by `trust_id`.
- **Smart Donation Form**:
  - Auto-converts numbers to English words (e.g. `5000` ➔ `"Five Thousand Rupees Only"`).
  - Payment methods: Cash, Online / UPI, QR Code, Cheque.
  - Status: Paid or Pending.
  - Follow-up selector (`1 Day`, `2 Days`, `3 Days`) for pending pledges.
- **Digital Receipt Modal**:
  - Auto-generated receipt number (e.g., `GNP-2026-000001`).
  - Print / Save PDF.
  - Multi-channel delivery: Email, WhatsApp, SMS.
- **Pending Follow-ups Section**:
  - Follow-up timers and 1-click **"Mark Received / Paid"** workflow.
- **Reports & Expense Management**:
  - Income vs Expense chart (Recharts).
  - Financial widgets (Total Income, Total Expense, Pending, Net Balance).
  - Category expense logging (`Decoration`, `Sound System`, `Food`, `Prasad`, `Electricity`, etc.).

---

## 🔑 Demo Credentials

- **URL**: `http://localhost:8000`
- **Email**: `admin@ganpatitrust.org`
- **Password**: `password123`

---

## 🛠️ Quick Local Setup

1. **Clone repository**:
   ```bash
   git clone <your-github-repo-url>
   cd ganpati-donation-app
   ```

2. **Install PHP & Node Dependencies**:
   ```bash
   composer install --ignore-platform-req=ext-mongodb
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run Database Seed**:
   ```bash
   php artisan db:seed
   ```

5. **Build Frontend & Start Server**:
   ```bash
   npm run build
   php artisan serve --port=8000
   ```

---

## 📜 License
Open-source under the MIT License.
