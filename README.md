# Bella Smile — Frontend

React SPA for the Bella Smile dental clinic management system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| Server State | TanStack React Query v5 |
| Client State | Zustand |
| Forms | Formik + Joi |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Animations | Framer Motion |
| Payments | Stripe (redirect to hosted page) |
| Phone Input | react-phone-input-2 |
| Notifications | react-hot-toast |

---

## Project Structure

```
src/
├── api/
│   ├── client.js              # Axios instance + interceptors
│   ├── auth.api.js
│   ├── patient.api.js
│   ├── doctor.api.js
│   ├── areaManager.api.js
│   ├── distributor.api.js
│   ├── dashboard.api.js
│   ├── payment.api.js
│   ├── pricing.api.js
│   └── stl.api.js
├── assets/
│   └── logo/
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx     # responsive layout with mobile sidebar
│   │   ├── Sidebar.jsx        # collapsible on mobile
│   │   └── Header.jsx         # hamburger menu on mobile
│   ├── patients/
│   │   ├── PatientRow.jsx
│   │   ├── WorkflowModal.jsx
│   │   ├── EditPatientModal.jsx
│   │   ├── ChangePhaseModal.jsx
│   │   ├── PhaseHistory.jsx
│   │   └── tabs/
│   │       ├── ProfileTab.jsx
│   │       ├── DocumentsTab.jsx   # optimistic upload/delete
│   │       ├── ManagementTab.jsx
│   │       ├── ProcessingTab.jsx  # Admin only
│   │       ├── CarePlanTab.jsx    # Admin only
│   │       └── HistoryTab.jsx
│   ├── payments/
│   │   ├── PaymentModal.jsx
│   │   └── PaymentExemptToggle.jsx
│   ├── stl/
│   │   └── StlSendModal.jsx
│   ├── users/
│   │   └── ChangeRoleButton.jsx
│   ├── ui/                    # shared UI components
│   │   ├── Modal.jsx
│   │   ├── FormField.jsx
│   │   ├── Input.jsx
│   │   ├── SubmitButton.jsx
│   │   ├── Spinner.jsx
│   │   └── EmptyState.jsx
│   ├── dashboard/
│   └── shared/
│       └── ScrollToTopButton/
├── constants/
│   ├── queryKeys.js
│   ├── phases.js
│   ├── workflow.js            # WORKFLOW_CONFIG with requiresPayment flag
│   ├── treatment.js
│   └── patientConstants.js
├── hooks/
│   ├── auth/
│   │   ├── useLogin.js
│   │   └── useLogout.js
│   ├── patients/
│   │   ├── usePatients.js
│   │   ├── usePatient.js
│   │   ├── usePatientWorkflow.js
│   │   └── useSetAcceptanceDecision.js
│   ├── doctors/
│   ├── area-managers/
│   ├── distributors/
│   ├── dashboard/
│   ├── payments/
│   │   ├── useCreateSession.js
│   │   ├── useSessionStatus.js
│   │   ├── useMyPayments.js
│   │   └── useToggleExempt.js
│   ├── pricing/
│   │   ├── usePricing.js
│   │   └── useUpdatePricing.js
│   └── stl/
│       └── useSendStl.js
├── pages/
│   ├── HomePage/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── dashboard/
│   │   └── DashboardPage.jsx
│   ├── patients/
│   │   ├── PatientsPage.jsx
│   │   └── PatientDetailPage.jsx
│   ├── doctors/
│   ├── area-managers/
│   ├── distributors/
│   ├── payments/
│   │   ├── PaymentSuccessPage.jsx
│   │   ├── PaymentCancelPage.jsx
│   │   └── MyPaymentsPage.jsx
│   └── pricing/
│       └── PricingPage.jsx
├── routes/
│   ├── index.jsx
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
├── store/
│   └── auth.store.js          # Zustand
└── utils/
    ├── token.js
    └── gmail.utils.js
```

---

## Environment Variables

```env
VITE_API_URL=https://your-api.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## Routing Structure

```
/                          Public — HomePage
/login                     Public
/forgot-password           Public
/reset-password/:token     Public
/payment/success           Public (Stripe redirect)
/payment/cancel            Public (Stripe redirect)

/dashboard                 Protected (admin + doctor)
/patients                  Protected (admin + doctor)
/patients/:id              Protected (admin + doctor)
/my-payments               Protected (doctor only)

/area-managers             Admin only
/distributors              Admin only
/doctors                   Admin only
/pricing                   Admin only
```

---

## Key Components

### MainLayout
Responsive layout with:
- Fixed sidebar on desktop (lg+)
- Slide-in sidebar with overlay on mobile
- Hamburger button in header on mobile
- Sidebar closes on NavLink click or overlay click

### WorkflowModal
Handles all patient phase transitions. Uses `WORKFLOW_CONFIG` to determine:
- Which fields to show per phase
- Whether payment is required (`requiresPayment: true`)
- For Doctor with `paymentExempt=true` → shows normal form (no payment)
- For Doctor without exemption in Pick Up → shows Payment Required block

```javascript
// WORKFLOW_CONFIG structure
{
  "Pick Up": {
    action:          "Preparation",
    label:           "Preparation",
    requiresPayment: true,    // triggers payment UI for doctors
    fields:          [],
  }
}
```

### DocumentsTab
Optimistic UI for photo uploads and deletions:
- Upload: shows temp preview immediately with spinner, replaces with real URL on success
- Delete: removes from UI immediately, restores on failure
- Drag & drop support
- Preview modal on click

### PatientDetailPage — Tabs

| Tab | Access | Description |
|---|---|---|
| Profile | Admin + Doctor | Patient info, flags, dates, phase history, action buttons |
| Documents | Admin + Doctor | Photo upload/delete with optimistic UI |
| Management | Admin + Doctor | Treatment data, arches, checkboxes, notes |
| Processing | Admin only | Lavorazioni table (upper/lower) |
| Care Plan | Admin only | Arches, tooth diagram, radio groups — defaults from Management |
| History | Admin + Doctor | Activity log with pagination |

### CarePlanTab — Management Inheritance
```
Management Tab (source of truth):
  arcataSuperiore, arcataInferiore, treatment, months, attachment...

