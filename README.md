# FinGuard

An enterprise-grade banking interface built to facilitate secure, ACID-compliant financial transactions. FinGuard serves as the frontend client for a highly scalable Spring Boot monolith architecture, featuring stateless authentication, real-time ledger updates, and rigorous client-side validation.

## Tech Stack

**Frontend Architecture:**

- **Framework:** React 18 + Vite + TypeScript
- **State Management:** Zustand (Global Auth State)
- **Routing:** React Router v6 (Protected Routes)
- **Data Fetching:** Axios (with custom Request/Response Interceptors)
- **Form Handling:** React Hook Form + Zod (Strict Schema Validation)
- **UI/Styling:** Tailwind CSS + Shadcn UI + Lucide Icons

**Backend Integration:**

- Designed to interface with a **Spring Boot 3** / **Java 17+** REST API.
- Fully compatible with **PostgreSQL** deployed via **Docker**.

## Key Engineering Features

- **Stateless Security (JWT):** Implements `Bearer` token authentication. Global Axios interceptors automatically attach tokens to outbound requests and catch `401 Unauthorized` responses to securely terminate expired sessions.
- **Contract-First Typings:** 100% strict TypeScript interfaces mapped exactly to backend DTOs to ensure type safety across the network boundary.
- **Atomic Transaction UI:** Transfer forms include client-side validation to prevent malformed requests before they hit the ACID-compliant backend engine. Business logic exceptions (e.g., "Insufficient Funds") are elegantly intercepted and surfaced via UI toasts.
- **Auto-Provisioning Support:** Designed to handle seamless onboarding where backend triggers initialize checking/savings ledgers upon registration.
- **Paginated Audit Trail:** Transaction history leverages Spring Data Pagination, mapping a complex `Page` object into a highly readable, color-coded enterprise data table.

## Local Setup & Execution

### Prerequisites

- Node.js (v18+)
- The FinGuard Spring Boot Backend running on `localhost:8080` via Docker.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/finguard-ui.git](https://github.com/yourusername/finguard-ui.git)
   cd finguard-ui
   ```
