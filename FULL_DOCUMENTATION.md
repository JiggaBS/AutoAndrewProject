# AutoGroup Romagna - Complete Documentation

> **Version:** 2.1.0  
> **Last Updated:** December 2024  
> **Platform:** Lovable + Supabase Cloud

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Setup & Installation](#4-setup--installation)
5. [Environment Configuration](#5-environment-configuration)
6. [Database Schema](#6-database-schema)
7. [Database Functions](#7-database-functions)
8. [Edge Functions (Backend)](#8-edge-functions-backend)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Messaging System](#10-messaging-system)
11. [Notification System](#11-notification-system)
12. [Frontend Structure](#12-frontend-structure)
13. [Components Reference](#13-components-reference)
14. [Pages Reference](#14-pages-reference)
15. [Design System](#15-design-system)
16. [API Integration](#16-api-integration)
17. [SEO & Analytics](#17-seo--analytics)
18. [Deployment](#18-deployment)
19. [Security Considerations](#19-security-considerations)
20. [Database Migration Export](#20-database-migration-export)
21. [Troubleshooting](#21-troubleshooting)
22. [Future Enhancements](#22-future-enhancements)

---

## 1. Project Overview

### Description
AutoGroup Romagna is a professional **car dealership web application** designed for Italian automotive dealers. It integrates with the **Multigestionale API** to automatically display and manage vehicle inventory without manual data entry.

### Key Features

#### Public Features
- **Homepage** - Hero section, latest arrivals, testimonials, trust indicators
- **Vehicle Listings** - Advanced filtering, sorting, search functionality
- **Vehicle Detail Pages** - Image gallery, specifications, financing calculator
- **Car Valuation Form** - Users can submit their car for valuation
- **Contact Page** - Dealership information, map, contact form
- **Blog** - Content marketing section
- **FAQ** - Frequently asked questions
- **Legal Pages** - Privacy Policy, Cookie Policy, Terms & Conditions

#### User Features
- **User Authentication** - Email/password and Google OAuth
- **Customer Area** - View valuation requests, saved vehicles
- **Vehicle Favorites** - Save vehicles to favorites
- **Real-time Messaging** - Chat with admin about valuation requests
- **Real-time Notifications** - Bell icon with unread message counts
- **Request Tracking** - Track status of valuation requests

#### Admin Features
- **Admin Dashboard** - Full overview with statistics
- **Valuation Request Management** - View, filter, update status, add notes, set offers
- **Real-time Messaging** - Reply to customer messages
- **Notification Bell** - Real-time alerts for new messages/requests
- **Activity Log** - Track all admin actions
- **Analytics Dashboard** - Visual statistics and charts
- **CSV Export** - Export valuation requests
- **Settings Management** - Application configuration

### Target Audience
- Italian car dealerships using Multigestionale inventory management
- End users searching for used/new vehicles in Italy

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.x | Type Safety |
| **Vite** | 5.x | Build Tool & Dev Server |
| **React Router** | 6.30.1 | Client-side Routing |
| **TanStack Query** | 5.83.0 | Data Fetching & Caching |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **Shadcn/UI** | Latest | UI Component Library |
| **Lucide React** | 0.462.0 | Icon Library |
| **React Hook Form** | 7.61.1 | Form Management |
| **Zod** | 3.25.76 | Schema Validation |
| **date-fns** | 3.6.0 | Date Utilities |
| **Recharts** | 2.15.4 | Charts & Analytics |
| **next-themes** | 0.3.0 | Dark/Light Theme |

### Backend (Lovable Cloud / Supabase)

| Technology | Purpose |
|------------|---------|
| **Supabase Database** | PostgreSQL database |
| **Supabase Auth** | Authentication (Email, OAuth) |
| **Supabase Edge Functions** | Serverless backend logic (Deno) |
| **Supabase RLS** | Row Level Security policies |
| **Supabase Realtime** | Real-time subscriptions |
| **Resend** | Email notifications |

### External Integrations

| Service | Purpose |
|---------|---------|
| **Multigestionale API** | Vehicle inventory data |
| **Google Analytics** | Usage analytics |
| **Google Maps** | Dealership location |
| **WhatsApp** | Customer communication |
| **Sentry** | Error tracking (optional) |

---

## 3. Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │  Components │  │     State Management    │  │
│  │  (Routes)   │  │  (UI/Logic) │  │  (TanStack Query + useState)│
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘  │
│         │                │                      │                │
│         └────────────────┴──────────────────────┘                │
│                          │                                       │
│                    Supabase Client                               │
│                    + Realtime Subscriptions                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LOVABLE CLOUD (Supabase)                     │
│  ┌─────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │  Edge Functions │  │  Authentication │  │
│  │   Database      │  │  (Deno Runtime) │  │  (Supabase Auth)│  │
│  │                 │  │                 │  │                 │  │
│  │ - user_roles    │  │ - fetch-vehicles│  │ - Email/Pass    │  │
│  │ - user_profiles │  │ - submit-valuation │ - Google OAuth  │  │
│  │ - valuation_req │  │ - public-config │  │                 │  │
│  │ - valuation_msg │  │ - notify-admin  │  │                 │  │
│  │ - saved_vehicles│  │ - notify-client │  │                 │  │
│  │ - activity_log  │  │                 │  │                 │  │
│  │ - app_settings  │  │                 │  │                 │  │
│  └─────────────────┘  └────────┬────────┘  └─────────────────┘  │
│                                │                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    REALTIME ENGINE                          ││
│  │  - valuation_requests (status, offers, messages)            ││
│  │  - valuation_messages (new messages)                        ││
│  └─────────────────────────────────────────────────────────────┘│
└────────────────────────────────┼────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Multigestionale │  │     Resend      │  │ Google Analytics│  │
│  │   (XML API)     │  │  (Email SMTP)   │  │   (Tracking)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or bun
- Git
- Lovable account (for cloud features)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/autoandrew-webapp.git
cd autoandrew-webapp
```

#### 2. Install Dependencies
```bash
npm install
# or
bun install
```

#### 3. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"

# Optional: Google Analytics
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Optional: Error tracking with Sentry
VITE_SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
```

#### 4. Start Development Server
```bash
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:8080`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 5. Environment Configuration

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | ✅ Yes |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | ✅ Yes |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | ❌ Optional |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | ❌ Optional |

### Backend Secrets (Supabase Edge Functions)

These secrets are configured in Lovable Cloud:

| Secret | Description |
|--------|-------------|
| `MULTIGESTIONALE_API_KEY` | API key for vehicle inventory |
| `RESEND_API_KEY` | API key for email notifications |
| `SUPABASE_URL` | Auto-configured |
| `SUPABASE_ANON_KEY` | Auto-configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-configured |

---

## 6. Database Schema

### Tables Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│    user_profiles    │     │     user_roles      │
├─────────────────────┤     ├─────────────────────┤
│ id (uuid, PK)       │     │ id (uuid, PK)       │
│ user_id (uuid)      │────▶│ user_id (uuid)      │
│ name (text)         │     │ role (app_role)     │
│ surname (text)      │     │ created_at          │
│ email (text)        │     └─────────────────────┘
│ phone (text)        │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────────────┐
│     valuation_requests      │
├─────────────────────────────┤
│ id (uuid, PK)               │
│ make (text)                 │
│ model (text)                │
│ year (integer)              │
│ fuel_type (text)            │
│ mileage (integer)           │
│ condition (text)            │
│ price (integer)             │
│ name (text)                 │
│ email (text)                │
│ phone (text)                │
│ notes (text)                │
│ images (jsonb)              │
│ estimated_value (integer)   │
│ final_offer (integer)       │
│ admin_notes (text)          │
│ appointment_date (timestamptz)│
│ status (text)               │
│ user_id (uuid)              │
│ last_message_at (timestamptz)│
│ last_message_preview (text) │
│ unread_count_admin (integer)│
│ unread_count_user (integer) │
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│     valuation_messages      │
├─────────────────────────────┤
│ id (uuid, PK)               │
│ request_id (uuid, FK)       │
│ sender_user_id (uuid)       │
│ sender_type (text)          │  ─► 'user' | 'admin' | 'system'
│ body (text)                 │
│ attachments (jsonb)         │
│ read_at (timestamptz)       │
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│   saved_vehicles    │     │    activity_log     │
├─────────────────────┤     ├─────────────────────┤
│ id (uuid, PK)       │     │ id (uuid, PK)       │
│ user_id (uuid)      │     │ user_id (uuid)      │
│ vehicle_data (jsonb)│     │ action (text)       │
│ created_at          │     │ entity_type (text)  │
└─────────────────────┘     │ entity_id (uuid)    │
                            │ details (jsonb)     │
┌─────────────────────┐     │ read_at (timestamptz)│
│    app_settings     │     │ created_at          │
├─────────────────────┤     └─────────────────────┘
│ id (uuid, PK)       │
│ key (text, UNIQUE)  │
│ value (text)        │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

### Enums

```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');
```

### Valuation Request Statuses

| Status | Italian Label | Description |
|--------|--------------|-------------|
| `pending` | In Attesa | New request, awaiting review |
| `contacted` | In Revisione | Admin has contacted the customer |
| `completed` | Completato | Request is completed/accepted |
| `rejected` | Rifiutato | Request was rejected |

---

## 7. Database Functions

### Core Security Functions

#### `has_role(user_id, role)`
Check if a user has a specific role.

```sql
SELECT has_role('user-uuid-here', 'admin'); -- Returns boolean
```

#### `get_user_role(user_id)`
Get the role of a user.

```sql
SELECT get_user_role('user-uuid-here'); -- Returns 'admin' or 'user'
```

#### `user_owns_valuation_request(request_id)`
Check if the current user owns a valuation request.

```sql
SELECT user_owns_valuation_request('request-uuid'); -- Returns boolean
```

### Messaging Functions

#### `send_valuation_message(request_id, body, attachments)`
Send a message in a valuation thread. **This is the ONLY way to insert messages** - direct INSERTs are blocked by RLS.

```sql
SELECT send_valuation_message(
  'request-uuid',
  'Hello, your car is ready for pickup!',
  NULL
);
```

**Validation Rules:**
- Caller must be authenticated
- Caller must own the request OR be an admin
- Users can only message on `pending` status requests
- Admins can always message
- Empty messages are rejected
- Max message length: 2000 characters

**Side Effects:**
- Updates `last_message_at` and `last_message_preview` on the request
- Increments `unread_count_admin` or `unread_count_user`
- Logs activity to `activity_log`

#### `mark_thread_read(request_id)`
Mark all messages in a thread as read for the current user.

```sql
SELECT mark_thread_read('request-uuid');
```

**Behavior:**
- If admin: marks user messages as read, resets `unread_count_admin`
- If user: marks admin messages as read, resets `unread_count_user`

#### `insert_system_message(request_id, body)`
Insert a system message (admin only). Used for automated notifications like status changes.

```sql
SELECT insert_system_message(
  'request-uuid',
  'Status changed to Completed'
);
```

### Trigger Functions

#### `handle_new_user()`
Automatically creates user profile and role on signup.

```sql
-- Triggered on auth.users INSERT
-- Creates:
-- 1. Row in user_profiles (with email and name from auth metadata)
-- 2. Row in user_roles (with default 'user' role)
```

---

## 8. Edge Functions (Backend)

### Location
```
supabase/functions/
├── fetch-vehicles/
│   └── index.ts
├── submit-valuation/
│   └── index.ts
├── public-config/
│   └── index.ts
├── notify-admin/
│   └── index.ts
└── notify-client/
    └── index.ts
```

### Function: `fetch-vehicles`

**Purpose:** Fetches vehicle inventory from Multigestionale XML API and converts to JSON.

**Endpoint:** `POST /functions/v1/fetch-vehicles`

**Request Body:**
```json
{
  "engine": "car",
  "make": "BMW",
  "model": "Serie 3",
  "vehicle_class": "new",
  "limit": 50,
  "sort": "price",
  "invert": "1"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ad_number": 12345,
      "title": "BMW Serie 3 320d",
      "make": "BMW",
      "model": "Serie 3",
      "version": "320d",
      "price": 35000,
      "mileage": "45000",
      "fuel_type": "Diesel",
      "images": ["https://..."]
    }
  ],
  "count": 50
}
```

### Function: `submit-valuation`

**Purpose:** Handles car valuation form submissions, saves to database, sends email notifications.

**Endpoint:** `POST /functions/v1/submit-valuation`

**Request Body:**
```json
{
  "make": "Fiat",
  "model": "500",
  "year": 2019,
  "fuel_type": "Benzina",
  "mileage": 50000,
  "condition": "good",
  "price": 8000,
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "phone": "+39 333 1234567",
  "notes": "Optional notes",
  "images": []
}
```

### Function: `notify-admin`

**Purpose:** Sends email notification to admin when a new valuation request is submitted.

**Requires:** `RESEND_API_KEY` secret

### Function: `notify-client`

**Purpose:** Sends email notification to client when their request status changes.

**Requires:** `RESEND_API_KEY` secret

### Function: `public-config`

**Purpose:** Provides public configuration values (non-sensitive settings).

**Endpoint:** `GET /functions/v1/public-config`

---

## 9. Authentication & Authorization

### Authentication Methods

1. **Email/Password**
   - Standard signup with email confirmation
   - Auto-confirm enabled for development

2. **Google OAuth**
   - Social login via Google

### User Roles

| Role | Permissions |
|------|-------------|
| `user` | Access customer area, save vehicles, submit valuations, message admin |
| `admin` | Full access to admin panel, manage requests, manage users, reply to messages |

### Authentication Flow

```
┌─────────┐     ┌───────────┐     ┌────────────────┐
│  User   │────▶│ Auth Page │────▶│ Supabase Auth  │
└─────────┘     └───────────┘     └───────┬────────┘
                                          │
                                          ▼
                              ┌─────────────────────┐
                              │  Trigger: handle_new_user()
                              │  - Creates user_profile
                              │  - Creates user_role ('user')
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
           ┌───────────────┐                         ┌───────────────┐
           │ Admin Panel   │                         │ Customer Area │
           │ (/admin)      │                         │ (/dashboard)  │
           └───────────────┘                         └───────────────┘
```

### Creating First Admin User

1. Register a user through the signup form
2. Find the user's UUID:
```sql
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';
```
3. Update their role:
```sql
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '<user-uuid>';
```

---

## 10. Messaging System

### Overview

The messaging system allows real-time communication between customers and admins within valuation request threads.

### Architecture

```
┌─────────────────┐      ┌─────────────────┐
│  Customer UI    │      │    Admin UI     │
│  (ChatThread)   │      │  (MessageThread)│
└────────┬────────┘      └────────┬────────┘
         │                        │
         ▼                        ▼
┌────────────────────────────────────────────┐
│          send_valuation_message()          │
│  (RPC function - validates & inserts)      │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│           valuation_messages               │
│  (Table with RLS - read only via SELECT)   │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│            Supabase Realtime               │
│  (Broadcasts changes to subscribers)       │
└────────────────────────────────────────────┘
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChatThread` | `src/features/messages/components/ChatThread.tsx` | Customer chat UI |
| `MessageThread` | `src/components/MessageThread.tsx` | Admin chat UI |
| `MessageBubble` | `src/features/messages/components/MessageBubble.tsx` | Individual message display |
| `Composer` | `src/features/messages/components/Composer.tsx` | Message input field |
| `useMessages` | `src/features/messages/hooks/useMessages.ts` | Message fetching hook |

### Message Types

| Type | Description |
|------|-------------|
| `user` | Message from customer |
| `admin` | Message from admin |
| `system` | Automated system message (status changes, etc.) |

### Security Rules

1. **Insert Blocked:** Direct INSERTs to `valuation_messages` are blocked by RLS
2. **Must Use RPC:** All messages must go through `send_valuation_message()` function
3. **Validation:** Function validates authentication, ownership, and status
4. **Users Can Only Message on Pending:** Customers cannot message after request is closed

---

## 11. Notification System

### Overview

Real-time notification bell that shows unread messages and request updates.

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `NotificationBell` | `src/components/NotificationBell.tsx` | Bell icon with dropdown |
| `useRealtimeNotifications` | `src/hooks/useRealtimeNotifications.ts` | Realtime subscription hook |

### Features

- **Unread Count Badge:** Shows total unread messages
- **Timestamps:** Full date/time display (DD/MM HH:MM format)
- **Click to Navigate:** Clicking notification opens the correct request
- **Mark All Read:** Button to mark all notifications as read
- **Realtime Updates:** Subscribes to database changes
- **Polling Fallback:** 15-second polling if realtime fails

### Notification Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    New Message Inserted                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Realtime Broadcast                     │
│  (postgres_changes on valuation_messages)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Admin Subscribers  │         │  Client Subscribers │
│  (NotificationBell) │         │  (NotificationBell) │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  - Toast notification│         │  - Toast notification│
│  - Sound alert       │         │  - Sound alert       │
│  - Badge update      │         │  - Badge update      │
└─────────────────────┘         └─────────────────────┘
```

### Click Navigation

When a notification is clicked:
1. Calls `mark_thread_read()` to clear unread count
2. Navigates to `/admin?request=<id>` or `/dashboard?request=<id>`
3. Target page auto-opens the request detail dialog

---

## 12. Frontend Structure

### Directory Structure

```
src/
├── assets/                 # Static assets (images, fonts)
│   └── hero-bg.webp
├── components/             # Reusable components
│   ├── admin/             # Admin-specific components
│   │   ├── ActivityLog.tsx
│   │   ├── AdminFilters.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── AdminSettings.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminStats.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── MobileRequestCard.tsx
│   │   └── RequestDetailDialog.tsx
│   ├── home/              # Homepage components
│   │   ├── CTASection.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LatestArrivals.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── TrustSection.tsx
│   ├── ui/                # Shadcn/UI components
│   │   └── ... (50+ components)
│   ├── ClientRequestCard.tsx    # Customer request card with chat
│   ├── MessageThread.tsx        # Admin message thread
│   ├── NotificationBell.tsx     # Notification bell component
│   ├── Header.tsx
│   ├── VehicleCard.tsx
│   └── ... (other components)
├── contexts/              # React Contexts
│   └── LanguageContext.tsx
├── features/              # Feature modules
│   └── messages/          # Messaging feature
│       ├── components/
│       │   ├── ChatThread.tsx
│       │   ├── Composer.tsx
│       │   ├── MessageBubble.tsx
│       │   ├── MessageList.tsx
│       │   └── ThreadHeader.tsx
│       ├── hooks/
│       │   └── useMessages.ts
│       ├── types.ts
│       └── index.ts
├── hooks/                 # Custom React hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   ├── usePageTracking.ts
│   └── useRealtimeNotifications.ts
├── integrations/          # Third-party integrations
│   └── supabase/
│       ├── client.ts     # ⚠️ Auto-generated - DO NOT EDIT
│       └── types.ts      # ⚠️ Auto-generated - DO NOT EDIT
├── lib/                   # Utilities and API
│   ├── api/
│   │   ├── savedVehicles.ts
│   │   └── vehicles.ts
│   ├── analytics.ts
│   ├── sentry.ts
│   ├── supabase.ts
│   └── utils.ts
├── pages/                 # Route components
│   ├── Admin.tsx
│   ├── Auth.tsx
│   ├── Blog.tsx
│   ├── Contatti.tsx
│   ├── CookiePolicy.tsx
│   ├── CustomerArea.tsx   # Customer dashboard
│   ├── FAQ.tsx
│   ├── Index.tsx
│   ├── Listings.tsx
│   ├── NotFound.tsx
│   ├── PrivacyPolicy.tsx
│   ├── TermsConditions.tsx
│   ├── TrackRequest.tsx
│   ├── Valutiamo.tsx
│   └── VehicleDetail.tsx
├── App.tsx                # Main app component with routing
├── index.css              # Global styles & CSS variables
└── main.tsx               # Entry point
```

### Routing Configuration

```typescript
// App.tsx Routes
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/listings" element={<Listings />} />
  <Route path="/vehicle/:id" element={<VehicleDetail />} />
  <Route path="/valutiamo" element={<Valutiamo />} />
  <Route path="/contatti" element={<Contatti />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/admin" element={<Admin />} />
  <Route path="/dashboard" element={<CustomerArea />} />
  <Route path="/track/:id" element={<TrackRequest />} />
  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
  <Route path="/cookie-policy" element={<CookiePolicy />} />
  <Route path="/terms" element={<TermsConditions />} />
  <Route path="/faq" element={<FAQ />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 13. Components Reference

### Core Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `Header` | Main navigation header | `components/Header.tsx` |
| `Footer` | Site footer with links | `components/home/Footer.tsx` |
| `VehicleCard` | Vehicle listing card | `components/VehicleCard.tsx` |
| `VehicleGrid` | Grid of vehicle cards | `components/VehicleGrid.tsx` |
| `SearchFilters` | Filtering controls | `components/SearchFilters.tsx` |
| `ImageGallery` | Vehicle image gallery | `components/ImageGallery.tsx` |
| `FinancingCalculator` | Loan calculator | `components/FinancingCalculator.tsx` |
| `NotificationBell` | Real-time notifications | `components/NotificationBell.tsx` |
| `ClientRequestCard` | Customer request with chat | `components/ClientRequestCard.tsx` |
| `MessageThread` | Admin message view | `components/MessageThread.tsx` |
| `SEO` | Meta tags component | `components/SEO.tsx` |
| `ErrorBoundary` | Error handling | `components/ErrorBoundary.tsx` |
| `WhatsAppButton` | Floating WhatsApp CTA | `components/WhatsAppButton.tsx` |

### Admin Components

| Component | Purpose |
|-----------|---------|
| `AdminStats` | Dashboard statistics cards |
| `AdminFilters` | Request filtering controls |
| `AdminSidebar` | Navigation sidebar |
| `AdminHeader` | Admin header with notifications |
| `RequestDetailDialog` | View/edit request details + messaging |
| `ActivityLog` | View admin activity history |
| `AnalyticsDashboard` | Charts and analytics |
| `AdminSettings` | Application settings |

### Feature: Messages

| Component | Purpose |
|-----------|---------|
| `ChatThread` | Full chat interface for customers |
| `MessageList` | Scrollable list of messages |
| `MessageBubble` | Individual message styling |
| `Composer` | Text input with send button |
| `ThreadHeader` | Request info header |

---

## 14. Pages Reference

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Landing page with hero, latest arrivals, testimonials |
| Listings | `/listings` | Vehicle inventory with filters |
| Vehicle Detail | `/vehicle/:id` | Single vehicle details |
| Valutiamo | `/valutiamo` | Car valuation submission form |
| Contatti | `/contatti` | Contact page with map |
| Blog | `/blog` | Blog/news section |
| FAQ | `/faq` | Frequently asked questions |
| Privacy Policy | `/privacy-policy` | GDPR privacy policy |
| Cookie Policy | `/cookie-policy` | Cookie information |
| Terms | `/terms` | Terms and conditions |
| Track Request | `/track/:id` | Track a specific request by ID |

### Protected Pages

| Page | Route | Access |
|------|-------|--------|
| Auth | `/auth` | Login/Signup |
| Customer Area | `/dashboard` | Authenticated users |
| Admin | `/admin` | Admin role only |

### Query Parameters

| Page | Parameter | Effect |
|------|-----------|--------|
| `/admin` | `?request=<uuid>` | Auto-opens request detail dialog |
| `/dashboard` | `?request=<uuid>` | Auto-opens request detail dialog |

---

## 15. Design System

### Color Palette

The design system uses HSL CSS variables for theming:

#### Dark Theme (Default)

```css
:root {
  --background: 220 20% 10%;      /* Dark blue-gray */
  --foreground: 210 20% 98%;      /* Near white */
  --primary: 25 95% 53%;          /* Vibrant orange */
  --secondary: 220 20% 18%;       /* Darker blue-gray */
  --muted: 220 20% 18%;           /* Muted background */
  --accent: 25 95% 53%;           /* Same as primary */
  --card: 220 20% 14%;            /* Card background */
  --border: 220 20% 20%;          /* Border color */
  --destructive: 0 62% 30%;       /* Red for errors */
  --success: 142 76% 36%;         /* Green for success */
  --warning: 39 100% 50%;         /* Yellow for warnings */
}
```

### Typography

| Font | Usage |
|------|-------|
| **Inter** | Body text, UI elements |
| **Montserrat** | Display headings, titles |

### Responsive Breakpoints

| Breakpoint | Min Width | Tailwind Prefix |
|------------|-----------|-----------------|
| Mobile | 0px | (default) |
| Small | 640px | `sm:` |
| Medium | 768px | `md:` |
| Large | 1024px | `lg:` |
| XL | 1280px | `xl:` |
| 2XL | 1400px | `2xl:` |

---

## 16. API Integration

### Multigestionale API

The application integrates with Multigestionale's XML API for vehicle data.

#### Available Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `engine` | Vehicle type | `car`, `moto`, `commercial` |
| `make` | Manufacturer | `BMW`, `Audi` |
| `model` | Model name | `Serie 3` |
| `vehicle_class` | New/Used | `new`, `used` |
| `category` | Category filter | `suv`, `sedan` |
| `limit` | Max results | `50` |
| `sort` | Sort field | `price`, `date` |
| `invert` | Sort direction | `1` (descending) |

#### Usage in Frontend

```typescript
import { fetchVehicles } from "@/lib/api/vehicles";

const response = await fetchVehicles({
  engine: "car",
  make: "BMW",
  limit: 20,
  sort: "price",
});

if (response.success) {
  console.log(response.data); // Vehicle array
  console.log(response.count); // Total count
}
```

### Supabase Client

```typescript
import { supabase } from "@/integrations/supabase/client";

// Database queries
const { data, error } = await supabase
  .from("valuation_requests")
  .select("*")
  .order("created_at", { ascending: false });

// RPC function calls
const { data, error } = await supabase.rpc("send_valuation_message", {
  p_request_id: requestId,
  p_body: "Hello!",
});

// Realtime subscriptions
const channel = supabase
  .channel("messages")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "valuation_messages" },
    (payload) => console.log(payload)
  )
  .subscribe();
```

---

## 17. SEO & Analytics

### SEO Component

```tsx
import { SEO } from "@/components/SEO";

<SEO 
  title="Auto Usate e Nuove | AutoGroup Romagna"
  description="Scopri le migliori auto usate e nuove in Romagna"
  keywords="auto usate, concessionario, romagna"
  canonicalUrl="https://autogroupromagna.it/listings"
/>
```

### Google Analytics

Analytics is integrated via:

1. `GoogleAnalytics` component - Loads GA script
2. `PageTracker` component - Tracks page views
3. `usePageTracking` hook - Custom event tracking

```tsx
import { trackEvent } from "@/lib/analytics";

trackEvent("vehicle_view", {
  vehicle_id: vehicle.ad_number,
  make: vehicle.make,
  model: vehicle.model,
});
```

---

## 18. Deployment

### Lovable Deployment

1. **Frontend Changes**: Click "Update" in the publish dialog
2. **Backend Changes (Edge Functions)**: Deploy automatically

### Environment Setup for Production

Ensure all secrets are configured in Lovable Cloud:

- `MULTIGESTIONALE_API_KEY`
- `RESEND_API_KEY`
- `VITE_GA_MEASUREMENT_ID` (optional)

### Custom Domain

1. Go to Project > Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## 19. Security Considerations

### Row Level Security (RLS)

All database tables have RLS enabled:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `user_profiles` | Own + Admin | Own | Own | ❌ |
| `user_roles` | Own + Admin | Admin | Admin | Admin |
| `valuation_requests` | Admin | Anyone | Admin | Admin |
| `valuation_messages` | Own + Admin | ❌ (via RPC) | Own + Admin | ❌ |
| `saved_vehicles` | Own | Own | Own | Own |
| `activity_log` | Admin | Admin | ❌ | Admin |
| `app_settings` | Admin | Admin | Admin | Admin |

### Message Security

Messages can ONLY be inserted via the `send_valuation_message` function, which:
- Validates user authentication
- Checks ownership/permissions
- Prevents users from messaging on closed requests
- Auto-updates unread counts
- Logs activity

### XSS Prevention

HTML content is escaped in email templates and user inputs are sanitized.

### API Key Protection

- Multigestionale API key stored as backend secret
- Never exposed to frontend
- Accessed only via Edge Functions

---

## 20. Database Migration Export

All database migrations are exported in `supabase/migrations_export/` for external Supabase deployment.

### Files

| File | Purpose |
|------|---------|
| `001_enums.sql` | Create custom enum types |
| `002_tables.sql` | Create all tables |
| `003_indexes.sql` | Create performance indexes |
| `004_functions.sql` | Create database functions |
| `005_triggers.sql` | Create triggers |
| `006_rls_policies.sql` | Create RLS policies |
| `007_realtime.sql` | Enable realtime |
| `008_seed_data.sql` | Optional seed data |
| `full_migration.sql` | Combined single file |
| `README.md` | Migration documentation |

### Running Migrations

Run in order in your Supabase SQL editor:

```bash
1. 001_enums.sql
2. 002_tables.sql
3. 003_indexes.sql
4. 004_functions.sql
5. 005_triggers.sql
6. 006_rls_policies.sql
7. 007_realtime.sql
8. 008_seed_data.sql  # Optional
```

Or run `full_migration.sql` for everything at once.

---

## 21. Troubleshooting

### Common Issues

#### Vehicles Not Loading

1. Check `MULTIGESTIONALE_API_KEY` is configured
2. Verify API key is valid and IP is whitelisted
3. Check Edge Function logs for errors
4. Fallback to sample data if API unavailable

#### Messages Not Appearing

1. Messages must be sent via `send_valuation_message` function
2. Direct INSERTs are blocked by RLS
3. Check that user owns the request or is admin

#### Notifications Not Updating

1. Check realtime is enabled in database
2. Verify `supabase_realtime` publication includes tables
3. Check browser console for subscription status
4. Polling fallback should still work (every 15s)

#### Authentication Issues

1. Verify Supabase URL and anon key
2. Check redirect URLs are configured correctly
3. Ensure auto-confirm is enabled for development

### Debug Tools

```typescript
// Check Supabase connection
const { data, error } = await supabase.from('test').select('*');
console.log('Supabase test:', { data, error });

// Check user role
const { data } = await supabase.rpc('get_user_role', { _user_id: userId });
console.log('User role:', data);
```

---

## 22. Future Enhancements

### Completed ✅

- [x] Real-time messaging system
- [x] Notification bell with timestamps
- [x] Click-to-open request from notification
- [x] Auto-open request from URL parameter
- [x] Database migration export

### Short Term

- [ ] Test drive booking system
- [ ] Advanced image optimization
- [ ] Push notifications (browser)
- [ ] Email templates customization

### Medium Term

- [ ] Vehicle comparison tool
- [ ] Customer reviews system
- [ ] Multi-language support (EN, DE)
- [ ] File attachments in messages

### Long Term

- [ ] Mobile app (React Native)
- [ ] AI-powered vehicle recommendations
- [ ] CRM integration
- [ ] Payment/financing integration

---

## Resources

### Documentation Links

- [Lovable Docs](https://docs.lovable.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Supabase Docs](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)

### Support

For questions or issues:
1. Use Lovable Chat for development help
2. Check the troubleshooting section above
3. Review Edge Function logs in Lovable Cloud

---

## Changelog

### v2.1.0 (December 2024)
- Real-time messaging system between customers and admins
- Notification bell with timestamps and click-to-open
- Auto-open request dialog from URL query parameter
- Database migration export for external Supabase
- `valuation_messages` table with RLS
- Messaging RPC functions (`send_valuation_message`, `mark_thread_read`, `insert_system_message`)
- Realtime enabled for messages and requests
- Customer area improvements

### v2.0.0 (December 2024)
- Complete documentation overhaul
- Admin dashboard enhancements
- Mobile responsive improvements
- SEO optimizations with dynamic keywords
- Activity logging system

### v1.0.0 (Initial Release)
- Core functionality
- Vehicle listings integration
- Valuation form
- Authentication system
- Admin panel

---

*This documentation is maintained as part of the AutoGroup Romagna project. For the latest updates, check the project repository.*