Care Plan Tab:
  - Shows "from management" badge on fields with no custom value
  - Allows independent override
  - "↺ Reset from Management" button to restore defaults
  - Saves both carePlan and updates numAligners (sup + inf)
```

---

## numAligners — Single Source of Truth

```
Set at:
  1. Patient creation (optional)
  2. suitability-pickup workflow step (optional)
  3. Management save → arcataSuperiore + arcataInferiore
  4. Care Plan save → arcataSuperiore + arcataInferiore

Displayed:
  - Patient list table
  - Profile tab
  - Management tab (live calculated, not stored separately)
  - Care Plan tab (live calculated)
  - Payment modal (used for payment amount calculation)
```

---

## Payment Flow (Frontend)

```
Patient in Pick Up:

Doctor WITHOUT exemption:
  PatientRow → shows CreditCard "Pay" button
  Click → PaymentModal opens
  Click "Pay with Stripe" → POST /payments/create-session
  Response → window.location.href = sessionUrl (Stripe hosted page)
  After payment → Stripe redirects to /payment/success?session_id=...
  PaymentSuccessPage polls /session-status every 2s (max 10 attempts)
  On paid → invalidates patients + dashboard cache → shows success

Doctor WITH paymentExempt=true:
  PatientRow → shows CircleArrowRight (normal workflow button)
  Click → WorkflowModal opens (needsPayment=false)
  Shows normal confirm form (no payment block)
  Click Confirm → POST /patients/:id/Preparation
  Backend detects paymentExempt → moves to Preparation directly

Admin:
  WorkflowModal → needsPayment=false (admin bypass)
  Direct transition without payment
```

---

## Role-Based UI

```
Admin sees:
  All patients (all doctors)
  All workflow buttons
  Change Phase (manual override)
  Processing tab
  Care Plan tab
  Doctors / Area Managers / Distributors pages
  Pricing page
  PaymentExemptToggle on each doctor
  ChangeRoleButton on each doctor
  STL Send button (Waiting for Acceptance + decision=stl)
  Mail button for STL

Doctor sees:
  Own patients only
  Workflow buttons (with payment gate at Pick Up)
  Pay button (Pick Up phase, not exempt)
  STL / Manufacturing buttons (Waiting for Acceptance)
  My Payments page
  Profile + Documents + Management + History tabs only
```

---

## React Query Setup

```javascript
// QueryClient defaults
{
  queries: {
    retry:               1,
    staleTime:           1000 * 60 * 3,   // 3 minutes
    gcTime:              1000 * 60 * 10,  // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount:      false,
  }
}
```

### Query Keys Pattern
```javascript
export const QUERY_KEYS = {
  PATIENTS:        (filters) => ["patients", filters],
  PATIENT:         (id)      => ["patient", id],
  DASHBOARD_STATS:            ["dashboard-stats"],
  DOCTORS:         (filters) => ["doctors", filters],
  PRICING:                    ["pricing"],
  MY_PAYMENTS:                ["my-payments"],
};
```

---

## Auth Flow

```
Login → POST /auth/login → JWT stored in localStorage
Every request → Axios interceptor adds Authorization: Bearer <token>
401 response → auto logout + redirect to /login

Forgot Password:
  /forgot-password → email input → POST /auth/forgot-password
  Email arrives with link → /reset-password/:token
  New password form → POST /auth/reset-password/:token
  Success → redirect to /login
```

---

## Forms Pattern

All forms use **Formik + Joi**:

```javascript
const formik = useFormik({
  initialValues: { ... },
  validate: (values) => {
    const { error } = schema.validate(values, { abortEarly: false });
    if (!error) return {};
    return error.details.reduce((acc, d) => ({
      ...acc, [d.path[0]]: d.message,
    }), {});
  },
  onSubmit: (values) => mutate(values),
});
```

---

## Vite Build Config

```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ["react", "react-dom", "react-router-dom"],
        query:  ["@tanstack/react-query"],
        ui:     ["lucide-react", "framer-motion"],
        stripe: ["@stripe/stripe-js"],
      },
    },
  },
}
```

---

## Running Locally

```bash
# Install
npm install

# Development
npm run dev

# Production build
npm run build
npm run preview
```

---

## Production Checklist

```
☐ VITE_API_URL points to production backend
☐ VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx (not test)
☐ npm run build → no errors
☐ Bundle size checked (vite build output)
☐ /payment/success and /payment/cancel routes are public (no auth)
☐ 404 handling configured on host (redirect to index.html for SPA)
```

### SPA 404 Fix by Host

```
Vercel    → vercel.json: { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
Netlify   → _redirects file: /* /index.html 200
Nginx     → try_files $uri $uri/ /index.html;
```