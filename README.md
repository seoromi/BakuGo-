# BakuGo Tour - Frontend Handoff Documentation

## Project Overview

BakuGo Tour is a tourism website for Azerbaijan that showcases tours, destinations, and booking functionality. The frontend is a static HTML/CSS/JavaScript application that currently uses JSON files for data storage and is designed to integrate with a backend API.

**Key Features:**
- Tour browsing and filtering (group, private, driver-only, packages)
- Destination exploration
- Booking system with modal forms
- Review submission
- Admin panel for content management
- Multi-language support (RU, EN, TR)
- Responsive design

## Frontend Architecture

### Folder Structure

```
├── data/                          # Static JSON data files
│   ├── tours.json                 # All tour data
│   └── destinations.json          # Destination data
│
├── src/
│   ├── assets/                   # Images and static assets
│   │   └── img/
│   │       ├── tour-images/      # Tour photos
│   │       ├── destinations/     # Destination photos
│   │       └── ui/               # UI elements (logos, icons)
│   │
│   ├── js/
│   │   ├── config/               # Configuration files
│   │   │   ├── api.config.js     # API endpoint definitions
│   │   │   └── env.js            # Environment configuration
│   │   │
│   │   ├── core/                 # Core functionality
│   │   │   ├── component.js      # Base component class
│   │   │   ├── navigation.js    # Navigation menu logic
│   │   │   ├── slider.js        # Slider component
│   │   │   └── language-switcher.js
│   │   │
│   │   ├── pages/                # Page-specific logic
│   │   │   ├── admin/            # Admin panel (modular architecture)
│   │   │   ├── all-tours-page/   # All tours listing page
│   │   │   ├── destination/      # Destination detail pages
│   │   │   ├── explore/          # Explore destinations page
│   │   │   ├── home/             # Homepage logic
│   │   │   └── tour/             # Tour detail pages
│   │   │
│   │   ├── services/             # API service classes
│   │   │   ├── api.service.js    # Base API service
│   │   │   ├── tours.service.js
│   │   │   ├── bookings.service.js
│   │   │   ├── destinations.service.js
│   │   │   ├── reviews.service.js
│   │   │   ├── admin.service.js
│   │   │   └── tour-sections.service.js
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── tours-data.js     # Tour data fetching (currently from JSON)
│   │   │   ├── sanitize.js       # XSS prevention utilities
│   │   │   └── utils.js          # General utilities
│   │   │
│   │   ├── ui/                   # UI components
│   │   │   ├── review-modal.js
│   │   │   └── featuresmobile.js
│   │   │
│   │   └── search/               # Search functionality
│   │       └── search.js
│   │
│   └── scss/                     # SCSS source files
│       ├── abstracts/           # Variables, mixins, functions
│       ├── base/                 # Resets, typography
│       ├── components/           # Reusable components
│       ├── layout/               # Layout components
│       ├── pages/                # Page-specific styles
│       ├── admin/                # Admin panel styles
│       └── entry-points/         # SCSS compilation entry points
│
├── dist/                         # Compiled CSS (generated)
│   └── css/
│
├── destinations/                 # Static destination HTML pages
│   └── html-pages/
│
├── page/                         # Static tour detail pages
│   ├── dailytours/
│   ├── privatetours/
│   ├── onlydriver/
│   └── tourpackage/
│
├── index.html                    # Homepage
├── explore.html                  # Explore destinations page
├── all-tours.html               # All tours listing page
├── admin.html                   # Admin panel
└── package.json                 # Dependencies (SASS compiler)
```

### Key Responsibilities

**`src/js/config/api.config.js`**
- Defines all API endpoint paths
- Centralized configuration for backend integration
- Endpoints are structured but not yet connected (services return empty/mock data)

**`src/js/services/`**
- Service classes extend `ApiService` base class
- Currently return empty arrays or mock data
- Ready for backend integration (uncomment API calls, remove mocks)

**`src/js/utils/tours-data.js`**
- Currently fetches from `/data/tours.json`
- Provides helper functions: `getTours()`, `getToursByType()`, `searchTours()`
- Will be replaced by `ToursService` when backend is ready

