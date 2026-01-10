# 🧊 Ice Client - Project Identity

## 📌 Overview

**Ice Client** is a modern, high-performance Point of Sale (POS) system designed specifically for restaurants and cafes. It provides a robust interface for managing orders, tables, payments, and cash registers in real-time.

---

## 🚀 Technical Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) (shadcn/ui style components)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)

---

## 🛠️ Core Features

- **Auth System:** Secure login and session management.
- **Order Management:** Create and track orders, manage order items.
- **Table Management:** Visual representation of restaurant floors and table statuses.
- **Payment Processing:** Support for multiple payment methods and invoice generation.
- **Cash Registers:** Opening, closing, and tracking sessions for cashier control.
- **Product & Category Management:** Organized catalog with categories and real-time updates.

---

## 📂 Project Structure

```text
src/
├── api/            # API endpoints definition and Axios configuration
├── components/     # Reusable UI components (shadcn/ui basis)
├── features/       # Business logic organized by domain (auth, orders, etc.)
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts (Main, Auth, etc.)
├── routes/         # Application routing configuration
├── stores/         # Zustand global state management
├── types/          # TypeScript interfaces and types
└── utils/          # Helper functions and formatting utilities
```

---

## ⚙️ Workflows

1. **Cashier Login:** Authentication via the `auth` feature.
2. **Opening Register:** Requires a cash register session to be active.
3. **Taking Orders:** Selection of tables, items, and real-time synchronization.
4. **Checkout:** Payment processing and order completion.
5. **Session Closing:** Reconciling cash at the end of a shift.
