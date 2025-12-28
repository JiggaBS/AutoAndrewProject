# 📚 Complete Beginner's Guide to the Car Dealership Website

> **Professional Documentation** - Everything you need to know to customize and maintain this car dealership website.

---

## 📋 Table of Contents

### Part 1: Introduction & Overview
- [1. What is This Project?](#1-what-is-this-project)
- [2. Project Overview](#2-project-overview)
- [3. Technology Stack](#3-technology-stack)
- [4. Getting Started](#4-getting-started)

### Part 2: Project Structure
- [5. Understanding the File Structure](#5-understanding-the-file-structure)
- [6. Complete File Path Reference](#6-complete-file-path-reference)

### Part 3: Features Overview
- [7. All Features Explained](#7-all-features-explained)

### Part 4: Complete Function & Feature Guides
- [8. Vehicle API & Data Fetching](#8-vehicle-api--data-fetching)
- [9. Saved Vehicles / Favorites System](#9-saved-vehicles--favorites-system)
- [10. Analytics & Tracking System](#10-analytics--tracking-system)
- [11. Financing Calculator](#11-financing-calculator)
- [12. Vehicle Comparison System](#12-vehicle-comparison-system)
- [13. Messaging System](#13-messaging-system)
- [14. Real-time Notifications System](#14-real-time-notifications-system)
- [15. Forms System](#15-forms-system)
- [16. Authentication System](#16-authentication-system)
- [17. Image Handling System](#17-image-handling-system)
- [18. Sorting & Filtering System](#18-sorting--filtering-system)
- [19. Pagination System](#19-pagination-system)

### Part 5: SEO Optimization
- [20. SEO Optimizations - Complete Guide](#20-seo-optimizations---complete-guide)

### Part 6: Detailed Editing Guides
- [21. How to Add/Remove Search Filters](#21-how-to-addremove-search-filters)
- [22. How to Edit SEO](#22-how-to-edit-seo)
- [23. How to Add/Remove Vehicle Card Information](#23-how-to-addremove-vehicle-card-information)
- [24. How to Edit Vehicle Specifications](#24-how-to-edit-vehicle-specifications)
- [25. How to Change All Website Texts](#25-how-to-change-all-website-texts)
- [26. Privacy Policy, Cookie Policy, and Terms](#26-privacy-policy-cookie-policy-and-terms)
- [27. How to Edit Google Maps Location](#27-how-to-edit-google-maps-location)
- [28. How to Edit Cookie Consent Banner](#28-how-to-edit-cookie-consent-banner)

### Part 7: Common Tasks & Workflows
- [29. Common Editing Tasks](#29-common-editing-tasks)
- [30. Step-by-Step Editing Guide](#30-step-by-step-editing-guide)
- [31. Understanding the Code](#31-understanding-the-code)

### Part 8: Reference & Troubleshooting
- [32. Quick Reference: Finding What You Need](#32-quick-reference-finding-what-you-need)
- [33. Troubleshooting](#33-troubleshooting)
- [34. Additional Resources](#34-additional-resources)

---

## 📖 How to Use This Guide

### For Beginners:
1. **Start with:** [Section 1: What is This Project?](#1-what-is-this-project)
2. **Then read:** [Section 4: Getting Started](#4-getting-started)
3. **Learn structure:** [Section 5: Understanding the File Structure](#5-understanding-the-file-structure)
4. **Find what to edit:** Use [Section 32: Quick Reference](#32-quick-reference-finding-what-you-need)

### For Quick Edits:
- **Need to change text?** → [Section 25: How to Change All Website Texts](#25-how-to-change-all-website-texts)
- **Need to change contact info?** → [Section 29: Common Editing Tasks](#29-common-editing-tasks)
- **Need to add a filter?** → [Section 21: How to Add/Remove Search Filters](#21-how-to-addremove-search-filters)
- **Need to optimize SEO?** → [Section 20: SEO Optimizations](#20-seo-optimizations---complete-guide)

### For Understanding Features:
- Browse [Part 4: Complete Function & Feature Guides](#part-4-complete-function--feature-guides) for detailed explanations
- Each feature has: What it does, File locations, How to modify, Code examples

### Navigation Tips:
- Use `Ctrl+F` / `Cmd+F` to search within this document
- Click section links in Table of Contents to jump directly
- All file paths are provided with exact line numbers where applicable

---

## 1. What is This Project?

This is a **complete car dealership website** that allows you to:
- Display vehicles for sale automatically from Multigestionale API
- Let customers search and filter vehicles
- Allow customers to request vehicle valuations
- Manage customer messages and requests
- Track analytics and statistics
- Support multiple languages (Italian/English)

---

## 2. Project Overview

### Main Pages

1. **Homepage** (`/`) - First page visitors see
2. **Listings** (`/listings`) - All vehicles for sale
3. **Vehicle Detail** (`/vehicle/:id`) - Individual vehicle page
4. **Valuation** (`/valutiamo`) - Car valuation form
5. **Contact** (`/contatti`) - Contact information and form
6. **Blog** (`/blog`) - Blog posts
7. **FAQ** (`/faq`) - Frequently asked questions
8. **Admin** (`/admin`) - Admin dashboard (requires login)
9. **Customer Area** (`/dashboard`) - Customer account area
10. **Auth** (`/auth`) - Login/Register page

### Key Features

- ✅ Automatic vehicle inventory from API
- ✅ Advanced search and filters
- ✅ Vehicle comparison tool
- ✅ Financing calculator
- ✅ Real-time messaging
- ✅ Admin dashboard
- ✅ Customer accounts
- ✅ Multi-language support
- ✅ SEO optimized
- ✅ Mobile responsive

---

## 3. Technology Stack

**Frontend Framework:**
- **React 18** - Modern UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast build tool and development server

**Styling:**
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library

**Backend & Database:**
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage, Edge Functions)
- **PostgreSQL** - Relational database (via Supabase)

**State Management:**
- **React Query (TanStack Query)** - Server state management
- **React Context** - Global state (language, theme)

**Routing:**
- **React Router DOM** - Client-side routing

**Forms & Validation:**
- **React Hook Form** - Form state management
- **Zod** - Schema validation

**Other Libraries:**
- **date-fns** - Date formatting
- **recharts** - Charts and graphs
- **react-helmet-async** - SEO meta tags

---

## 4. Getting Started

### Prerequisites

Before you start editing, make sure you have:

1. **Node.js** installed (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify: Run `node --version` in terminal

2. **Code Editor** installed
   - Recommended: Visual Studio Code
   - Download from: https://code.visualstudio.com/

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### Installation Steps

1. **Open Terminal/Command Prompt**
   - Windows: PowerShell or Command Prompt
   - Mac/Linux: Terminal

2. **Navigate to Project Folder**
   ```bash
   cd "path/to/your/project"
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs all required packages (takes 2-5 minutes)

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The website will open at `http://localhost:8085` (or shown port)

5. **Open in Browser**
   - The terminal will show the local URL
   - Open it in your browser
   - Changes you make will auto-refresh

### First Steps

1. **Make a Simple Change:**
   - Open `src/components/Header.tsx`
   - Find the site name/logo
   - Change it to your dealership name
   - Save and see it update in browser

2. **Explore the Code:**
   - Use `Ctrl+F` (or `Cmd+F`) to search for text you see on the website
   - This helps you find which file contains what

3. **Read This Guide:**
   - Start with sections you need
   - Use the table of contents to jump to specific topics

---

## 5. Understanding the File Structure

### 📁 Main Folders

```
src/
├── pages/          # All website pages
├── components/     # Reusable UI components
├── features/       # Feature-specific code (messages, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── contexts/       # Global state management
├── data/           # Sample data
└── integrations/  # External services (Supabase)

HOW_TO_START/
├── docs/           # Technical documentation
└── database/       # Database setup files

supabase/
├── functions/      # Backend functions (Edge Functions)
└── migrations/     # Database changes
```

### 📄 Important Files

- `src/App.tsx` - Main app file, defines all routes
- `src/main.tsx` - Entry point of the application
- `package.json` - Lists all dependencies
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration

---

## 6. Complete File Path Reference

### 📄 All Page Files

| Page | Full File Path | What It Contains |
|------|---------------|------------------|
| **Homepage** | `src/pages/Index.tsx` | Main landing page with hero, latest arrivals, testimonials |
| **Listings** | `src/pages/Listings.tsx` | All vehicles listing with filters and search |
| **Vehicle Detail** | `src/pages/VehicleDetail.tsx` | Individual vehicle page with specs and gallery |
| **Valuation** | `src/pages/Valutiamo.tsx` | Car valuation request form |
| **Contact** | `src/pages/Contatti.tsx` | Contact information and contact form |
| **Blog** | `src/pages/Blog.tsx` | Blog posts page |
| **FAQ** | `src/pages/FAQ.tsx` | Frequently asked questions |
| **Admin** | `src/pages/Admin.tsx` | Admin dashboard (requires login) |
| **Customer Area** | `src/pages/CustomerArea.tsx` | User account area |
| **Auth** | `src/pages/Auth.tsx` | Login/Register page |
| **Privacy Policy** | `src/pages/PrivacyPolicy.tsx` | Privacy policy page |
| **Cookie Policy** | `src/pages/CookiePolicy.tsx` | Cookie policy page |
| **Terms & Conditions** | `src/pages/TermsConditions.tsx` | Terms and conditions page |
| **Track Request** | `src/pages/TrackRequest.tsx` | Track valuation request status |
| **404 Not Found** | `src/pages/NotFound.tsx` | 404 error page |

### 🧩 Component Files

| Component | Full File Path | What It Does |
|-----------|---------------|--------------|
| **Header** | `src/components/Header.tsx` | Main navigation bar |
| **Footer** | `src/components/home/Footer.tsx` | Footer with links and info |
| **Vehicle Card** | `src/components/VehicleCard.tsx` | Individual vehicle card display |
| **Vehicle Grid** | `src/components/VehicleGrid.tsx` | Grid layout for vehicles |
| **Search Filters** | `src/components/SearchFilters.tsx` | All search and filter options |
| **Vehicle Specs** | `src/components/VehicleSpecs.tsx` | Vehicle specifications display |
| **Image Gallery** | `src/components/ImageGallery.tsx` | Vehicle photo gallery |
| **Financing Calculator** | `src/components/FinancingCalculator.tsx` | Monthly payment calculator |
| **SEO Component** | `src/components/SEO.tsx` | SEO meta tags component |
| **Cookie Consent** | `src/components/CookieConsent.tsx` | Cookie consent banner |
| **Hero Section** | `src/components/home/HeroSection.tsx` | Homepage hero banner |
| **Latest Arrivals** | `src/components/home/LatestArrivals.tsx` | Latest vehicles section |
| **Testimonials** | `src/components/home/TestimonialsSection.tsx` | Customer testimonials |
| **Services** | `src/components/home/ServicesSection.tsx` | Services offered section |
| **Trust Section** | `src/components/home/TrustSection.tsx` | Trust indicators |
| **WhatsApp Button** | `src/components/WhatsAppButton.tsx` | Floating WhatsApp button |
| **Vehicle Compare** | `src/components/VehicleCompare.tsx` | Vehicle comparison tool |
| **Dealer Card** | `src/components/DealerCard.tsx` | Dealer information card |

### ⚙️ Configuration & Utility Files

| File | Full Path | What It Controls |
|------|-----------|------------------|
| **App Routes** | `src/App.tsx` | All page routes and navigation |
| **Translations** | `src/contexts/LanguageContext.tsx` | All website text (Italian/English) |
| **Tailwind Config** | `tailwind.config.ts` | Colors, fonts, styling |
| **Vite Config** | `vite.config.ts` | Build configuration |
| **Package Info** | `package.json` | Dependencies and scripts |
| **TypeScript Config** | `tsconfig.json` | TypeScript settings |
| **Vehicle API** | `src/lib/api/vehicles.ts` | Vehicle data fetching |
| **Saved Vehicles API** | `src/lib/api/savedVehicles.ts` | Favorites functionality |
| **Analytics** | `src/lib/analytics.ts` | Google Analytics tracking |
| **Sitemap** | `api/sitemap.xml.ts` | XML sitemap generation |
| **Robots.txt** | `public/robots.txt` | Search engine instructions |

---

## 7. All Features Explained

### 1. 🏠 Homepage (`src/pages/Index.tsx`)

**What it does:**
- Shows a hero section with main message
- Displays 8 latest vehicle arrivals
- Shows customer testimonials
- Displays trust indicators (warranties, certifications)
- Lists services offered
- Includes footer with links

**Key Components Used:**
- `HeroSection` - Large banner at top
- `LatestArrivals` - Shows newest vehicles
- `TestimonialsSection` - Customer reviews
- `TrustSection` - Trust badges
- `ServicesSection` - What you offer
- `Footer` - Bottom navigation

**How to Edit:**

1. **Change Hero Text:**
   - Open: `src/components/home/HeroSection.tsx`
   - Find the text you want to change
   - Edit the text between quotes

2. **Change Latest Arrivals Count:**
   - Open: `src/pages/Index.tsx`
   - Find: `limit: 8` (line ~28)
   - Change `8` to any number you want

3. **Edit Testimonials:**
   - Open: `src/components/home/TestimonialsSection.tsx`
   - Find the testimonials array
   - Edit or add new testimonials

4. **Change Services:**
   - Open: `src/components/home/ServicesSection.tsx`
   - Find the services array
   - Edit service titles and descriptions

---

### 2. 🔍 Vehicle Listings (`src/pages/Listings.tsx`)

**What it does:**
- Shows all available vehicles
- Provides advanced search filters
- Allows sorting by price, year, mileage
- Supports vehicle comparison (up to 3)
- Pagination (16 vehicles per page)
- Body type selection

**Key Features:**
- **Filters:** Make, Model, Price, Year, Fuel, Transmission, Mileage, Condition
- **Sorting:** Price, Mileage, Year, Newest
- **Body Types:** City Car, SUV, Van, Convertible, Minivan, Sedan, Station Wagon, Coupe
- **Comparison:** Select up to 3 vehicles to compare side-by-side

**How to Edit:**

1. **Change Items Per Page:**
   - Open: `src/pages/Listings.tsx`
   - Find: `const ITEMS_PER_PAGE = 16;` (line ~27)
   - Change `16` to your desired number

2. **Add/Remove Filters:**
   - Open: `src/components/SearchFilters.tsx`
   - Find the filter fields
   - Add or remove filter inputs

3. **Change Sort Options:**
   - Open: `src/components/SortSelector.tsx`
   - Find the `sortOptions` array
   - Add or modify sort options

4. **Edit Body Types:**
   - Open: `src/components/BodyTypeSelector.tsx`
   - Find the body types array
   - Add or remove body types

---

### 3. 🚗 Vehicle Detail Page (`src/pages/VehicleDetail.tsx`)

**What it does:**
- Shows complete vehicle information
- Displays image gallery with zoom
- Shows technical specifications
- Includes financing calculator
- Shows Google Maps location
- WhatsApp contact button
- Save to favorites (for logged-in users)
- Social sharing buttons
- Print vehicle sheet

**Key Components:**
- `ImageGallery` - Photo carousel
- `VehicleSpecs` - Technical details
- `FinancingCalculator` - Monthly payment calculator
- `WhatsAppButton` - Direct contact

**How to Edit:**

1. **Change Financing Calculator Defaults:**
   - Open: `src/components/FinancingCalculator.tsx`
   - Find default values (interest rate, duration, etc.)
   - Modify the default values

2. **Modify Vehicle Specifications Display:**
   - Open: `src/components/VehicleSpecs.tsx`
   - Find the specification fields
   - Add or remove fields

3. **Change WhatsApp Number:**
   - Open: `src/components/WhatsAppButton.tsx`
   - Find the phone number
   - Replace with your WhatsApp number

4. **Edit Image Gallery:**
   - Open: `src/components/ImageGallery.tsx`
   - Modify gallery behavior or styling

---

### 4. 💰 Car Valuation Form (`src/pages/Valutiamo.tsx`)

**What it does:**
- Allows customers to submit their car for valuation
- Upload up to 5 vehicle photos
- Collects vehicle information (make, model, year, etc.)
- Collects customer information (name, email, phone)
- Calculates automatic estimate
- Saves request to database
- Sends notification to admin

**Form Fields:**
- Vehicle: Make, Model, Year, Fuel Type, Mileage, Condition
- Customer: Name, Email, Phone, Notes
- Photos: Up to 5 images

**How to Edit:**

1. **Change Maximum Photos:**
   - Open: `src/pages/Valutiamo.tsx`
   - Find: `maxFiles: 5` or similar
   - Change the number

2. **Modify Form Fields:**
   - Open: `src/pages/Valutiamo.tsx`
   - Find the form schema (around line 44)
   - Add or remove fields from the schema
   - Add corresponding form fields in the JSX

3. **Change Estimate Calculation:**
   - Find the estimate calculation logic
   - Modify the formula to change how estimates are calculated

4. **Edit Success Message:**
   - Find the success toast/alert
   - Change the message text

---

### 5. 📧 Contact Page (`src/pages/Contatti.tsx`)

**What it does:**
- Shows dealership information
- Displays contact form
- Shows Google Maps location
- Business hours
- Contact details (phone, email, address)

**How to Edit:**

1. **Change Contact Information:**
   - Open: `src/pages/Contatti.tsx`
   - Find the contact details section
   - Update phone, email, address

2. **Modify Contact Form:**
   - Find the form fields
   - Add or remove fields as needed

3. **Change Map Location:**
   - Find the Google Maps embed
   - Update the coordinates or address

4. **Edit Business Hours:**
   - Find the business hours section
   - Update the hours

---

### 6. 👨‍💼 Admin Dashboard (`src/pages/Admin.tsx`)

**What it does:**
- View all valuation requests
- Filter and search requests
- View request details
- Mark requests as read/unread
- Delete requests
- View statistics and analytics
- Manage settings
- View activity log
- Export data

**Key Sections:**
- **Stats:** Total requests, pending, completed
- **Requests Table:** List of all requests with filters
- **Request Detail:** Full details of selected request
- **Analytics:** Charts and statistics
- **Settings:** Admin configuration

**How to Edit:**

1. **Change Request Status Options:**
   - Open: `src/pages/Admin.tsx`
   - Find status options (pending, completed, etc.)
   - Add or modify statuses

2. **Modify Statistics Display:**
   - Open: `src/components/admin/AdminStats.tsx`
   - Change which statistics are shown

3. **Edit Filters:**
   - Open: `src/components/admin/AdminFilters.tsx`
   - Add or remove filter options

4. **Change Table Columns:**
   - Find the table header in `Admin.tsx`
   - Add or remove columns

---

### 7. 👤 Customer Area (`src/pages/CustomerArea.tsx`)

**What it does:**
- View saved favorite vehicles
- View valuation requests
- Edit profile information
- View messages
- Track request status

**Key Sections:**
- **Favorites:** Saved vehicles
- **My Requests:** Valuation requests submitted
- **Messages:** Conversations with admin
- **Profile:** Account settings

**How to Edit:**

1. **Modify Profile Fields:**
   - Find the profile form
   - Add or remove fields

2. **Change Favorites Display:**
   - Find the favorites section
   - Modify how vehicles are displayed

3. **Edit Request Status Display:**
   - Find the status badges
   - Change colors or labels

---

### 8. 💬 Messaging System (`src/features/messages/`)

**What it does:**
- Real-time messaging between customers and admin
- Message attachments support
- Thread-based conversations
- Read/unread status
- Notifications

**Key Components:**
- `MessageThread` - Conversation view
- `Composer` - Message input
- `MessageList` - List of messages
- `MessageBubble` - Individual message

**How to Edit:**

1. **Change Message Limits:**
   - Find message validation
   - Modify character limits

2. **Add Emoji Support:**
   - Find the composer component
   - Add emoji picker library

3. **Modify Attachment Limits:**
   - Find file upload logic
   - Change file size or count limits

---

### 9. 🌐 Multi-Language Support (`src/contexts/LanguageContext.tsx`)

**What it does:**
- Supports Italian and English
- Language switcher in header
- All text is translatable
- Remembers user preference

**How to Edit:**

1. **Add New Language:**
   - Open: `src/contexts/LanguageContext.tsx`
   - Add new language to the translations object
   - Add language option to switcher

2. **Change Translations:**
   - Find the translation object
   - Modify text for any key

3. **Add New Translated Text:**
   - Add new key to translations object
   - Use `t("your.key")` in components

---

### 10. 🎨 Header & Navigation (`src/components/Header.tsx`)

**What it does:**
- Main navigation menu
- Language switcher
- User account menu
- Mobile responsive menu
- Logo display

**How to Edit:**

1. **Change Navigation Links:**
   - Open: `src/components/Header.tsx`
   - Find the navigation items
   - Add, remove, or modify links

2. **Change Logo:**
   - Find the logo image
   - Replace with your logo file
   - Update the path

3. **Modify Menu Items:**
   - Find the menu structure
   - Add or remove items

---

### 11. 🦶 Footer (`src/components/home/Footer.tsx`)

**What it does:**
- Shows company information
- Links to important pages
- Social media links
- Newsletter subscription
- Copyright information

**How to Edit:**

1. **Change Footer Links:**
   - Open: `src/components/home/Footer.tsx`
   - Find the links array
   - Modify links

2. **Update Company Info:**
   - Find company details
   - Update address, phone, email

3. **Add Social Media:**
   - Find social links section
   - Add new social media platforms

---

### 12. 🔐 Authentication (`src/pages/Auth.tsx`)

**What it does:**
- User registration
- User login
- Password reset
- Email verification
- Session management

**How to Edit:**

1. **Modify Registration Fields:**
   - Open: `src/pages/Auth.tsx`
   - Find the registration form
   - Add or remove fields

2. **Change Auth Messages:**
   - Find success/error messages
   - Update text

3. **Modify Password Requirements:**
   - Find password validation
   - Change requirements

---

## 8. Vehicle API & Data Fetching

### Step-by-Step Editing Guide

#### 1. **Finding the Right File**

**Tip:** Use your code editor's search function (Ctrl+F or Cmd+F) to find text you see on the website.

**Example:** If you want to change "Latest Arrivals" text:
1. Search for "Latest Arrivals" in your editor
2. It will show you the file containing that text
3. Open that file and edit

#### 2. **Editing Text Content**

**Simple Text Changes:**
```tsx
// Before
<h1>Welcome to Our Dealership</h1>

// After
<h1>Welcome to AutoAndrew</h1>
```

**Finding Text:**
- Look for text in quotes: `"Your text here"`
- Look for text in JSX: `<p>Your text</p>`
- Check translation files for multi-language text

#### 3. **Editing Colors and Styles**

**Using Tailwind CSS:**
```tsx
// Change background color
className="bg-blue-500"  // Blue background
className="bg-red-500"   // Red background

// Change text color
className="text-white"   // White text
className="text-black"  // Black text

// Common colors: blue, red, green, yellow, purple, gray
// Shades: 50 (lightest) to 900 (darkest)
```

**Where to Find Styles:**
- Look for `className` attributes
- Check `tailwind.config.ts` for custom colors
- Check `src/index.css` for global styles

#### 4. **Adding New Pages**

1. Create new file in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`:
```tsx
const YourPage = lazy(() => import("./pages/YourPage"));

// In Routes:
<Route path="/your-page" element={<YourPage />} />
```
3. Add link in navigation if needed

#### 5. **Modifying Database Queries**

**Finding Database Code:**
- Look in `src/lib/api/` folder
- Check `src/integrations/supabase/` folder
- Search for `supabase.from()` calls

**Example:**
```typescript
// Fetching data
const { data, error } = await supabase
  .from('valuation_requests')
  .select('*')
  .eq('status', 'pending');
```

#### 6. **Changing Images**

1. Add image to `src/assets/` or `public/` folder
2. Import in component:
```tsx
import myImage from "@/assets/my-image.jpg";
```
3. Use in JSX:
```tsx
<img src={myImage} alt="Description" />
```

---

## 29. Common Editing Tasks

### Task 1: Change Website Name/Branding

**Files to Edit:**
1. `src/components/Header.tsx` - Logo and site name
2. `src/components/home/Footer.tsx` - Footer branding
3. `src/components/SEO.tsx` - Meta tags (if used)
4. `index.html` - Page title

**Steps:**
1. Search for current brand name
2. Replace with your brand name
3. Replace logo image file

### Task 2: Change Contact Information

**Files to Edit:**
1. `src/pages/Contatti.tsx` - Contact page
2. `src/components/home/Footer.tsx` - Footer contact info
3. `src/components/WhatsAppButton.tsx` - WhatsApp number

**Steps:**
1. Find phone numbers, emails, addresses
2. Replace with your information
3. Update Google Maps location

### Task 3: Modify Vehicle Display

**Files to Edit:**
1. `src/components/VehicleCard.tsx` - Vehicle card design
2. `src/components/VehicleGrid.tsx` - Grid layout
3. `src/pages/VehicleDetail.tsx` - Detail page layout

**Steps:**
1. Open VehicleCard.tsx
2. Modify what information is shown
3. Adjust styling with Tailwind classes

### Task 4: Change Colors/Theme

**Files to Edit:**
1. `tailwind.config.ts` - Theme colors
2. `src/index.css` - Global styles
3. Individual component files

**Steps:**
1. Open `tailwind.config.ts`
2. Find `theme.colors` section
3. Modify color values
4. Or change individual `className` attributes

### Task 5: Add New Filter Option

**Files to Edit:**
1. `src/components/SearchFilters.tsx` - Add filter UI
2. `src/pages/Listings.tsx` - Add filter logic

**Steps:**
1. Add filter field to SearchFilters component
2. Add filter state in Listings page
3. Add filter logic to `filteredVehicles` useMemo

### Task 6: Modify Admin Dashboard

**Files to Edit:**
1. `src/pages/Admin.tsx` - Main admin page
2. `src/components/admin/` - Admin components

**Steps:**
1. Open Admin.tsx
2. Find the section you want to modify
3. Edit the component or add new sections

### Task 7: Change Language/Translations

**Files to Edit:**
1. `src/contexts/LanguageContext.tsx` - All translations

**Steps:**
1. Open LanguageContext.tsx
2. Find the translation key
3. Modify the text for Italian or English
4. Add new keys if needed

### Task 8: Modify Form Validation

**Files to Edit:**
1. The page containing the form (e.g., `Valutiamo.tsx`)
2. Look for `zod` schema or validation rules

**Steps:**
1. Find the validation schema (usually at top of file)
2. Modify validation rules
3. Change error messages

---

## 31. Understanding the Code

### Basic React Concepts

**Components:**
```tsx
// A component is a reusable piece of UI
const MyComponent = () => {
  return <div>Hello World</div>;
};
```

**Props (Properties):**
```tsx
// Components can receive data via props
const Greeting = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

// Usage:
<Greeting name="John" />
```

**State:**
```tsx
// State stores data that can change
const [count, setCount] = useState(0);

// Update state:
setCount(count + 1);
```

**Effects:**
```tsx
// Run code when component loads or data changes
useEffect(() => {
  // Your code here
}, [dependencies]);
```

### TypeScript Basics

**Types:**
```typescript
// Define what data looks like
interface Vehicle {
  id: number;
  make: string;
  model: string;
  price: number;
}

// Use the type:
const vehicle: Vehicle = {
  id: 1,
  make: "Toyota",
  model: "Corolla",
  price: 15000
};
```

### Common Patterns in This Project

**Fetching Data:**
```typescript
const [vehicles, setVehicles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    setLoading(true);
    const data = await fetchVehicles();
    setVehicles(data);
    setLoading(false);
  }
  loadData();
}, []);
```

**Form Handling:**
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ }
});

const onSubmit = async (data) => {
  // Handle form submission
};
```

**Conditional Rendering:**
```tsx
{loading ? (
  <Skeleton />
) : (
  <VehicleList vehicles={vehicles} />
)}
```

---

## 32. Quick Reference: Finding What You Need

### How to Find Text on the Website

**Solutions:**
1. Save the file (Ctrl+S / Cmd+S)
2. Check if dev server is running: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R / Cmd+Shift+R
4. Check browser console for errors (F12)

**Method 1: Search in Code Editor**
1. Press `Ctrl+F` (Windows) or `Cmd+F` (Mac)
2. Type the exact text you see on the website
3. The editor will show you which file contains it

**Method 2: Check Translation File**
1. Open `src/contexts/LanguageContext.tsx`
2. Press `Ctrl+F` and search for the text
3. If found, it's a translation key - edit the value

**Method 3: Check Component Files**
- If text is hardcoded, it's in the component file
- Search for the text in `src/components/` or `src/pages/`

### Complete File Path Checklist

### 📄 All Page Files

| Page | Full File Path | What It Contains |
|------|---------------|------------------|
| **Homepage** | `src/pages/Index.tsx` | Main landing page with hero, latest arrivals, testimonials |
| **Listings** | `src/pages/Listings.tsx` | All vehicles listing with filters and search |
| **Vehicle Detail** | `src/pages/VehicleDetail.tsx` | Individual vehicle page with specs and gallery |
| **Valuation** | `src/pages/Valutiamo.tsx` | Car valuation request form |
| **Contact** | `src/pages/Contatti.tsx` | Contact information and contact form |
| **Blog** | `src/pages/Blog.tsx` | Blog posts page |
| **FAQ** | `src/pages/FAQ.tsx` | Frequently asked questions |
| **Admin** | `src/pages/Admin.tsx` | Admin dashboard (requires login) |
| **Customer Area** | `src/pages/CustomerArea.tsx` | User account area |
| **Auth** | `src/pages/Auth.tsx` | Login/Register page |
| **Privacy Policy** | `src/pages/PrivacyPolicy.tsx` | Privacy policy page |
| **Cookie Policy** | `src/pages/CookiePolicy.tsx` | Cookie policy page |
| **Terms & Conditions** | `src/pages/TermsConditions.tsx` | Terms and conditions page |
| **Track Request** | `src/pages/TrackRequest.tsx` | Track valuation request status |
| **404 Not Found** | `src/pages/NotFound.tsx` | 404 error page |

### 🧩 Component Files

| Component | Full File Path | What It Does |
|-----------|---------------|--------------|
| **Header** | `src/components/Header.tsx` | Main navigation bar |
| **Footer** | `src/components/home/Footer.tsx` | Footer with links and info |
| **Vehicle Card** | `src/components/VehicleCard.tsx` | Individual vehicle card display |
| **Vehicle Grid** | `src/components/VehicleGrid.tsx` | Grid layout for vehicles |
| **Search Filters** | `src/components/SearchFilters.tsx` | All search and filter options |
| **Vehicle Specs** | `src/components/VehicleSpecs.tsx` | Vehicle specifications display |
| **Image Gallery** | `src/components/ImageGallery.tsx` | Vehicle photo gallery |
| **Financing Calculator** | `src/components/FinancingCalculator.tsx` | Monthly payment calculator |
| **SEO Component** | `src/components/SEO.tsx` | SEO meta tags component |
| **Cookie Consent** | `src/components/CookieConsent.tsx` | Cookie consent banner |
| **Hero Section** | `src/components/home/HeroSection.tsx` | Homepage hero banner |
| **Latest Arrivals** | `src/components/home/LatestArrivals.tsx` | Latest vehicles section |
| **Testimonials** | `src/components/home/TestimonialsSection.tsx` | Customer testimonials |
| **Services** | `src/components/home/ServicesSection.tsx` | Services offered section |
| **Trust Section** | `src/components/home/TrustSection.tsx` | Trust indicators |
| **WhatsApp Button** | `src/components/WhatsAppButton.tsx` | Floating WhatsApp button |

### ⚙️ Configuration Files

| File | Full Path | What It Controls |
|------|-----------|------------------|
| **App Routes** | `src/App.tsx` | All page routes and navigation |
| **Translations** | `src/contexts/LanguageContext.tsx` | All website text (Italian/English) |
| **Tailwind Config** | `tailwind.config.ts` | Colors, fonts, styling |
| **Vite Config** | `vite.config.ts` | Build configuration |
| **Package Info** | `package.json` | Dependencies and scripts |
| **TypeScript Config** | `tsconfig.json` | TypeScript settings |

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Check for errors
npm run lint
```

### Useful Keyboard Shortcuts

- **Ctrl+F / Cmd+F** - Search in file
- **Ctrl+Shift+F / Cmd+Shift+F** - Search in all files
- **Ctrl+S / Cmd+S** - Save file
- **F12** - Open browser developer tools
- **Ctrl+Shift+R / Cmd+Shift+R** - Hard refresh browser

---

## 20. SEO Optimizations - Complete Guide

### What SEO Features Are Included?

This project includes **comprehensive SEO optimization** with:

1. ✅ **Meta Tags** - Title, description, keywords for each page
2. ✅ **Open Graph Tags** - For Facebook/LinkedIn sharing
3. ✅ **Twitter Cards** - For Twitter sharing
4. ✅ **Schema.org Structured Data** - Rich snippets for search engines
5. ✅ **XML Sitemap** - Auto-generated with all pages and vehicles
6. ✅ **Robots.txt** - Search engine crawling instructions
7. ✅ **Canonical URLs** - Prevent duplicate content
8. ✅ **Google Analytics** - Track website performance

---

### 📄 SEO Component (`src/components/SEO.tsx`)

**What it does:**
- Adds meta tags to every page
- Sets up Open Graph for social sharing
- Configures Twitter Cards
- Adds canonical URLs

**Current Default Values (lines 15-18):**
```typescript
const defaultTitle = "AutoMarket - Trova la tua Auto Perfetta";
const defaultDescription = "Vendita di auto usate selezionate e garantite...";
const defaultImage = "/placeholder.svg";
const siteUrl = import.meta.env.VITE_SITE_URL || "https://automarket.it";
```

#### How to Optimize Default SEO:

**Step 1: Change Default Title**
```typescript
// Line 15
const defaultTitle = "Your Dealership Name - Find Your Perfect Car";
```

**Step 2: Change Default Description**
```typescript
// Line 16
const defaultDescription = "Your compelling description here. Include keywords naturally.";
```

**Step 3: Change Default Image**
```typescript
// Line 17
const defaultImage = "/your-logo.png";  // Use your actual logo/image
```

**Step 4: Change Site URL**
```typescript
// Line 18
const siteUrl = import.meta.env.VITE_SITE_URL || "https://yourdomain.com";
```

**Step 5: Update Site Name in Meta Tags**
```typescript
// Line 30 - Change "AutoMarket" to your site name
const fullTitle = title ? `${title} | YourSiteName` : defaultTitle;

// Line 48 - Author name
<meta name="author" content="YourSiteName" />

// Line 63 - Open Graph site name
<meta property="og:site_name" content="YourSiteName" />

// Line 78 - Application name
<meta name="application-name" content="YourSiteName" />
```

#### SEO Properties Available:

```typescript
<SEO
  title="Page Title"                    // Browser tab title
  description="Page description"        // Meta description (155 chars max)
  keywords="keyword1, keyword2"         // Keywords for SEO
  image="/image.jpg"                    // Social sharing image
  url="/page-url"                       // Page URL
  type="website"                        // Content type (website, article, etc.)
  noindex={false}                       // Hide from search engines if true
  canonical="/page-url"                 // Canonical URL (optional)
/>
```

#### Best Practices for SEO:

1. **Title Tags:**
   - Keep under 60 characters
   - Include main keyword
   - Make it compelling
   - Format: "Keyword - Brand Name"

2. **Meta Descriptions:**
   - Keep under 155 characters
   - Include call-to-action
   - Include main keyword naturally
   - Make it compelling to click

3. **Keywords:**
   - Use 5-10 relevant keywords
   - Separate with commas
   - Include location if local business
   - Example: "auto usate Roma, vendita auto, concessionaria Roma"

---

### 📊 Schema.org Structured Data (`src/components/SchemaOrg.tsx`)

**What it does:**
- Adds structured data for rich snippets
- Helps Google understand your content
- Can show enhanced search results

#### Available Schema Types:

1. **Organization Schema** - Your business info
2. **WebSite Schema** - Site-wide search functionality
3. **Product Schema** - Individual vehicle details
4. **ItemList Schema** - Vehicle listings page
5. **BreadcrumbList Schema** - Navigation breadcrumbs
6. **FAQPage Schema** - FAQ pages

#### How to Optimize Organization Schema:

**File:** `src/components/SchemaOrg.tsx` (lines 30-56)

**Current Values:**
```typescript
name: "AutoAndrew",
url: siteUrl,
logo: `${siteUrl}/placeholder.svg`,
description: "Concessionaria auto usate in Italia...",
```

**To Update:**
```typescript
// Line 37 - Change business name
name: "Your Business Name",

// Line 39 - Change logo
logo: `${siteUrl}/your-logo.png`,

// Line 40 - Update description
description: "Your business description with keywords",

// Lines 41-44 - Update address
address: {
  "@type": "PostalAddress",
  streetAddress: "Your Street Address",
  addressLocality: "Your City",
  addressRegion: "Your Region",
  postalCode: "Your Postal Code",
  addressCountry: "IT",
},

// Lines 50-52 - Add social media links
sameAs: [
  "https://www.facebook.com/yourpage",
  "https://www.instagram.com/yourpage",
  "https://www.linkedin.com/company/yourcompany",
],
```

#### How to Optimize Product Schema (Vehicles):

**File:** `src/components/SchemaOrg.tsx` (lines 86-192)

**Already Optimized For:**
- Vehicle name, description, images
- Price and currency
- Brand and model
- Year, mileage, fuel type
- Power, transmission
- Availability status

**To Customize:**
- Edit the schema data structure (lines 119-146)
- Add more vehicle properties if needed
- Adjust price validity period (line 134)

---

### 🗺️ XML Sitemap (`api/sitemap.xml.ts`)

**What it does:**
- Generates XML sitemap automatically
- Includes all static pages
- Includes all vehicle pages dynamically
- Updates automatically when vehicles change

**File Location:** `api/sitemap.xml.ts`

**URL:** `https://yourdomain.com/sitemap.xml`

#### How to Optimize Sitemap:

**Step 1: Update Site URL**
```typescript
// Line 27
const siteUrl = process.env.VITE_SITE_URL || 'https://yourdomain.com';
```

**Step 2: Adjust Priorities (lines 4-14)**
```typescript
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },        // Homepage - highest priority
  { path: '/listings', priority: 0.9, changefreq: 'daily' }, // Listings - very high
  { path: '/valutiamo', priority: 0.8, changefreq: 'weekly' },
  { path: '/contatti', priority: 0.7, changefreq: 'monthly' },
  // ... adjust as needed
];
```

**Priority Guidelines:**
- `1.0` - Homepage (most important)
- `0.9` - Main category pages
- `0.8` - Important pages
- `0.7` - Secondary pages
- `0.6` - Less important pages
- `0.3` - Legal pages (privacy, terms)

**Change Frequency:**
- `daily` - Pages that change daily
- `weekly` - Pages that change weekly
- `monthly` - Pages that change monthly
- `yearly` - Pages that rarely change

**Step 3: Vehicle Page Settings (lines 68-72)**
```typescript
const vehicleRoutes = vehicles.map((vehicle) => ({
  path: `/vehicle/${vehicle.ad_number}`,
  priority: 0.8,        // Adjust if needed
  changefreq: 'weekly', // How often vehicles are updated
}));
```

#### Submit Sitemap to Google:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (website)
3. Go to "Sitemaps" section
4. Add: `https://yourdomain.com/sitemap.xml`
5. Submit

---

### 🤖 Robots.txt (`public/robots.txt`)

**What it does:**
- Tells search engines what to crawl
- Controls access to your site

**File Location:** `public/robots.txt`

**Current Content:**
```
User-agent: *
Allow: /

Sitemap: https://automarket.it/sitemap.xml
```

#### How to Optimize Robots.txt:

**Step 1: Update Sitemap URL**
```
Sitemap: https://yourdomain.com/sitemap.xml
```

**Step 2: Block Pages You Don't Want Indexed (if needed)**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
```

**Step 3: Allow Specific Bots (already done)**
```
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

---

### 📈 Google Analytics (`src/components/GoogleAnalytics.tsx`)

**What it does:**
- Tracks website visitors
- Measures page views
- Tracks user behavior

**File Location:** `src/components/GoogleAnalytics.tsx`

#### How to Set Up Google Analytics:

**Method 1: Environment Variable (Recommended)**

1. Get your Google Analytics Measurement ID (format: `G-XXXXXXXXXX`)
2. Add to `.env` file:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Method 2: Backend Config (Edge Function)**

1. Create/update Edge Function `public-config`
2. Return `gaMeasurementId` in response
3. It will be cached in localStorage

**Method 3: localStorage (Development)**

1. Open browser console
2. Run: `localStorage.setItem('ga_measurement_id', 'G-XXXXXXXXXX')`
3. Refresh page

#### Verify Analytics is Working:

1. Open browser console (F12)
2. Check for Google Analytics script loaded
3. Visit [Google Analytics Real-Time](https://analytics.google.com)
4. Check if your visit appears

---

### 🎯 SEO Best Practices Checklist

#### ✅ On-Page SEO:

- [ ] **Title Tags:** Unique, descriptive, under 60 chars
- [ ] **Meta Descriptions:** Compelling, under 155 chars, include CTA
- [ ] **Keywords:** Relevant, natural, include location
- [ ] **Headings:** Use H1, H2, H3 properly (H1 only once per page)
- [ ] **Images:** Alt text for all images
- [ ] **URLs:** Clean, descriptive URLs
- [ ] **Internal Links:** Link to related pages
- [ ] **Mobile Friendly:** Responsive design (already done)

#### ✅ Technical SEO:

- [ ] **Sitemap:** Submitted to Google Search Console
- [ ] **Robots.txt:** Configured correctly
- [ ] **Canonical URLs:** Set to prevent duplicates
- [ ] **Page Speed:** Fast loading (check with PageSpeed Insights)
- [ ] **HTTPS:** Secure connection (required for production)
- [ ] **Structured Data:** Schema.org markup (already implemented)

#### ✅ Content SEO:

- [ ] **Quality Content:** Original, valuable content
- [ ] **Keyword Research:** Target relevant keywords
- [ ] **Content Length:** Sufficient content on each page
- [ ] **Fresh Content:** Regular updates (vehicles, blog)
- [ ] **Local SEO:** Include location if local business

#### ✅ Off-Page SEO:

- [ ] **Backlinks:** Get links from other websites
- [ ] **Social Media:** Share on social platforms
- [ ] **Google Business Profile:** Set up if local business
- [ ] **Reviews:** Encourage customer reviews

---

### 🔧 Quick SEO Fixes

#### Fix 1: Update All Site Names

**Files to Edit:**
1. `src/components/SEO.tsx` - Lines 15, 30, 48, 63, 78
2. `src/components/SchemaOrg.tsx` - Lines 37, 68
3. `api/sitemap.xml.ts` - Line 27
4. `public/robots.txt` - Last line

**Search and Replace:**
- "AutoMarket" → "YourSiteName"
- "AutoAndrew" → "YourSiteName"
- "automarket.it" → "yourdomain.com"

#### Fix 2: Add Missing Alt Text

**Check all images:**
- Vehicle images should have descriptive alt text
- Logo should have alt text
- Icons can have empty alt if decorative

#### Fix 3: Optimize Page Titles

**For each page, ensure:**
- Unique title
- Includes main keyword
- Under 60 characters
- Compelling and clickable

#### Fix 4: Improve Meta Descriptions

**For each page:**
- Write compelling description
- Include call-to-action
- Under 155 characters
- Include main keyword naturally

---

### 📱 Social Media Optimization

#### Open Graph Tags (Already Implemented)

**What it does:**
- Controls how your site appears when shared on Facebook/LinkedIn

**Optimize:**
- Use high-quality images (1200x630px recommended)
- Write compelling titles
- Include descriptions

#### Twitter Cards (Already Implemented)

**What it does:**
- Controls how your site appears when shared on Twitter

**Optimize:**
- Use images (1200x675px recommended)
- Keep titles short
- Include descriptions

---

### 🚀 Advanced SEO Optimizations

#### 1. Add hreflang Tags (Multi-language)

If you have multiple languages, add hreflang tags:

```tsx
<link rel="alternate" hreflang="it" href="https://yourdomain.com/it/page" />
<link rel="alternate" hreflang="en" href="https://yourdomain.com/en/page" />
```

#### 2. Add JSON-LD for Reviews

Add review schema if you have customer reviews:

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Customer Name"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5"
  }
}
```

#### 3. Optimize Images

- Use WebP format when possible
- Compress images
- Add descriptive filenames
- Add alt text

#### 4. Add FAQ Schema

Already implemented in `SchemaOrg.tsx` (lines 255-273)

Use on FAQ page:
```tsx
<FAQPageSchema faqs={faqData} />
```

---

### 📊 SEO Monitoring Tools

**Free Tools:**
1. **Google Search Console** - Monitor search performance
2. **Google Analytics** - Track visitors
3. **PageSpeed Insights** - Check page speed
4. **Google Rich Results Test** - Test structured data
5. **Mobile-Friendly Test** - Check mobile optimization

**How to Use:**
1. Set up Google Search Console
2. Submit sitemap
3. Monitor performance weekly
4. Fix issues as they appear

---

## ⚙️ Complete Function & Feature Guides

**File Location:** `src/lib/api/vehicles.ts`

#### What It Does:
- Fetches vehicles from Multigestionale API via Supabase Edge Function
- Handles errors gracefully
- Returns formatted vehicle data

#### Current Implementation:

**Main Function: `fetchVehicles()`**
```typescript
// Lines 22-52
export async function fetchVehicles(options: FetchVehiclesOptions = {}): Promise<FetchVehiclesResponse>
```

**Available Options:**
- `engine` - Filter by engine type
- `make` - Filter by brand
- `model` - Filter by model
- `vehicle_class` - Filter by class (new/used)
- `category` - Filter by category
- `limit` - Maximum number of vehicles to return
- `sort` - Sort field (e.g., "first_registration_date")
- `invert` - Sort direction ("1" for descending)

#### How to Modify:

**1. Change Default Limit:**
```typescript
// In pages using fetchVehicles, change:
const response = await fetchVehicles({ limit: 200 }); // Change 200 to your desired number
```

**2. Add New Filter Options:**
```typescript
// Step 1: Add to interface (line 4-13)
interface FetchVehiclesOptions {
  // ... existing options ...
  yourNewFilter?: string;
}

// Step 2: Pass to Edge Function (already done - it passes all options)
```

**3. Change Error Handling:**
```typescript
// Lines 30-32 - Modify error messages
if (error) {
  console.error("Error invoking fetch-vehicles:", error);
  return { 
    success: false, 
    data: [], 
    count: 0, 
    error: "Your custom error message" // Change here
  };
}
```

**4. Modify Response Format:**
```typescript
// Lines 37-42 - Change how data is returned
return {
  success: !!payload.success,
  data: payload.data ?? [],
  count: payload.count ?? (payload.data?.length ?? 0),
  error: payload.error,
  // Add custom fields here
};
```

#### Usage Examples:

**Fetch All Vehicles:**
```typescript
const response = await fetchVehicles({ limit: 1000 });
```

**Fetch by Make:**
```typescript
const response = await fetchVehicles({ make: "Toyota", limit: 50 });
```

**Fetch Sorted by Price:**
```typescript
const response = await fetchVehicles({ sort: "price", invert: "1" });
```

---

## 9. Saved Vehicles / Favorites System

**File Location:** `src/lib/api/savedVehicles.ts`

#### What It Does:
- Allows users to save vehicles to favorites
- Stores favorites in Supabase database
- Requires user authentication

#### Functions Available:

**1. `saveVehicle(vehicle)` - Save a vehicle**
- **File:** `src/lib/api/savedVehicles.ts` (lines 5-50)
- **What it does:** Adds vehicle to user's favorites
- **Returns:** `boolean` (true if successful)

**2. `unsaveVehicle(vehicle)` - Remove from favorites**
- **File:** `src/lib/api/savedVehicles.ts` (lines 52-83)
- **What it does:** Removes vehicle from favorites
- **Returns:** `boolean` (true if successful)

**3. `isVehicleSaved(vehicle)` - Check if saved**
- **File:** `src/lib/api/savedVehicles.ts` (lines 85-110)
- **What it does:** Checks if vehicle is in user's favorites
- **Returns:** `boolean`

#### How to Modify:

**1. Change Toast Messages:**

**Save Success (line 36-39):**
```typescript
toast({
  title: "Your Custom Title",
  description: "Your custom description",
});
```

**Save Error (line 43-47):**
```typescript
toast({
  title: "Your Error Title",
  description: "Your error message",
  variant: "destructive",
});
```

**2. Change Login Required Message (line 10-14):**
```typescript
toast({
  description: "Your custom login required message",
  variant: "destructive",
});
```

**3. Modify Database Table:**
- The functions use `saved_vehicles` table
- To change table name, update all `.from("saved_vehicles")` calls

**4. Add Custom Fields:**
```typescript
// In saveVehicle function, add to insert (line 19-22):
.insert({
  user_id: user.id,
  vehicle_data: vehicle as unknown as Record<string, unknown>,
  your_custom_field: "value", // Add here
});
```

#### Usage Example:

```typescript
import { saveVehicle, unsaveVehicle, isVehicleSaved } from "@/lib/api/savedVehicles";

// Save a vehicle
const success = await saveVehicle(vehicle);

// Remove from favorites
const removed = await unsaveVehicle(vehicle);

// Check if saved
const saved = await isVehicleSaved(vehicle);
```

---

## 10. Analytics & Tracking System

**File Location:** `src/lib/analytics.ts`

#### What It Does:
- Tracks user interactions with Google Analytics
- Records page views, events, and conversions
- Provides detailed tracking functions

#### Available Tracking Functions:

**1. `trackPageView(path, title?)` - Track page views**
- **Lines:** 43-53
- **Usage:** Automatically called by PageTracker component

**2. `trackEvent(action, category, label?, value?)` - Track custom events**
- **Lines:** 58-74
- **Usage:** Track any custom event

**3. `trackVehicleView(vehicleId, vehicleName)` - Track vehicle views**
- **Lines:** 79-82
- **Usage:** Called when user views a vehicle

**4. `trackSearch(searchTerm, resultsCount)` - Track searches**
- **Lines:** 87-89
- **Usage:** Track search queries

**5. `trackFilter(filterName, filterValue)` - Track filter usage**
- **Lines:** 94-96
- **Usage:** Track which filters users use

**6. `trackContactForm(formType)` - Track form submissions**
- **Lines:** 101-103
- **Usage:** Track contact/valuation form submissions

**7. `trackWhatsAppClick(context?)` - Track WhatsApp clicks**
- **Lines:** 108-110
- **Usage:** Track WhatsApp button clicks

**8. `trackSaveVehicle(vehicleId, action)` - Track save/unsave**
- **Lines:** 115-117
- **Usage:** Track favorite actions

**9. `trackShare(method, contentType)` - Track sharing**
- **Lines:** 122-124
- **Usage:** Track social sharing

#### How to Modify:

**1. Add New Tracking Function:**
```typescript
// Add after line 124
export const trackYourEvent = (param1: string, param2: number) => {
  trackEvent("your_action", "your_category", param1, param2);
};
```

**2. Change Event Categories:**
```typescript
// Modify category names in each function
trackEvent("action", "your_category", label, value);
```

**3. Add Custom Parameters:**
```typescript
// Modify trackEvent call to include custom parameters
window.gtag("event", action, {
  event_category: category,
  event_label: label,
  value: value,
  custom_parameter: "value", // Add custom parameters
});
```

**4. Disable Analytics:**
```typescript
// In each function, add early return:
if (process.env.NODE_ENV === 'development') {
  return; // Skip tracking in development
}
```

#### Usage Examples:

```typescript
import { trackEvent, trackVehicleView } from "@/lib/analytics";

// Track custom event
trackEvent("button_click", "navigation", "header_cta");

// Track vehicle view
trackVehicleView("12345", "Toyota Corolla");
```

---

## 11. Financing Calculator

**File Location:** `src/components/FinancingCalculator.tsx`

#### What It Does:
- Calculates monthly payments for vehicle financing
- Allows customization of down payment, duration, and interest rate
- Shows total financed amount and total interest

#### Current Defaults:

**Line 20:** Default vehicle price: `20000`
**Line 23:** Default down payment: `20%` of price
**Line 24:** Default duration: `48 months`
**Line 25:** Default interest rate: `5.9%`

#### How to Modify:

**1. Change Default Values:**

**Default Price (line 20):**
```typescript
export function FinancingCalculator({ vehiclePrice = 25000 }: FinancingCalculatorProps) {
  // Change 20000 to your default
}
```

**Default Down Payment Percentage (line 23):**
```typescript
const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.3)); // Change 0.2 to 0.3 for 30%
```

**Default Duration (line 24):**
```typescript
const [months, setMonths] = useState(60); // Change 48 to 60 for 5 years
```

**Default Interest Rate (line 25):**
```typescript
const [interestRate, setInterestRate] = useState(4.9); // Change 5.9 to your rate
```

**2. Change Slider Ranges:**

**Down Payment Max (line 101):**
```typescript
max={price * 0.5} // Change 0.5 to 0.6 for 60% max
```

**Duration Range (lines 120-122):**
```typescript
max={84}  // Change max months
min={12}  // Change min months
step={12} // Change step (12 = yearly increments)
```

**Interest Rate Range (lines 139-141):**
```typescript
max={12}  // Change max interest rate
min={0}   // Change min interest rate
step={0.1} // Change step (0.1 = 0.1% increments)
```

**3. Modify Calculation Formula:**

**Monthly Payment Calculation (lines 39-41):**
```typescript
// Current formula uses standard loan calculation
// To change, modify lines 27-51
const monthlyPayment = 
  (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
  (Math.pow(1 + monthlyRate, months) - 1);
```

**4. Change Currency Format:**

**Format Function (lines 53-59):**
```typescript
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", { // Change "it-IT" to "en-US"
    style: "currency",
    currency: "USD", // Change "EUR" to "USD"
    maximumFractionDigits: 0,
  }).format(value);
};
```

**5. Add Additional Fields:**

**Add Insurance Field:**
```typescript
const [insurance, setInsurance] = useState(50); // Monthly insurance

// Add to calculation:
const totalMonthly = calculation.monthlyPayment + insurance;
```

**6. Change Disclaimer Text:**

**Line 167:** Edit translation key `"financing.disclaimer"` in `LanguageContext.tsx`

---

## 12. Vehicle Comparison System

**File Location:** `src/components/VehicleCompare.tsx`

#### What It Does:
- Allows users to compare up to 3 vehicles side-by-side
- Shows comparison table with specifications
- Floating bar for easy access

#### Current Limits:

**Maximum Vehicles:** 3 (line 70, 120, 233)

#### How to Modify:

**1. Change Maximum Comparison Count:**

**In Component (line 70):**
```typescript
{selectedVehicles.length < 5 && ( // Change 3 to 5
```

**In Hook (line 233):**
```typescript
if (selectedVehicles.length < 5 && !selectedVehicles.find(...)) { // Change 3 to 5
```

**In Display (line 120):**
```typescript
<span className="text-sm text-muted-foreground">
  {selectedVehicles.length}/5 {/* Change 3 to 5 */}
</span>
```

**2. Modify Comparison Specifications:**

**Specs Array (lines 158-170):**
```typescript
const specs = [
  { key: "price", label: "Prezzo", render: (v: Vehicle) => formatPrice(v.price) },
  // Add new spec:
  { key: "warranty", label: "Garanzia", render: (v: Vehicle) => v.warranty || "N/D" },
  // Remove spec: Delete the object from array
];
```

**3. Change Comparison Table Layout:**

**Grid Template (line 175):**
```typescript
// Current: 200px for labels, rest for vehicles
style={{ gridTemplateColumns: `200px repeat(${vehicles.length}, 1fr)` }}

// Change to fixed widths:
style={{ gridTemplateColumns: `250px repeat(${vehicles.length}, 200px)` }}
```

**4. Modify Floating Bar Position:**

**Line 46:** Change position
```typescript
// Current: bottom-20 (80px from bottom)
className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"

// Change to:
className="fixed top-20 right-4 z-40" // Top right corner
```

**5. Customize Comparison Display:**

**Add Icons (lines 204-207):**
```typescript
// Add more icons for specs
{spec.key === "warranty" && <Shield className="w-4 h-4" />}
```

**Change Styling (lines 198-199):**
```typescript
className={cn(
  "grid gap-4 py-3 px-4 rounded-lg",
  index % 2 === 0 ? "bg-secondary/50" : "bg-primary/5" // Change colors
)}
```

#### Usage:

**In Listings Page:**
```typescript
import { VehicleCompare, useVehicleCompare } from "@/components/VehicleCompare";

const { selectedVehicles, addVehicle, removeVehicle, clearAll } = useVehicleCompare();

<VehicleCompare
  vehicles={allVehicles}
  selectedVehicles={selectedVehicles}
  onAddVehicle={addVehicle}
  onRemoveVehicle={removeVehicle}
  onClear={clearAll}
/>
```

---

## 13. Messaging System

**File Location:** `src/features/messages/hooks/useMessages.ts`

#### What It Does:
- Real-time messaging between customers and admin
- File attachments support
- Thread-based conversations
- Read/unread status

#### Key Functions:

**1. `useMessages(requestId)` - Main hook**
- **Lines:** 8-300
- **Returns:** Messages, loading state, send function

**2. `sendMessage({ body, files? })` - Send message**
- **Lines:** 137-217
- **Supports:** Text and file attachments

**3. `markAsRead()` - Mark thread as read**
- **Lines:** 220-232
- **Updates:** Read status in database

#### How to Modify:

**1. Change File Upload Limits:**

**File Size Limit (add validation):**
```typescript
// In uploadFiles function (line 40), add:
if (file.size > 10 * 1024 * 1024) { // 10MB limit
  throw new Error(`File ${file.name} exceeds 10MB limit`);
}
```

**File Type Restrictions:**
```typescript
// Add after line 43:
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
if (!allowedTypes.includes(file.type)) {
  throw new Error(`File type ${file.type} not allowed`);
}
```

**2. Change Storage Path:**

**Line 47:** Modify file path structure
```typescript
const filePath = `request/${requestId}/${timestamp}-${sanitizedFileName}`;
// Change to:
const filePath = `messages/${requestId}/${userId}/${timestamp}-${sanitizedFileName}`;
```

**3. Modify Error Messages:**

**Upload Errors (lines 60-78):**
```typescript
// Customize error messages
if (errorMsg.includes('bucket not found')) {
  errorMessage = 'Your custom storage error message';
}
```

**4. Change Signed URL Expiry:**

**Line 88:** Modify expiry time
```typescript
.createSignedUrl(filePath, 60 * 60 * 24 * 7); // Change 24 hours to 7 days
```

**5. Add Message Validation:**

**Before sending (add after line 164):**
```typescript
if (body.trim().length < 3) {
  throw new Error("Message must be at least 3 characters");
}

if (body.trim().length > 1000) {
  throw new Error("Message cannot exceed 1000 characters");
}
```

**6. Modify Real-time Subscription:**

**Channel Name (line 239):**
```typescript
.channel(`messages-${requestId}`) // Change channel naming
```

**Event Filter (lines 242-246):**
```typescript
// Add additional filters
filter: `request_id=eq.${requestId} AND sender_type=eq.user`,
```

#### Usage Example:

```typescript
import { useMessages } from "@/features/messages/hooks/useMessages";

const { messages, sendMessage, isSending, markAsRead } = useMessages(requestId);

// Send text message
sendMessage({ body: "Hello!" });

// Send with files
const files = [file1, file2];
sendMessage({ body: "Check these files", files });

// Mark as read
markAsRead();
```

---

## 14. Real-time Notifications System

**File Location:** `src/hooks/useRealtimeNotifications.ts`

#### What It Does:
- Real-time notifications for new messages
- Notifications for request status changes
- Unread count tracking
- Browser notifications with sound

#### How to Modify:

**1. Change Notification Sound:**

**Line 31:** Replace audio data
```typescript
// Current: Base64 encoded WAV
const audio = new Audio("data:audio/wav;base64,...");

// Change to external file:
const audio = new Audio("/sounds/notification.mp3");
```

**2. Modify Notification Messages:**

**New Message (lines 69-72):**
```typescript
showNotification(
  "Your Custom Title",
  "Your custom message"
);
```

**Status Change (lines 136-141):**
```typescript
// Customize status labels
const statusLabels: Record<string, string> = {
  pending: "In attesa",
  contacted: "Contattato",
  // Add more statuses
};
```

**3. Change Unread Count Behavior:**

**Line 22:** Modify initial state
```typescript
const [unreadCount, setUnreadCount] = useState(0); // Start at 0
```

**Increment Logic (lines 73, 96, 153, 179):**
```typescript
setUnreadCount(prev => prev + 1); // Add 1 for each notification
```

**4. Add Notification Types:**

**Add Email Notifications:**
```typescript
// After showNotification call, add:
if (userEmail) {
  // Send email notification
  fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({ to: userEmail, subject, message })
  });
}
```

**5. Modify Subscription Filters:**

**Messages Filter (lines 42-48):**
```typescript
// Add additional filters
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'valuation_messages',
  filter: 'sender_type=eq.user', // Add filter
}, ...)
```

**6. Change Notification Display:**

**Toast Options (lines 24-28):**
```typescript
toast({
  title,
  description,
  duration: 5000, // Add duration
  action: <Button>View</Button>, // Add action button
});
```

#### Usage Example:

```typescript
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const { unreadCount, clearUnread } = useRealtimeNotifications({
  isAdmin: true,
  userId: user?.id,
  userEmail: user?.email,
  onNewMessage: (message) => {
    // Handle new message
  },
  onRequestUpdate: (request) => {
    // Handle request update
  },
});
```

---

## 15. Forms System (Contact & Valuation)

#### Contact Form

**File Location:** `src/pages/Contatti.tsx`

**Form Schema (lines 23-29):**
```typescript
const contactSchema = z.object({
  name: z.string().min(2, "Message"),
  email: z.string().email("Message"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Message"),
  message: z.string().min(10, "Message")
});
```

#### How to Modify Contact Form:

**1. Add New Fields:**
```typescript
// Add to schema:
company: z.string().optional(),

// Add to form:
<FormField 
  control={form.control} 
  name="company" 
  render={({ field }) => (
    <FormItem>
      <FormLabel>Company</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )} 
/>
```

**2. Change Validation Rules:**
```typescript
name: z.string().min(3, "Must be at least 3 characters"), // Change min
message: z.string().min(20, "Must be at least 20 characters"), // Change min
```

**3. Modify Form Submission:**
```typescript
// Line 44-54: Add custom logic
const onSubmit = async (data: ContactFormData) => {
  // Add email sending
  await sendEmail(data);
  
  // Add to database
  await saveToDatabase(data);
  
  // Show success
  toast({ title: "Sent!", description: "We'll reply soon." });
};
```

#### Valuation Form

**File Location:** `src/pages/Valutiamo.tsx`

**Similar modifications apply:**
- Add/remove fields in schema
- Change validation rules
- Modify submission handler
- Customize form layout

---

## 16. Authentication System

**File Location:** `src/pages/Auth.tsx`

#### What It Does:
- User registration
- User login
- Password reset
- Email verification

#### How to Modify:

**1. Change Registration Fields:**
- Add fields to registration form
- Modify validation schema
- Update Supabase auth settings

**2. Modify Password Requirements:**
- Change in Supabase Dashboard → Authentication → Policies
- Or add client-side validation

**3. Change Auth Messages:**
- Edit toast messages in Auth.tsx
- Customize error handling

---

## 17. Image Handling System

#### Lazy Loading

**File Location:** `src/components/LazyImage.tsx`

**How to Modify:**
- Change placeholder image
- Modify loading behavior
- Adjust aspect ratios

#### Image Gallery

**File Location:** `src/components/ImageGallery.tsx`

**How to Modify:**
- Change gallery layout
- Modify zoom behavior
- Add/remove features

---

## 18. Sorting & Filtering System

**Already covered in [Section 21: How to Add/Remove Search Filters](#21-how-to-addremove-search-filters).**

---

## 19. Pagination System

**File Location:** `src/pages/Listings.tsx`

**Current:** 16 items per page (line 27)

**How to Modify:**
```typescript
// Line 27
const ITEMS_PER_PAGE = 24; // Change from 16 to 24
```

**Pagination Component:**
- Uses shadcn/ui Pagination component
- Customizable in Listings.tsx (lines 424-456)

---

## 21. How to Add/Remove Search Filters

**File Location:** `src/components/SearchFilters.tsx`

#### Current Filters Available:
1. **Main Filters (Always Visible):**
   - Make (Brand)
   - Model
   - Year From
   - Price Min
   - Price Max
   - Power Min
   - Power Max
   - Mileage Max
   - Color

2. **Advanced Filters (Collapsible):**
   - Fuel Type
   - Gearbox
   - Condition
   - Emissions Class
   - Doors

#### To ADD a New Filter:

**Step 1:** Add filter to FilterState interface (around line 16-32):
```typescript
export interface FilterState {
  // ... existing filters ...
  yourNewFilter: string;  // Add your new filter here
}
```

**Step 2:** Add to defaultFilters (around line 34-50):
```typescript
const defaultFilters: FilterState = {
  // ... existing filters ...
  yourNewFilter: "",  // Add default value
};
```

**Step 3:** Add filter UI in the component (around line 213-360):
```tsx
{/* Your New Filter */}
<Select 
  value={filters.yourNewFilter || undefined} 
  onValueChange={value => handleFilterChange("yourNewFilter", value === "_clear" ? "" : value)}
>
  <SelectTrigger className="w-full bg-card">
    <SelectValue placeholder="Your Filter Label" />
  </SelectTrigger>
  <SelectContent className="bg-popover z-50">
    <SelectItem value="_clear" className="text-muted-foreground">
      Remove Filter
    </SelectItem>
    {/* Add your options here */}
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Step 4:** Add filter logic in `src/pages/Listings.tsx` (around line 99-212):
```typescript
// In the filteredVehicles useMemo function
if (activeFilters.yourNewFilter) {
  result = result.filter((v) => 
    v.yourField === activeFilters.yourNewFilter
  );
}
```

#### To REMOVE a Filter:

1. Remove from `FilterState` interface
2. Remove from `defaultFilters`
3. Remove the Select component from JSX
4. Remove filter logic from `Listings.tsx`

**Example:** To remove the "Color" filter:
- Delete lines 337-350 in `SearchFilters.tsx`
- Remove `color: ""` from FilterState and defaultFilters
- Remove color filter logic from `Listings.tsx` (lines 175-180)

---

## 22. How to Edit SEO (Search Engine Optimization)

**File Location:** `src/components/SEO.tsx`

#### Understanding SEO Component:

The SEO component adds meta tags to each page for search engines.

**Default Values (lines 15-18):**
```typescript
const defaultTitle = "AutoMarket - Trova la tua Auto Perfetta";
const defaultDescription = "Vendita di auto usate selezionate...";
const defaultImage = "/placeholder.svg";
const siteUrl = import.meta.env.VITE_SITE_URL || "https://automarket.it";
```

#### How to Change Default SEO:

**Step 1:** Edit default values in `src/components/SEO.tsx`:
```typescript
// Line 15 - Change default title
const defaultTitle = "Your New Title";

// Line 16 - Change default description
const defaultDescription = "Your new description";

// Line 17 - Change default image
const defaultImage = "/your-image.jpg";

// Line 18 - Change site URL
const siteUrl = import.meta.env.VITE_SITE_URL || "https://yoursite.com";
```

**Step 2:** Change site name in meta tags (line 30, 48, 63, 78):
```typescript
// Replace "AutoMarket" with your site name
const fullTitle = title ? `${title} | YourSiteName` : defaultTitle;
```

#### How to Set SEO for Each Page:

**Example - Homepage (`src/pages/Index.tsx`):**
```tsx
<SEO
  title="Your Page Title"
  description="Your page description for search engines"
  keywords="keyword1, keyword2, keyword3"
  url="/"
/>
```

**Example - Vehicle Detail Page:**
```tsx
<SEO
  title={`${vehicle.make} ${vehicle.model} - ${vehicle.price}€`}
  description={`${vehicle.make} ${vehicle.model} usata, ${vehicle.year}...`}
  keywords={`${vehicle.make}, ${vehicle.model}, auto usata`}
  url={`/vehicle/${vehicle.ad_number}`}
  image={vehicle.images[0]}  // Use vehicle image
/>
```

#### SEO Properties Available:

- `title` - Page title (shown in browser tab)
- `description` - Meta description (shown in search results)
- `keywords` - Keywords for search engines
- `image` - Image for social media sharing
- `url` - Page URL
- `type` - Content type (default: "website")
- `noindex` - Set to `true` to hide from search engines

---

## 23. How to Add/Remove Vehicle Card Information

**File Location:** `src/components/VehicleCard.tsx`

#### Current Card Information Displayed:

**In the Card (lines 163-169):**
- Registration Date (`first_registration_date`)
- Mileage (`mileage`)
- Fuel Type (`fuel_type`)
- Gearbox (`gearbox`)

#### To ADD Information to Card:

**Step 1:** Find the specs grid (around line 164):
```tsx
<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
  <span>{vehicle.first_registration_date}</span>
  <span>{vehicle.mileage} km</span>
  <span>{vehicle.fuel_type}</span>
  <span>{vehicle.gearbox?.split(" ")[0]}</span>
  {/* ADD YOUR NEW FIELD HERE */}
  <span>{vehicle.yourField}</span>
</div>
```

**Example - Add Color:**
```tsx
<span>{vehicle.color}</span>
```

**Example - Add Power:**
```tsx
<span>{vehicle.power_cv} CV</span>
```

#### To REMOVE Information from Card:

Simply delete the `<span>` line for that field.

**Example - Remove Gearbox:**
```tsx
// DELETE this line:
<span>{vehicle.gearbox?.split(" ")[0]}</span>
```

#### To Change Card Layout:

**Change grid columns (line 164):**
```tsx
// 2 columns (current)
<div className="grid grid-cols-2 ...">

// 3 columns
<div className="grid grid-cols-3 ...">

// 4 columns
<div className="grid grid-cols-4 ...">
```

---

## 24. How to Edit Vehicle Specifications (Detail Page)

**File Location:** `src/components/VehicleSpecs.tsx`

#### Current Specifications Displayed:

**Main Specs (lines 25-56):**
1. Mileage
2. Transmission
3. Year
4. Fuel
5. Power
6. Seller

**Additional Specs (lines 78-165):**
- Emissions Class
- Combined Consumption
- Warranty
- Number of Seats
- Owners Count
- Doors Count
- Weight

#### To ADD a New Specification:

**Step 1:** Add to main specs array (around line 25):
```typescript
const specs = [
  // ... existing specs ...
  {
    icon: YourIcon,  // Import from lucide-react
    label: t("specs.yourLabel"),
    value: vehicle.yourField,
  },
];
```

**Step 2:** Add translation in `src/contexts/LanguageContext.tsx`:
```typescript
"specs.yourLabel": "Your Label",
```

**Step 3:** If it's an additional spec, add after line 82:
```tsx
{vehicle.yourField && (
  <div className="spec-item flex-col items-start gap-1">
    <div className="flex items-center gap-2 text-muted-foreground">
      <YourIcon className="w-4 h-4" />
      <span className="text-xs">{t("specs.yourLabel")}</span>
    </div>
    <p className="font-medium text-foreground text-sm pl-6">
      {vehicle.yourField}
    </p>
  </div>
)}
```

#### To REMOVE a Specification:

**For main specs:** Delete the object from the `specs` array.

**For additional specs:** Delete the entire conditional block (lines 86-96 for emissions_class, etc.)

---

## 25. How to Change All Website Texts

**File Location:** `src/contexts/LanguageContext.tsx`

#### Understanding the Translation System:

All website text is stored in the `translations` object (starts around line 16).

**Structure:**
```typescript
const translations: Record<Language, Record<string, string>> = {
  it: {
    "nav.home": "Home",
    "nav.listings": "Annunci",
    // ... more translations
  },
  en: {
    "nav.home": "Home",
    "nav.listings": "Listings",
    // ... more translations
  },
};
```

#### How to Change Text:

**Step 1:** Find the translation key in the component:
```tsx
// In any component, you'll see:
{t("nav.home")}  // This uses the "nav.home" key
```

**Step 2:** Edit the value in `LanguageContext.tsx`:
```typescript
it: {
  "nav.home": "Casa",  // Change "Home" to "Casa"
},
en: {
  "nav.home": "Home Page",  // Change "Home" to "Home Page"
},
```

#### Common Translation Keys:

**Navigation (lines 19-28):**
- `"nav.home"` - Home link
- `"nav.listings"` - Listings link
- `"nav.valutiamo"` - Valuation link
- `"nav.contact"` - Contact link
- `"nav.blog"` - Blog link
- `"nav.faq"` - FAQ link

**Hero Section (lines 31-35):**
- `"hero.title"` - Main hero title
- `"hero.subtitle"` - Hero subtitle
- `"hero.cta.browse"` - Browse button text
- `"hero.cta.valuation"` - Valuation button text

**Filters (search for "filters"):**
- `"filters.title"` - Filters section title
- `"filters.brand"` - Brand filter label
- `"filters.model"` - Model filter label
- `"filters.priceFrom"` - Price from label
- `"filters.priceTo"` - Price to label

**Specs (search for "specs"):**
- `"specs.mileage"` - Mileage label
- `"specs.transmission"` - Transmission label
- `"specs.year"` - Year label
- `"specs.fuel"` - Fuel label
- `"specs.power"` - Power label

#### To Add New Translation:

**Step 1:** Add to translations object:
```typescript
it: {
  // ... existing translations ...
  "your.new.key": "Your Italian Text",
},
en: {
  // ... existing translations ...
  "your.new.key": "Your English Text",
},
```

**Step 2:** Use in component:
```tsx
{t("your.new.key")}
```

#### Finding Translation Keys:

**Method 1:** Search in component files:
```tsx
// Search for: t("
// This will show all translation keys used
```

**Method 2:** Check LanguageContext.tsx:
- All keys are listed alphabetically
- Use Ctrl+F to search for specific text

---

## 26. Privacy Policy, Cookie Policy, and Terms & Conditions

#### File Locations:

1. **Privacy Policy Page:** `src/pages/PrivacyPolicy.tsx`
2. **Cookie Policy Page:** `src/pages/CookiePolicy.tsx`
3. **Terms & Conditions Page:** `src/pages/TermsConditions.tsx`
4. **Cookie Consent Banner:** `src/components/CookieConsent.tsx`

#### How to Edit Privacy Policy:

**File:** `src/pages/PrivacyPolicy.tsx`

**Current Structure:**
- Uses translations from `LanguageContext.tsx`
- All text is in translation keys starting with `"privacy."`

**To Edit Content:**

**Step 1:** Open `src/contexts/LanguageContext.tsx`

**Step 2:** Find privacy translations (search for `"privacy"`):
```typescript
"privacy.title": "Privacy Policy",
"privacy.lastUpdate": "Ultimo aggiornamento:",
"privacy.section1.title": "Section 1 Title",
"privacy.section1.content": "Section 1 content...",
// ... more sections
```

**Step 3:** Edit the values:
```typescript
"privacy.section1.content": "Your new privacy policy content here...",
```

**To Add New Section:**

**Step 1:** Add translation keys:
```typescript
"privacy.section11.title": "Your Section Title",
"privacy.section11.content": "Your section content",
```

**Step 2:** Add section in `PrivacyPolicy.tsx`:
```tsx
<section>
  <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
    {t("privacy.section11.title")}
  </h2>
  <p className="text-muted-foreground">
    {t("privacy.section11.content")}
  </p>
</section>
```

#### How to Edit Cookie Policy:

**File:** `src/pages/CookiePolicy.tsx`

**Same process as Privacy Policy:**
- All text in `LanguageContext.tsx` with keys starting with `"cookie."`
- Edit translations to change content
- Add sections the same way

**Cookie Table (lines 55-111):**
- Edit cookie names, purposes, and durations in translations
- Keys: `"cookie.table.name"`, `"cookie.table.purpose"`, `"cookie.table.duration"`

#### How to Edit Terms & Conditions:

**File:** `src/pages/TermsConditions.tsx`

**Note:** This file has hardcoded text (not using translations)

**To Edit:**
1. Open `src/pages/TermsConditions.tsx`
2. Find the section you want to edit
3. Change the text directly in the file

**Example - Change Contact Email (line 151):**
```tsx
// Before:
gajanovsa@gmail.com

// After:
your-email@example.com
```

**Example - Change Contact Phone (line 194):**
```tsx
// Before:
<li><strong>Telefono:</strong> +39 333 388 9908</li>

// After:
<li><strong>Telefono:</strong> +39 123 456 7890</li>
```

#### How to Edit Google Maps Location

**File Locations:**
1. **Contact Page Map:** `src/pages/Contatti.tsx` (line 195)
2. **Dealer Card Map:** `src/components/DealerCard.tsx` (line 18)
3. **Address Link:** `src/pages/Contatti.tsx` (line 134, 139-140)

#### Current Location Information:

**Address:**
- Via Emilia per Cesena, 1800
- 47034 Forlimpopoli FC, Italia

**Coordinates (approximate):**
- Latitude: 44.1883
- Longitude: 12.1283

#### How to Change Google Maps Location:

**Method 1: Get New Embed Code from Google Maps**

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the iframe `src` in the files below

**Method 2: Edit Existing Embed URL**

**File 1: Contact Page (`src/pages/Contatti.tsx`)**

**Line 195 - Google Maps Embed:**
```tsx
<iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2864.5!2d12.1283!3d44.1883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ca5a0b8b8b8b9%3A0x0!2sVia+Emilia+per+Cesena%2C+1800%2C+47034+Forlimpopoli+FC!5e0!3m2!1sit!2sit!4v1" 
  // ... rest of props
/>
```

**To Change:**
- Replace the entire `src` URL with your new Google Maps embed URL
- Or use the coordinates method below

**Line 134 - Address Link:**
```tsx
<a href="https://maps.google.com/?q=Via+Emilia+per+Cesena+1800+Forlimpopoli" ...>
```

**To Change:**
- Replace `Via+Emilia+per+Cesena+1800+Forlimpopoli` with your address (use `+` for spaces)

**Lines 139-140 - Address Display:**
```tsx
Via Emilia per Cesena, 1800<br />
47034 Forlimpopoli FC, Italia
```

**To Change:**
- Edit the address text directly

**File 2: Dealer Card (`src/components/DealerCard.tsx`)**

**Line 18 - Google Maps Embed:**
```tsx
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2871.5!2d12.1282!3d44.1882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ca5f0c8a5a5a5%3A0x1234567890abcdef!2sVia%20Emilia%20per%20Cesena%2C%201800%2C%2047034%20Forlimpopoli%20FC!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
  // ... rest of props
/>
```

**To Change:**
- Replace the entire `src` URL with your new Google Maps embed URL

**Line 42 - Google Reviews Link:**
```tsx
href="https://www.google.com/maps/place/Divisione+Usato/@44.1882,12.1282,17z/..."
```

**To Change:**
- Replace with your Google Business Profile link
- Coordinates: `@44.1882,12.1282` (latitude,longitude)

**Line 55 - Address Link:**
```tsx
href="https://www.google.com/maps/place/Via+Emilia+per+Cesena,+1800,+47034+Forlimpopoli+FC"
```

**To Change:**
- Replace address in URL with your address

**Lines 60-61 - Address Display:**
```tsx
Via Emilia per Cesena, 1800<br />
47034 Forlimpopoli FC, Italia
```

**To Change:**
- Edit the address text directly

#### Quick Steps to Update Maps:

1. **Get your location coordinates:**
   - Go to Google Maps
   - Right-click on your location
   - Click the coordinates to copy them

2. **Get embed code:**
   - Click "Share" → "Embed a map"
   - Copy the iframe code

3. **Update files:**
   - Replace iframe `src` in `Contatti.tsx` (line 195)
   - Replace iframe `src` in `DealerCard.tsx` (line 18)
   - Update address text in both files
   - Update address links

4. **Test:**
   - Check the contact page
   - Check vehicle detail pages (if DealerCard is used)

---

## 28. How to Edit Cookie Consent Banner

**File:** `src/components/CookieConsent.tsx`

**Current Text (hardcoded, not translated):**

**Banner Title (line 173):**
```tsx
<h3 className="text-lg font-semibold text-foreground mb-2">
  Questo sito utilizza i cookie 🍪
</h3>
```

**Banner Description (lines 175-186):**
```tsx
<p className="text-sm text-muted-foreground">
  Utilizziamo cookie e tecnologie simili...
</p>
```

**Button Text:**
- Line 198: "Personalizza" (Customize)
- Line 205: "Solo Necessari" (Necessary Only)
- Line 208: "Accetta Tutti" (Accept All)

**Settings Panel Text:**
- Line 83: "Impostazioni Cookie" (Cookie Settings)
- Line 98: "Cookie Necessari" (Necessary Cookies)
- Line 113: "Cookie Analitici" (Analytics Cookies)
- Line 135: "Cookie di Marketing" (Marketing Cookies)

**To Edit:**
Simply change the text directly in the file.

**To Make It Translatable:**

**Step 1:** Add translations to `LanguageContext.tsx`:
```typescript
"cookie.banner.title": "This site uses cookies 🍪",
"cookie.banner.description": "We use cookies...",
"cookie.banner.acceptAll": "Accept All",
// ... etc
```

**Step 2:** Replace hardcoded text with `{t("cookie.banner.title")}`

---

#### 🏠 Homepage & Public Pages
- Homepage: `src/pages/Index.tsx`
- Listings: `src/pages/Listings.tsx`
- Vehicle Detail: `src/pages/VehicleDetail.tsx`
- Valuation Form: `src/pages/Valutiamo.tsx`
- Contact: `src/pages/Contatti.tsx`
- Blog: `src/pages/Blog.tsx`
- FAQ: `src/pages/FAQ.tsx`

#### 🔐 Legal Pages
- Privacy Policy: `src/pages/PrivacyPolicy.tsx`
- Cookie Policy: `src/pages/CookiePolicy.tsx`
- Terms & Conditions: `src/pages/TermsConditions.tsx`
- Cookie Consent Banner: `src/components/CookieConsent.tsx`

#### 👤 User Pages
- Login/Register: `src/pages/Auth.tsx`
- Customer Area: `src/pages/CustomerArea.tsx`
- Admin Dashboard: `src/pages/Admin.tsx`
- Track Request: `src/pages/TrackRequest.tsx`

#### 🧩 Components
- Header: `src/components/Header.tsx`
- Footer: `src/components/home/Footer.tsx`
- Vehicle Card: `src/components/VehicleCard.tsx`
- Vehicle Grid: `src/components/VehicleGrid.tsx`
- Search Filters: `src/components/SearchFilters.tsx`
- Vehicle Specs: `src/components/VehicleSpecs.tsx`
- Image Gallery: `src/components/ImageGallery.tsx`
- Financing Calculator: `src/components/FinancingCalculator.tsx`
- SEO Component: `src/components/SEO.tsx`
- WhatsApp Button: `src/components/WhatsAppButton.tsx`

#### 🏡 Homepage Components
- Hero Section: `src/components/home/HeroSection.tsx`
- Latest Arrivals: `src/components/home/LatestArrivals.tsx`
- Testimonials: `src/components/home/TestimonialsSection.tsx`
- Services: `src/components/home/ServicesSection.tsx`
- Trust Section: `src/components/home/TrustSection.tsx`
- Footer: `src/components/home/Footer.tsx`

#### ⚙️ Configuration
- Routes: `src/App.tsx`
- Translations: `src/contexts/LanguageContext.tsx`
- Tailwind Config: `tailwind.config.ts`
- Vite Config: `vite.config.ts`
- Package Info: `package.json`

### Common Editing Tasks Quick Guide

| Task | File to Edit | What to Change |
|------|-------------|----------------|
| **Change website name** | `src/components/Header.tsx`<br>`src/components/SEO.tsx` | Logo and site name |
| **Change contact info** | `src/pages/Contatti.tsx`<br>`src/components/home/Footer.tsx` | Phone, email, address |
| **Change WhatsApp number** | `src/components/WhatsAppButton.tsx` | Phone number |
| **Change Google Maps location** | `src/pages/Contatti.tsx`<br>`src/components/DealerCard.tsx` | Map embed and address |
| **Add/Remove filter** | `src/components/SearchFilters.tsx`<br>`src/pages/Listings.tsx` | Filter UI and logic |
| **Change card info** | `src/components/VehicleCard.tsx` | Fields displayed |
| **Change specs** | `src/components/VehicleSpecs.tsx` | Specifications shown |
| **Change SEO** | `src/components/SEO.tsx`<br>Each page file | Meta tags |
| **Optimize SEO** | `src/components/SEO.tsx`<br>`src/components/SchemaOrg.tsx`<br>`api/sitemap.xml.ts`<br>`public/robots.txt` | See SEO section below |
| **Change all text** | `src/contexts/LanguageContext.tsx` | Translation values |
| **Change colors** | `tailwind.config.ts`<br>Component files | Theme colors |
| **Edit privacy policy** | `src/contexts/LanguageContext.tsx` | Privacy translations |
| **Edit cookie policy** | `src/contexts/LanguageContext.tsx` | Cookie translations |
| **Edit terms** | `src/pages/TermsConditions.tsx` | Direct text edit |

### Editing Workflow

1. **Identify What to Edit**
   - Find the text/feature on the website
   - Note which page it's on

2. **Locate the File**
   - Use the file path reference above
   - Or search for the text in your editor

3. **Make the Change**
   - Edit the file
   - Save (Ctrl+S / Cmd+S)

4. **Test**
   - Check browser (should auto-refresh)
   - Verify the change looks correct

5. **If It Doesn't Work**
   - Check browser console for errors (F12)
   - Check terminal for build errors
   - Verify you edited the correct file

---

## 33. Troubleshooting

### Problem: Changes Not Showing

**Solutions:**
1. Save the file (Ctrl+S / Cmd+S)
2. Check if dev server is running: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R / Cmd+Shift+R
4. Check browser console for errors (F12)

### Problem: Build Errors

**Solutions:**
1. Check error message in terminal
2. Look for typos in code
3. Check if all imports are correct
4. Verify TypeScript types are correct
5. Run `npm install` to ensure dependencies are installed

### Problem: Styling Not Working

**Solutions:**
1. Check Tailwind classes are correct
2. Verify `tailwind.config.ts` is configured
3. Check if class name is spelled correctly
4. Restart dev server

### Problem: Database Errors

**Solutions:**
1. Check Supabase connection in `.env` file
2. Verify database tables exist
3. Check Row Level Security (RLS) policies
4. Look at Supabase dashboard for errors

### Problem: API Not Working

**Solutions:**
1. Check API key is set in Supabase secrets
2. Verify Edge Function is deployed
3. Check network tab in browser (F12)
4. Look at Supabase Edge Function logs

### Getting Help

1. **Check Documentation:**
   - `HOW_TO_START/README.md` - Setup guide
   - `HOW_TO_START/docs/` - Technical docs
   - `FULL_DOCUMENTATION.md` - Complete reference

2. **Check Error Messages:**
   - Browser console (F12)
   - Terminal/Command prompt
   - Supabase dashboard logs

3. **Search the Codebase:**
   - Use search function to find similar code
   - Look at how similar features are implemented

---

## 34. Additional Resources

### Official Documentation

- **React Documentation:** https://react.dev
- **TypeScript Documentation:** https://www.typescriptlang.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **React Router:** https://reactrouter.com
- **React Hook Form:** https://react-hook-form.com

### Learning Resources

- **React Tutorial:** https://react.dev/learn
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html
- **Tailwind CSS Tutorial:** https://tailwindcss.com/docs/utility-first

### Project-Specific Documentation

- **Setup Guide:** `HOW_TO_START/README.md`
- **Technical Docs:** `HOW_TO_START/docs/`
- **Complete Reference:** `FULL_DOCUMENTATION.md` (in project root)

---

## 📝 Quick Tips

### Best Practices

1. **Start Small:** Begin with simple text changes before tackling complex features
2. **Test Often:** Check your changes in the browser frequently
3. **Read Error Messages:** They usually tell you exactly what's wrong
4. **Use Search:** Find similar code to understand patterns
5. **Save Frequently:** Use Ctrl+S / Cmd+S often
6. **Version Control:** Use Git to track changes (optional but recommended)

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Check for errors
npm run lint
```

### Keyboard Shortcuts

- **Ctrl+F / Cmd+F** - Search in current file
- **Ctrl+Shift+F / Cmd+Shift+F** - Search in all files
- **Ctrl+S / Cmd+S** - Save file
- **F12** - Open browser developer tools
- **Ctrl+Shift+R / Cmd+Shift+R** - Hard refresh browser

---

## 🎯 Final Notes

**Remember:** Don't be afraid to experiment! The worst that can happen is you need to undo changes. Always test in development mode before deploying to production.

**Need Help?**
- Check the troubleshooting section above
- Review error messages in browser console (F12)
- Check terminal for build errors
- Refer to the specific section in this guide for detailed instructions

**Good luck with your edits! 🚀**

---

---

## 📄 Document Information

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Project:** Car Dealership Website  
**Target Audience:** Beginners to Advanced Developers  
**Total Sections:** 34  
**Total Pages:** ~100+ (when printed)

### Document Structure

This guide is organized into **8 main parts**:

1. **Introduction & Overview** (Sections 1-4) - Start here if you're new
2. **Project Structure** (Sections 5-6) - Understand the codebase
3. **Features Overview** (Section 7) - Learn what the site does
4. **Function & Feature Guides** (Sections 8-19) - Deep dive into each feature
5. **SEO Optimization** (Section 20) - Complete SEO guide
6. **Detailed Editing Guides** (Sections 21-28) - Step-by-step editing instructions
7. **Common Tasks & Workflows** (Sections 29-31) - Practical editing workflows
8. **Reference & Troubleshooting** (Sections 32-34) - Quick reference and help

### Quick Navigation

**Most Common Tasks:**
- [Change Website Text](#25-how-to-change-all-website-texts) - Section 25
- [Change Contact Information](#29-common-editing-tasks) - Section 29, Task 2
- [Add/Remove Filters](#21-how-to-addremove-search-filters) - Section 21
- [Edit SEO](#20-seo-optimizations---complete-guide) - Section 20
- [Change Colors](#29-common-editing-tasks) - Section 29, Task 4

**Feature Customization:**
- [Vehicle API](#8-vehicle-api--data-fetching) - Section 8
- [Financing Calculator](#11-financing-calculator) - Section 11
- [Messaging System](#13-messaging-system) - Section 13
- [Analytics Tracking](#10-analytics--tracking-system) - Section 10

---

**End of Document**