**`src/js/pages/admin/`**
- Modular admin panel architecture
- Core functionality in `admin-panel-core.js`
- Feature mixins: API, CRUD, forms, validators, renderers, filters, charts, dashboard
- Currently uses mock data from `admin-data.js`

## Page Flow & Logic

### Public Pages

**Homepage (`index.html`)**
1. Loads tour sliders dynamically from JSON
2. Sections: Hero search, Features, Daily Tours Slider, Packages Slider, Private Tours Slider, Driver Tours Slider, All Tours Grid, Testimonials, Review Section, Contact
3. Sliders render via `src/js/pages/home/home-sliders.js`
4. Tours grid renders via `src/js/pages/home/main.js`

**Explore Page (`explore.html`)**
1. Fetches destinations from `/data/destinations.json`
2. Filters to only `status: "active"` destinations
3. Renders via `src/js/pages/explore/destinations-renderer.js`
4. Uses safe DOM manipulation (no innerHTML with user data)

**All Tours Page (`all-tours.html`)**
1. Loads all tours from JSON on page load
2. Filters by URL parameters: `?type=group|private|driver|package`
3. Client-side filtering by type, destination, price, duration
4. Pagination: 9 tours per page
5. Renders via `src/js/pages/all-tours-page/all-tours.js`

**Tour Detail Pages (`page/*/`)**
- Static HTML pages for individual tours
- Booking modal integration
- Related tours section

**Destination Pages (`destinations/html-pages/`)**
- Static HTML pages for individual destinations
- Linked from explore page

### Admin Panel (`admin.html`)

**Access Flow:**
1. Admin panel is accessible at `/admin.html`
2. **No authentication implemented in frontend** - backend must handle this
3. Frontend expects authentication token in:
   - `localStorage.getItem('authToken')` (current, insecure)
   - Or httpOnly cookies (recommended for production)

**Admin Sections:**
- Dashboard: Statistics overview
- Tours: CRUD operations for tours
- Bookings: View and manage bookings
- Customers: Customer management
- Reviews: Approve/reject reviews
- Destinations: CRUD for destinations
- Promo Codes: Manage discount codes

**Admin Architecture:**
- Modular mixin-based system
- Core class: `AdminPanel` in `admin-panel-core.js`
- Mixins add functionality: `mixinCrudMethods()`, `mixinApiMethods()`, etc.
- All admin methods available via `window.adminPanel`

## Data Flow

### Current State (JSON-Based)

**Tours Data:**
```
/data/tours.json → src/js/utils/tours-data.js → Pages
```

**Destinations Data:**
```
/data/destinations.json → src/js/pages/explore/destinations-renderer.js → explore.html
```

**Booking Flow:**
```
Booking Form → src/js/pages/tour/booking-modal.js → 
src/js/services/bookings.service.js → localStorage (temporary) → 
Backend API (when ready)
```

### Backend Integration Points

**Service Layer Ready:**
All services in `src/js/services/` are structured for backend integration:

```javascript
// Example: ToursService
async getTours(filters = {}) {
  // TODO: Uncomment when backend ready:
  // return this.get(this.endpoints.list, filters);
  
  // Current: Returns empty array
  return Promise.resolve([]);
}
```

**API Configuration:**
- Base URL: Set in `src/js/config/env.js` (defaults to `/api`)
- Endpoints: Defined in `src/js/config/api.config.js`
- Authentication: Bearer token in `Authorization` header
- CSRF: Expects `X-CSRF-Token` header (from meta tag)

**Data Fetching Pattern:**
1. Pages call service methods (e.g., `ToursService.getTours()`)
2. Services extend `ApiService` base class
3. `ApiService` handles:
   - URL building
   - Authentication headers
   - Error handling
   - Timeout management

## Dynamic Rendering

### Tours Rendering

**Homepage Sliders:**
- `src/js/pages/home/home-sliders.js` fetches tours via `getFeaturedTours()` and `getToursByType()`
- Renders slides using `unifiedSlideTemplate()` function
- Uses `insertAdjacentHTML()` with sanitized data (URLs, text content)
- Slider component (`src/js/core/slider.js`) handles navigation

**All Tours Page:**
- `src/js/pages/all-tours-page/all-tours.js` renders tour cards
- Uses template strings with sanitized data
- Filters and pagination handled client-side

**Tour Cards Structure:**
```javascript
{
  id: number,
  title: string,
  description: string,
  price: number,
  duration: string,
  type: "group" | "private" | "driver" | "package",
  image: string (path),
  link: string (URL to detail page),
  badge: string,
  highlights: string[],
  featured: boolean,
  rating: number,
  reviewCount: number
}
```

### Destinations Rendering

**Explore Page:**
- `src/js/pages/explore/destinations-renderer.js` uses safe DOM manipulation
- Creates elements via `createSafeElement()` (no innerHTML with user data)
- Filters to `status: "active"` destinations only
- Renders destination cards with image, name, description, link

**Destination Card Structure:**
```javascript
{
  id: string,
  name: string,
  shortDescription: string,
  fullDescription: string,
  image: string,
  location: string,
  region: string,
  url: string,
  overlayText: string,
  status: "active" | "inactive"
}
```

### Admin Data Rendering

**Admin Panel:**
- Uses `admin-renderers.js` mixin for table rendering
- All data sanitized before rendering
- Uses `textContent` for text, `setAttribute` for URLs
- No innerHTML with user data

## Admin Panel Behavior

### Validation

**Client-Side Validation:**
- Email: Regex pattern validation
- Phone: Format validation
- Price: Numeric validation
- Required fields: Non-empty check
- Image URLs: URL format validation
- File uploads: Type and size validation

**Validation Methods:**
Located in `src/js/pages/admin/admin-validators.js`:
- `validateEmail(email)`
- `validatePhone(phone)`
- `validatePrice(price)`
- `validateRequired(value)`
- `validateImageUrl(url)`
- `validateImageFile(file)`

### Authentication Expectations

**Current Implementation:**
- Frontend checks for token: `localStorage.getItem('authToken')`
- Token sent in header: `Authorization: Bearer ${token}`
- **Security Note:** Frontend expects backend to:
  1. Implement login endpoint: `POST /auth/login`
  2. Return token on successful login
  3. Validate token on protected routes
  4. Return 401 Unauthorized if token invalid/expired

**Recommended Production Approach:**
- Use httpOnly cookies instead of localStorage
- Backend sets cookie on login
- Frontend sends cookie automatically with requests
- Backend validates cookie on each request

**CSRF Protection:**
- Frontend expects `<meta name="csrf-token" content="...">` in HTML
- Sends `X-CSRF-Token` header with requests
- Backend should validate CSRF token

### API Assumptions

**Request Format:**
- Content-Type: `application/json`
- Accept: `application/json`
- Authentication: `Authorization: Bearer ${token}` (if authenticated)
- CSRF: `X-CSRF-Token: ${token}` (if available)

**Response Format:**
- Success: JSON object or array
- Error: JSON with `message` or `error.message` field
- Status codes: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

**Error Handling:**
- Frontend catches API errors via `ApiError` class
- Displays user-friendly error messages
- Logs errors to console in development

## Dark / Light Mode Handling

**Current Implementation:**
- No explicit dark/light mode toggle in frontend
- Uses CSS custom properties (variables) for theming
- Variables defined in `src/scss/abstracts/_variables.scss`:
  - `--text-dark`, `--text-light`
  - `--bg-light`
  - `--dark-blue`, `--light-cream`
  - Theme colors for orange/blue scheme

**Admin Panel:**
- Admin styles use `@media (prefers-color-scheme: dark)` for dark mode support
- Variables in `src/scss/admin/_variables.scss` for admin theming

**Backend Consideration:**
- **No backend action required** - theme is handled entirely via CSS

## Expected Backend APIs

### Authentication

```
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: object }

POST /auth/logout
Headers: Authorization: Bearer ${token}
Response: 204 No Content

GET /auth/validate
Headers: Authorization: Bearer ${token}
Response: { valid: boolean, user: object }
```

### Tours

```
GET /tours
Query: ?type=group&destination=gobustan&search=...
Response: Array<Tour>

GET /tours/:id
Response: Tour

POST /tours (admin)
Headers: Authorization: Bearer ${token}
Body: Tour object
Response: Created Tour

PUT /tours/:id (admin)
Headers: Authorization: Bearer ${token}
Body: Tour object
Response: Updated Tour

DELETE /tours/:id (admin)
Headers: Authorization: Bearer ${token}
Response: 204 No Content
```

### Bookings

```
POST /bookings
Body: {
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  tourId: number,
  tourDate: string (ISO date),
  tourTime: string,
  adultCount: number,
  childCount: number,
  promoCode?: string,
  specialRequests?: string
}
Response: Created Booking

GET /bookings (admin)
Headers: Authorization: Bearer ${token}
Query: ?status=pending&tourId=1
Response: Array<Booking>

PUT /bookings/:id (admin)
Headers: Authorization: Bearer ${token}
Body: { status: string, ... }
Response: Updated Booking
```

### Reviews

```
POST /reviews
Body: {
  reviewerName: string,
  reviewerEmail: string,
  reviewerLocation?: string,
  tourId: number,
  rating: number (1-5),
  title: string,
  content: string
}
Response: Created Review

GET /reviews
Query: ?tourId=1&approved=true
Response: Array<Review>

PUT /admin/reviews/:id (admin)
Headers: Authorization: Bearer ${token}
Body: { approved: boolean, ... }
Response: Updated Review
```

### Destinations

```
GET /destinations
Query: ?status=active&region=gobustan
Response: Array<Destination>

GET /destinations/:id
Response: Destination

POST /admin/destinations (admin)
Headers: Authorization: Bearer ${token}
Body: Destination object
Response: Created Destination
```

### Admin Endpoints

All admin endpoints require `Authorization: Bearer ${token}` header.

```
GET /admin/dashboard
Response: { stats: object, recentBookings: Array, ... }

GET /admin/tours
GET /admin/bookings
GET /admin/customers
GET /admin/reviews
GET /admin/destinations
GET /admin/promo-codes
```

## Important Frontend Constraints

### Data Structure Requirements

**Tours JSON Shape:**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "price": 49,
  "duration": "8 часов",
  "type": "group" | "private" | "driver" | "package",
  "country": "Azerbaijan",
  "city": "Baku",
  "destinations": ["gobustan", "quba"],
  "rating": 4.8,
  "reviewCount": 124,
  "badge": "👥 с гидом",
  "highlights": ["string"],
  "link": "page/dailytours/...",
  "image": "src/assets/img/...",
  "tags": ["group", "gobustan"],
  "featured": true
}
```

**Destinations JSON Shape:**
```json
{
  "destinations": [
    {
      "id": "gobustan",
      "name": "Gobustan Rock Art",
      "shortDescription": "string",
      "fullDescription": "string",
      "image": "src/assets/img/...",
      "location": "Gobustan",
      "region": "Gobustan",
      "url": "destinations/html-pages/gobustan.html",
      "overlayText": "Ancient History",
      "status": "active" | "inactive"
    }
  ]
}
```

**Critical Fields:**
- Tour `id` must be unique numeric
- Tour `type` must match: `group`, `private`, `driver`, `package`
- Destination `status` must be `"active"` to display on explore page
- Image paths are relative to project root

### Route Constraints

**Static Pages (Must Exist):**
- `/index.html` - Homepage
- `/explore.html` - Explore destinations
- `/all-tours.html` - All tours listing
- `/admin.html` - Admin panel
- `/destinations/html-pages/*.html` - Destination detail pages
- `/page/*/*.html` - Tour detail pages

**URL Parameters:**
- `/all-tours.html?type=group` - Filter by tour type
- `/all-tours.html?destination=gobustan` - Filter by destination

**API Routes:**
- Base URL configurable via `src/js/config/env.js`
- Default: `/api`
- All endpoints relative to base URL

### Security Constraints

**XSS Prevention:**
- **Never use `innerHTML` with user data or API responses**
- Use `textContent` for text
- Use `setSafeHtml()` from `src/js/utils/sanitize.js` for HTML content
- Sanitize URLs before setting `href` or `src`
- All rendering functions use safe DOM methods

**Content Security Policy:**
- CSP meta tag in HTML head
- Allows: `self`, CDN resources (jsdelivr, cdnjs, fonts.googleapis)
- Blocks: `unsafe-eval`, inline scripts (except necessary)

**File Uploads:**
- Admin panel validates file type and size
- Uses object URLs for preview (memory efficient)
- Backend must validate files server-side

### ID Constraints

**Tour IDs:**
- Must be unique numeric values
- Used in URLs: `/page/dailytours/tour-{id}.html` (if implemented)
- Referenced in bookings: `tourId` field

**Destination IDs:**
- String identifiers (e.g., `"gobustan"`, `"ateshgah"`)
- Used in URLs: `destinations/html-pages/{id}.html`
- Referenced in tours: `destinations` array

### Image Path Constraints

**Image Paths:**
- Relative to project root
- Format: `src/assets/img/tour-images/...` or `src/assets/img/destinations/...`
- Backend should return same path format or full URLs

## Development Notes

### Running Frontend Locally

**Prerequisites:**
- Node.js (for SASS compilation)
- Local web server (for CORS and module loading)

**Setup:**
```bash
# Install dependencies
npm install

# Compile SCSS to CSS
npm run compile-scss

# Watch SCSS changes (optional)
npm run watch-scss
```

**Serving:**
Use a local web server (required for ES modules and fetch):
```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Access: `http://localhost:8000`

### Backend Integration Steps

**1. Update API Configuration:**
Edit `src/js/config/env.js` or set `window.ENV` in HTML:
```javascript
window.ENV = {
  API_BASE_URL: 'https://api.example.com/api',
  API_TIMEOUT: 30000
};
```

**2. Enable API Calls in Services:**
Uncomment API calls in service files:
- `src/js/services/tours.service.js`
- `src/js/services/bookings.service.js`
- `src/js/services/reviews.service.js`
- `src/js/services/destinations.service.js`
- `src/js/services/admin.service.js`

**3. Remove JSON Fallbacks:**
- Replace `src/js/utils/tours-data.js` calls with `ToursService` calls
- Update `destinations-renderer.js` to use `DestinationsService`

**4. Implement Authentication:**
- Create login page/flow
- Store token (httpOnly cookie recommended)
- Add token validation middleware on backend

**5. Update Admin Panel:**
- Connect admin service methods to real API
- Remove mock data from `admin-data.js`
- Test CRUD operations

### Build Process

**SCSS Compilation:**
- Entry points in `src/scss/entry-points/`
- Output to `dist/css/`
- Run: `npm run compile-scss`

**No JavaScript Build:**
- Frontend uses ES modules directly
- No bundling required
- Modern browsers only (ES6+)

### Environment Configuration

**Development:**
- Default API URL: `/api` (relative)
- Debug logging enabled

**Production:**
- Set `window.ENV.API_BASE_URL` to production API URL
- Set `window.ENV.DEBUG = false`
- Ensure CSP headers are configured

### Testing Backend Integration

**Test Checklist:**
1. Tours load from API (not JSON)
2. Bookings submit to API
3. Reviews submit to API
4. Admin login works
5. Admin CRUD operations work
6. Authentication token persists
7. Error handling displays user-friendly messages
8. Loading states work correctly

### Common Issues

**CORS Errors:**
- Backend must allow frontend origin
- Set `Access-Control-Allow-Origin` header

**Module Loading:**
- Ensure server serves files with correct MIME types
- ES modules require `type="module"` in script tags

**Authentication:**
- Token must be sent in `Authorization: Bearer ${token}` header
- Backend must validate token on protected routes

---

## Summary

The frontend is structured for easy backend integration. All API service classes are ready, endpoints are defined, and the codebase follows a consistent pattern. The main tasks for backend integration are:

1. Implement the API endpoints as defined in `api.config.js`
2. Enable API calls in service files (uncomment code)
3. Replace JSON data fetching with service calls
4. Implement authentication (login, token validation)
5. Test all CRUD operations in admin panel

The frontend handles XSS prevention, responsive design, and user experience. The backend only needs to provide the data and authentication layer.

