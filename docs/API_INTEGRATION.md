# API Integration Guide

This document specifies where and how backend APIs must connect to the existing frontend codebase. The frontend is production-ready and uses JSON files and mock data that must be replaced with real API calls.

## Table of Contents

1. [Where Backend Logic is Expected](#where-backend-logic-is-expected)
2. [Current Mock/JSON Data Sources](#current-mockjson-data-sources)
3. [Exact API Connection Points](#exact-api-connection-points)
4. [Expected API Endpoints](#expected-api-endpoints)
5. [Authentication Flow](#authentication-flow)
6. [Admin Panel Integration](#admin-panel-integration)
7. [Error Handling Expectations](#error-handling-expectations)
8. [Status & Visibility Logic](#status--visibility-logic)
9. [What Backend Must NOT Change](#what-backend-must-not-change)
10. [Step-by-Step Integration Plan](#step-by-step-integration-plan)

---

## Where Backend Logic is Expected

### Service Layer (`src/js/services/`)

All API calls are abstracted through service classes that extend `ApiService`. These are the **only files** that should contain fetch/HTTP logic.

**Service Files:**
- `src/js/services/api.service.js` - Base API service (handles auth, errors, timeouts)
- `src/js/services/tours.service.js` - Tour CRUD operations
- `src/js/services/bookings.service.js` - Booking creation and management
- `src/js/services/reviews.service.js` - Review submission and retrieval
- `src/js/services/destinations.service.js` - Destination data
- `src/js/services/admin.service.js` - Admin panel operations
- `src/js/services/tour-sections.service.js` - Tour section management

### Configuration (`src/js/config/`)

**API Configuration:**
- `src/js/config/api.config.js` - Endpoint definitions (already structured)
- `src/js/config/env.js` - Environment variables (API base URL, timeout)

**Backend must provide:**
- API base URL (default: `/api`)
- CORS headers for frontend origin
- Authentication token validation

### Current Data Sources (To Replace)

**JSON Files:**
- `/data/tours.json` - Currently loaded by `src/js/utils/tours-data.js`
- `/data/destinations.json` - Currently loaded by `src/js/pages/explore/destinations-renderer.js`

**Mock Data:**
- `src/js/pages/admin/admin-data.js` - Mock admin data (remove after integration)
- `localStorage` - Temporary booking/review storage (in `bookings.service.js` and `reviews.service.js`)

---

## Current Mock/JSON Data Sources

### Tours Data

**Current Implementation:**
- **File:** `src/js/utils/tours-data.js`
- **Source:** Fetches from `/data/tours.json`
- **Used by:**
  - `src/js/pages/home/home-sliders.js` (homepage sliders)
  - `src/js/pages/all-tours-page/all-tours.js` (all tours page)
  - `src/js/pages/tour/recommended-tours.js` (related tours)

**Functions to Replace:**
```javascript
// src/js/utils/tours-data.js
export async function getTours()           // → ToursService.getTours()
export async function getTourById(id)      // → ToursService.getTourById(id)
export async function getFeaturedTours()   // → ToursService.getTours({ featured: true })
export async function getToursByType(type) // → ToursService.getTours({ type })
export async function searchTours(query)    // → ToursService.searchTours(query)
```

**Integration Point:**
Replace imports in consuming files:
```javascript
// BEFORE (current)
import { getTours } from '../../utils/tours-data.js';

// AFTER (with backend)
import { ToursService } from '../../services/tours.service.js';
const toursService = new ToursService();
const tours = await toursService.getTours();
```

### Destinations Data

**Current Implementation:**
- **File:** `src/js/pages/explore/destinations-renderer.js`
- **Source:** Fetches from `/data/destinations.json` (line 99)
- **Function:** `fetchDestinations()` (line 97-109)

**Integration Point:**
Replace `fetchDestinations()` function:
```javascript
// BEFORE (current - line 97)
async function fetchDestinations() {
    const response = await fetch('data/destinations.json');
    const data = await response.json();
    return data.destinations || [];
}

// AFTER (with backend)
import { DestinationsService } from '../../services/destinations.service.js';
const destinationsService = new DestinationsService();

async function fetchDestinations() {
    return await destinationsService.getDestinations();
}
```

### Bookings Data

**Current Implementation:**
- **File:** `src/js/services/bookings.service.js`
- **Source:** `localStorage.setItem('lastBooking', ...)` (line 40)
- **Used by:** `src/js/pages/tour/booking-modal.js` (line 16, 300+)

**Integration Point:**
Uncomment API call in `createBooking()` method (line 29-41):
```javascript
// CURRENT (line 29-41)
async createBooking(bookingData) {
    // TODO: Replace localStorage with API call when backend is ready
    // return this.post(this.endpoints.create, bookingData);
    
    const savedData = {
        ...bookingData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('lastBooking', JSON.stringify(savedData));
    return Promise.resolve(savedData);
}

// AFTER (uncomment line 31, remove localStorage code)
async createBooking(bookingData) {
    return this.post(this.endpoints.create, bookingData);
}
```

### Reviews Data

**Current Implementation:**
- **File:** `src/js/services/reviews.service.js`
- **Source:** `localStorage.setItem('lastReview', ...)` (line 39)
- **Used by:** `src/js/ui/review-modal.js`

**Integration Point:**
Uncomment API call in `createReview()` method (line 28-42):
```javascript
// CURRENT (line 28-42)
async createReview(reviewData) {
    // TODO: Replace localStorage with API call when backend is ready
    // return this.post(this.endpoints.create, reviewData);
    
    const savedData = {
        ...reviewData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('lastReview', JSON.stringify(savedData));
    return Promise.resolve(savedData);
}

// AFTER (uncomment line 30, remove localStorage code)
async createReview(reviewData) {
    return this.post(this.endpoints.create, reviewData);
}
```

### Admin Panel Data

**Current Implementation:**
- **File:** `src/js/pages/admin/admin-data.js`
- **Source:** Hardcoded mock data arrays
- **Used by:** All admin panel renderers

**Integration Point:**
All admin service methods in `src/js/services/admin.service.js` return empty arrays. Uncomment API calls in:
- `getTours()` (line 19-22)
- `getBookings()` (line 44-47)
- `getCustomers()` (line 69-72)
- `getReviews()` (line 94-97)
- `getDestinations()` (line 113-116)
- `getPromoCodes()` (line 138-141)
- `getDashboard()` (line 163-166)

---

## Exact API Connection Points

### 1. Tours Service (`src/js/services/tours.service.js`)

**Line 29-35:** `getTours()`
```javascript
// UNCOMMENT line 31, REMOVE line 34
async getTours(filters = {}) {
    return this.get(this.endpoints.list, filters);
}
```

**Line 42-48:** `getTourById()`
```javascript
// UNCOMMENT line 44, REMOVE line 47
async getTourById(id) {
    return this.get(this.endpoints.detail(id));
}
```

**Line 56-62:** `searchTours()`
```javascript
// UNCOMMENT line 58, REMOVE line 61
async searchTours(query, filters = {}) {
    return this.get(this.endpoints.search, { search: query, ...filters });
}
```

### 2. Bookings Service (`src/js/services/bookings.service.js`)

**Line 29-42:** `createBooking()`
```javascript
// UNCOMMENT line 31, REMOVE lines 35-41
async createBooking(bookingData) {
    return this.post(this.endpoints.create, bookingData);
}
```

**Line 49-54:** `getBookingById()`
```javascript
// UNCOMMENT line 51, REMOVE line 53
async getBookingById(id) {
    return this.get(this.endpoints.detail(id));
}
```

**Line 61-66:** `getBookings()`
```javascript
// UNCOMMENT line 63, REMOVE line 65
async getBookings(filters = {}) {
    return this.get(this.endpoints.list, filters);
}
```

**Line 74-79:** `updateBooking()`
```javascript
// UNCOMMENT line 76, REMOVE line 78
async updateBooking(id, bookingData) {
    return this.put(this.endpoints.update(id), bookingData);
}
```

**Line 86-91:** `deleteBooking()`
```javascript
// UNCOMMENT line 88, REMOVE line 90
async deleteBooking(id) {
    return this.delete(this.endpoints.delete(id));
}
```

### 3. Reviews Service (`src/js/services/reviews.service.js`)

**Line 28-42:** `createReview()`
```javascript
// UNCOMMENT line 30, REMOVE lines 34-41
async createReview(reviewData) {
    return this.post(this.endpoints.create, reviewData);
}
```

**Line 49-54:** `getReviewsByTour()`
```javascript
// UNCOMMENT line 51, REMOVE line 53
async getReviewsByTour(tourId) {
    return this.get(this.endpoints.byTour(tourId));
}
```

**Line 61-66:** `getReviews()`
```javascript
// UNCOMMENT line 63, REMOVE line 65
async getReviews(filters = {}) {
    return this.get(this.endpoints.list, filters);
}
```

### 4. Destinations Service (`src/js/services/destinations.service.js`)

**Line 25-32:** `getDestinations()`
```javascript
// UNCOMMENT line 27, REMOVE line 31
async getDestinations() {
    return this.get(this.endpoints.list);
}
```

**Line 39-44:** `getDestinationById()`
```javascript
// UNCOMMENT line 41, REMOVE line 43
async getDestinationById(id) {
    return this.get(this.endpoints.detail(id));
}
```

### 5. Admin Service (`src/js/services/admin.service.js`)

**All methods (lines 19-167):** Uncomment API calls, remove `Promise.resolve([])` returns.

**Example - Tours (line 19-22):**
```javascript
async getTours(filters = {}) {
    return this.get(this.endpoints.tours.list, filters);
}
```

**Example - Create Tour (line 25-29):**
```javascript
async createTour(tourData) {
    return this.post(this.endpoints.tours.create, tourData);
}
```

### 6. Replace JSON Imports

**File:** `src/js/pages/home/home-sliders.js`
- **Line 8:** Replace import
```javascript
// BEFORE
import { getFeaturedTours, getToursByType, getTours } from '../../utils/tours-data.js';

// AFTER
import { ToursService } from '../../services/tours.service.js';
const toursService = new ToursService();
```

- **Line 86:** Replace function call
```javascript
// BEFORE
const featuredGroupTours = (await getFeaturedTours()).filter(t => t.type === 'group');

// AFTER
const featuredGroupTours = (await toursService.getTours({ featured: true })).filter(t => t.type === 'group');
```

**File:** `src/js/pages/all-tours-page/all-tours.js`
- **Line 9:** Replace import
```javascript
// BEFORE
import { getTours } from '../../utils/tours-data.js';

// AFTER
import { ToursService } from '../../services/tours.service.js';
const toursService = new ToursService();
```

- **Line 21:** Replace function call
```javascript
// BEFORE
allTours = await getTours();

// AFTER
allTours = await toursService.getTours();
```

**File:** `src/js/pages/explore/destinations-renderer.js`
- **Line 97-109:** Replace `fetchDestinations()` function
```javascript
// BEFORE
async function fetchDestinations() {
    const response = await fetch('data/destinations.json');
    const data = await response.json();
    return data.destinations || [];
}

// AFTER
import { DestinationsService } from '../../services/destinations.service.js';
const destinationsService = new DestinationsService();

async function fetchDestinations() {
    return await destinationsService.getDestinations();
}
```

---

## Expected API Endpoints

### Base Configuration

**Base URL:** Configurable via `src/js/config/env.js` (default: `/api`)
**Content-Type:** `application/json`
**Accept:** `application/json`
**Authentication:** `Authorization: Bearer ${token}` (for protected routes)
**CSRF:** `X-CSRF-Token: ${token}` (if meta tag present)

### Endpoint Definitions

All endpoints are defined in `src/js/config/api.config.js`. Backend must implement:

#### Authentication

```
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: { id, email, name } }
Status: 200 (success), 401 (invalid credentials)

POST /auth/logout
Headers: Authorization: Bearer ${token}
Response: 204 No Content

GET /auth/validate
Headers: Authorization: Bearer ${token}
Response: { valid: boolean, user: object }
Status: 200 (valid), 401 (invalid/expired)
```

#### Tours

```
GET /tours
Query Parameters:
  - type: "group" | "private" | "driver" | "package"
  - destination: string (destination ID)
  - search: string (search query)
  - featured: boolean
  - limit: number
  - offset: number
Response: Array<Tour>
Status: 200

GET /tours/:id
Response: Tour object
Status: 200, 404

POST /admin/tours
Headers: Authorization: Bearer ${token}
Body: Tour object (see data structure below)
Response: Created Tour
Status: 201, 400, 401

PUT /admin/tours/:id
Headers: Authorization: Bearer ${token}
Body: Tour object
Response: Updated Tour
Status: 200, 400, 401, 404

DELETE /admin/tours/:id
Headers: Authorization: Bearer ${token}
Response: 204 No Content
Status: 204, 401, 404
```

**Tour Object Structure:**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "price": 49,
  "duration": "8 часов",
  "type": "group",
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

#### Bookings

```
POST /bookings
Body: {
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "tourId": 1,
  "tourDate": "2024-12-25",
  "tourTime": "09:00",
  "adultCount": 2,
  "childCount": 1,
  "promoCode": "string (optional)",
  "specialRequests": "string (optional)"
}
Response: {
  "id": 123,
  "bookingNumber": "BK-2024-001",
  "status": "pending",
  "totalPrice": 123,
  "createdAt": "2024-12-01T10:00:00Z",
  ...bookingData
}
Status: 201, 400

GET /admin/bookings
Headers: Authorization: Bearer ${token}
Query: ?status=pending&tourId=1&limit=50&offset=0
Response: Array<Booking>
Status: 200, 401

PUT /admin/bookings/:id
Headers: Authorization: Bearer ${token}
Body: { "status": "confirmed" | "cancelled" | "pending", ... }
Response: Updated Booking
Status: 200, 400, 401, 404

DELETE /admin/bookings/:id
Headers: Authorization: Bearer ${token}
Response: 204 No Content
Status: 204, 401, 404
```

#### Reviews

```
POST /reviews
Body: {
  "reviewerName": "string",
  "reviewerEmail": "string",
  "reviewerLocation": "string (optional)",
  "tourId": 1,
  "rating": 5,
  "title": "string",
  "content": "string"
}
Response: {
  "id": 456,
  "approved": false,
  "createdAt": "2024-12-01T10:00:00Z",
  ...reviewData
}
Status: 201, 400

GET /reviews
Query: ?tourId=1&approved=true&limit=10
Response: Array<Review>
Status: 200

PUT /admin/reviews/:id
Headers: Authorization: Bearer ${token}
Body: { "approved": true, ... }
Response: Updated Review
Status: 200, 400, 401, 404

DELETE /admin/reviews/:id
Headers: Authorization: Bearer ${token}
Response: 204 No Content
Status: 204, 401, 404
```

#### Destinations

```
GET /destinations
Query: ?status=active&region=gobustan
Response: Array<Destination>
Status: 200

GET /destinations/:id
Response: Destination object
Status: 200, 404

POST /admin/destinations
Headers: Authorization: Bearer ${token}
Body: Destination object
Response: Created Destination
Status: 201, 400, 401

PUT /admin/destinations/:id
Headers: Authorization: Bearer ${token}
Body: Destination object
Response: Updated Destination
Status: 200, 400, 401, 404

DELETE /admin/destinations/:id
Headers: Authorization: Bearer ${token}
Response: 204 No Content
Status: 204, 401, 404
```

**Destination Object Structure:**
```json
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
  "status": "active"
}
```

#### Admin Dashboard

```
GET /admin/dashboard
Headers: Authorization: Bearer ${token}
Response: {
  "stats": {
    "totalTours": 50,
    "totalBookings": 1234,
    "pendingBookings": 12,
    "totalRevenue": 50000,
    "recentBookings": 5
  },
  "recentBookings": Array<Booking>,
  "recentReviews": Array<Review>
}
Status: 200, 401
```

---

## Authentication Flow

### Current Implementation

**Token Storage:**
- **File:** `src/js/services/api.service.js` (line 25-28)
- **Method:** `getAuthHeaders()` reads from `localStorage.getItem('authToken')`
- **Security Note:** Frontend expects backend to handle secure token storage (httpOnly cookies recommended)

**Token Usage:**
- All admin API calls automatically include `Authorization: Bearer ${token}` header
- Base service (`ApiService`) handles token injection (line 54-55 in `api.service.js`)

### Login Flow (Backend Must Implement)

**Frontend Expectation:**
1. User submits login form (backend must provide login page/endpoint)
2. Backend validates credentials
3. Backend returns token: `{ token: "jwt-token", user: {...} }`
4. Frontend stores token: `localStorage.setItem('authToken', token)` (or httpOnly cookie)
5. Subsequent requests include: `Authorization: Bearer ${token}`

**Token Validation:**
- Frontend calls `GET /auth/validate` on admin panel load (optional)
- Backend must return 401 if token invalid/expired
- Frontend redirects to login on 401 response

### CSRF Protection

**Frontend Expectation:**
- HTML contains: `<meta name="csrf-token" content="...">`
- Frontend reads via: `document.querySelector('meta[name="csrf-token"]')`
- Sends header: `X-CSRF-Token: ${token}` on POST/PUT/DELETE requests
- **File:** `src/js/pages/admin/admin-api.js` (line 25-30)

**Backend Must:**
- Generate CSRF token on page load
- Validate CSRF token on state-changing requests
- Return 403 if CSRF token invalid

---

## Admin Panel Integration

### Admin Service Methods

**File:** `src/js/services/admin.service.js`

All methods are currently stubbed. Uncomment API calls:

**Tours Management:**
- `getTours(filters)` → `GET /admin/tours`
- `createTour(tourData)` → `POST /admin/tours`
- `updateTour(id, tourData)` → `PUT /admin/tours/:id`
- `deleteTour(id)` → `DELETE /admin/tours/:id`

**Bookings Management:**
- `getBookings(filters)` → `GET /admin/bookings`
- `createBooking(bookingData)` → `POST /admin/bookings`
- `updateBooking(id, bookingData)` → `PUT /admin/bookings/:id`
- `deleteBooking(id)` → `DELETE /admin/bookings/:id`

**Customers Management:**
- `getCustomers(filters)` → `GET /admin/customers`
- `createCustomer(customerData)` → `POST /admin/customers`
- `updateCustomer(id, customerData)` → `PUT /admin/customers/:id`
- `deleteCustomer(id)` → `DELETE /admin/customers/:id`

**Reviews Management:**
- `getReviews(filters)` → `GET /admin/reviews`
- `updateReview(id, reviewData)` → `PUT /admin/reviews/:id`
- `deleteReview(id)` → `DELETE /admin/reviews/:id`

**Destinations Management:**
- `getDestinations(filters)` → `GET /admin/destinations`
- `createDestination(destinationData)` → `POST /admin/destinations`
- `updateDestination(id, destinationData)` → `PUT /admin/destinations/:id`
- `deleteDestination(id)` → `DELETE /admin/destinations/:id`

**Promo Codes Management:**
- `getPromoCodes(filters)` → `GET /admin/promo-codes`
- `createPromoCode(promoData)` → `POST /admin/promo-codes`
- `updatePromoCode(id, promoData)` → `PUT /admin/promo-codes/:id`
- `deletePromoCode(id)` → `DELETE /admin/promo-codes/:id`

**Dashboard:**
- `getDashboard()` → `GET /admin/dashboard`

### Admin Panel Trigger Points

**File:** `src/js/pages/admin/admin-crud.js`

**Create Operations:**
- Line 45-100: `createTour()` - Form submission triggers `adminService.createTour()`
- Line 150-200: `createBooking()` - Form submission triggers `adminService.createBooking()`
- Line 300-350: `createDestination()` - Form submission triggers `adminService.createDestination()`

**Update Operations:**
- Line 100-150: `updateTour()` - Edit button triggers `adminService.updateTour()`
- Line 200-250: `updateBooking()` - Status change triggers `adminService.updateBooking()`
- Line 350-400: `updateDestination()` - Edit button triggers `adminService.updateDestination()`

**Delete Operations:**
- Line 250-300: `deleteTour()` - Delete button triggers `adminService.deleteTour()`
- Line 400-450: `deleteBooking()` - Delete button triggers `adminService.deleteBooking()`
- Line 450-500: `deleteDestination()` - Delete button triggers `adminService.deleteDestination()`

**All operations call:**
```javascript
// Example from admin-crud.js
const result = await this.adminService.createTour(tourData);
if (result) {
    this.showSuccess('Tour created successfully');
    this.refreshToursList();
}
```

---

## Error Handling Expectations

### Error Response Format

**Backend must return:**
```json
{
  "message": "Error description",
  "error": {
    "message": "Detailed error",
    "code": "ERROR_CODE",
    "field": "fieldName (for validation errors)"
  }
}
```

**Or simple format:**
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

- **200** - Success (GET, PUT)
- **201** - Created (POST)
- **204** - No Content (DELETE)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (CSRF invalid, insufficient permissions)
- **404** - Not Found
- **500** - Server Error

### Frontend Error Handling

**File:** `src/js/services/api.service.js` (line 77-96)

**Error Processing:**
```javascript
// Frontend automatically extracts error message
if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, errorData.message || errorData.error?.message || 'Request failed', errorData);
}
```

**Frontend displays:**
- User-friendly message from `errorData.message`
- Validation errors per field (if `error.field` present)
- Generic message if no specific error provided

**Success Response:**
- Must return JSON (except 204 No Content)
- Must match expected data structure
- Must include all required fields (see data structures above)

---

## Status & Visibility Logic

### Destinations

**Status Field:**
- `status: "active"` - Visible on explore page
- `status: "inactive"` - Hidden from explore page

**Filtering:**
- **File:** `src/js/pages/explore/destinations-renderer.js` (line 117-119)
- **Function:** `filterActiveDestinations()` only returns `status === "active"`

**Backend Must:**
- Return only active destinations for public endpoints: `GET /destinations?status=active`
- Admin can see all: `GET /admin/destinations` (no status filter)

### Tours

**Featured Field:**
- `featured: true` - Appears in homepage sliders
- `featured: false` - Only appears in all-tours page

**Type Field:**
- Must be exactly: `"group"`, `"private"`, `"driver"`, or `"package"`
- Used for filtering on all-tours page

**Backend Must:**
- Support `?featured=true` query parameter
- Support `?type=group` query parameter
- Return tours matching both criteria

### Reviews

**Approved Field:**
- `approved: false` - Hidden from public (pending moderation)
- `approved: true` - Visible on tour pages

**Backend Must:**
- Default new reviews to `approved: false`
- Only return `approved: true` reviews for public: `GET /reviews?approved=true`
- Admin can see all: `GET /admin/reviews` (no approved filter)

### Bookings

**Status Field:**
- `status: "pending"` - New booking, awaiting confirmation
- `status: "confirmed"` - Booking confirmed
- `status: "cancelled"` - Booking cancelled

**Backend Must:**
- Default new bookings to `status: "pending"`
- Support filtering: `GET /admin/bookings?status=pending`

---

## What Backend Must NOT Change

### DOM Structure

**Do NOT modify:**
- HTML element IDs (used by JavaScript selectors)
- CSS class names (used for styling and JavaScript)
- Data attributes (e.g., `data-tour-id`, `data-booking-id`)

**Example - Booking Modal:**
```html
<!-- DO NOT CHANGE these IDs -->
<form id="bookingForm">
    <input id="customerName" ...>
    <input id="customerEmail" ...>
    <button id="submitBooking" ...>
</form>
```

### Data Keys

**Tour Object - Required Keys:**
- `id`, `title`, `description`, `price`, `duration`, `type`, `image`, `link`
- **Do NOT rename or remove these keys**

**Destination Object - Required Keys:**
- `id`, `name`, `shortDescription`, `image`, `url`, `status`
- **Do NOT rename or remove these keys**

**Booking Object - Required Keys:**
- `id`, `customerName`, `customerEmail`, `customerPhone`, `tourId`, `tourDate`
- **Do NOT rename or remove these keys**

### Routes

**Static Page Routes (Must Exist):**
- `/index.html` - Homepage
- `/explore.html` - Explore destinations
- `/all-tours.html` - All tours listing
- `/admin.html` - Admin panel
- `/destinations/html-pages/*.html` - Destination detail pages
- `/page/*/*.html` - Tour detail pages

**API Routes:**
- Must match exactly as defined in `src/js/config/api.config.js`
- Base URL configurable, but endpoint paths are fixed

### Image Paths

**Current Format:**
- Relative paths: `src/assets/img/tour-images/...`
- **Backend can return:**
  - Same relative paths (preferred)
  - Full URLs: `https://cdn.example.com/images/...`

**Do NOT:**
- Change image path structure without updating frontend
- Remove image field from responses

---

## Step-by-Step Integration Plan

### Phase 1: API Configuration

1. **Set API Base URL**
   - Edit `src/js/config/env.js` or set `window.ENV` in HTML:
   ```javascript
   window.ENV = {
       API_BASE_URL: 'https://api.example.com/api',
       API_TIMEOUT: 30000
   };
   ```

2. **Verify CORS**
   - Backend must allow frontend origin
   - Headers: `Access-Control-Allow-Origin: https://frontend-domain.com`

### Phase 2: Public Endpoints (Tours & Destinations)

1. **Enable Tours Service**
   - Edit `src/js/services/tours.service.js`
   - Uncomment lines 31, 44, 58
   - Remove `Promise.resolve([])` returns

2. **Replace JSON Imports**
   - Edit `src/js/pages/home/home-sliders.js`
     - Replace import (line 8)
     - Replace function calls (lines 86, 98, 106, 139)
   - Edit `src/js/pages/all-tours-page/all-tours.js`
     - Replace import (line 9)
     - Replace function call (line 21)
   - Edit `src/js/pages/tour/recommended-tours.js`
     - Replace import and function calls

3. **Enable Destinations Service**
   - Edit `src/js/services/destinations.service.js`
   - Uncomment line 27
   - Remove `Promise.resolve([])` return

4. **Update Destinations Renderer**
   - Edit `src/js/pages/explore/destinations-renderer.js`
   - Replace `fetchDestinations()` function (lines 97-109)
   - Add import for `DestinationsService`

5. **Test:**
   - Homepage sliders load tours from API
   - All-tours page loads tours from API
   - Explore page loads destinations from API

### Phase 3: Booking & Review Submission

1. **Enable Bookings Service**
   - Edit `src/js/services/bookings.service.js`
   - Uncomment line 31 in `createBooking()`
   - Remove localStorage code (lines 35-41)

2. **Enable Reviews Service**
   - Edit `src/js/services/reviews.service.js`
   - Uncomment line 30 in `createReview()`
   - Remove localStorage code (lines 34-41)

3. **Test:**
   - Booking form submits to API
   - Review form submits to API
   - Success/error messages display correctly

### Phase 4: Authentication

1. **Implement Login Endpoint**
   - Backend: `POST /auth/login`
   - Returns: `{ token: "...", user: {...} }`

2. **Store Token (Frontend)**
   - After login: `localStorage.setItem('authToken', token)`
   - Or use httpOnly cookies (backend sets cookie)

3. **Token Validation**
   - Backend: `GET /auth/validate`
   - Returns: `{ valid: boolean, user: {...} }`

4. **Test:**
   - Login works
   - Token persists
   - Protected routes require token

### Phase 5: Admin Panel

1. **Enable Admin Service**
   - Edit `src/js/services/admin.service.js`
   - Uncomment all API calls (lines 21, 27, 33, 39, etc.)
   - Remove all `Promise.resolve([])` returns

2. **Test Each Admin Section:**
   - Dashboard loads stats
   - Tours CRUD works
   - Bookings management works
   - Reviews approval works
   - Destinations CRUD works
   - Promo codes CRUD works

### Phase 6: Error Handling & Edge Cases

1. **Test Error Scenarios:**
   - Invalid token → 401 → redirect to login
   - Validation errors → 400 → display field errors
   - Not found → 404 → display "not found" message
   - Server error → 500 → display generic error

2. **Test Status Filtering:**
   - Only active destinations show on explore page
   - Only approved reviews show publicly
   - Featured tours show on homepage

3. **Test Pagination & Filtering:**
   - Tours filter by type correctly
   - Tours filter by destination correctly
   - Search works correctly

### Phase 7: Cleanup

1. **Remove Mock Data:**
   - Delete or archive `src/js/pages/admin/admin-data.js`
   - Remove JSON fallback comments from service files

2. **Remove JSON Files (Optional):**
   - Archive `/data/tours.json` (keep for reference)
   - Archive `/data/destinations.json` (keep for reference)

3. **Update Documentation:**
   - Mark integration complete
   - Document any custom endpoints or deviations

---

## Testing Checklist

### Public Endpoints
- [ ] Tours load on homepage sliders
- [ ] Tours load on all-tours page
- [ ] Tours filter by type correctly
- [ ] Tours search works
- [ ] Destinations load on explore page
- [ ] Only active destinations show
- [ ] Tour detail pages load correctly

### Booking Flow
- [ ] Booking form validates correctly
- [ ] Booking submits to API
- [ ] Success message displays
- [ ] Error handling works
- [ ] Promo code validation (if implemented)

### Review Flow
- [ ] Review form validates correctly
- [ ] Review submits to API
- [ ] Success message displays
- [ ] Only approved reviews show publicly

### Authentication
- [ ] Login works
- [ ] Token stored correctly
- [ ] Token sent in headers
- [ ] Invalid token → 401 → redirect
- [ ] Logout works

### Admin Panel
- [ ] Dashboard loads stats
- [ ] Tours: Create, Read, Update, Delete
- [ ] Bookings: View, Update status, Delete
- [ ] Reviews: View, Approve/Reject, Delete
- [ ] Destinations: Create, Read, Update, Delete
- [ ] Promo Codes: Create, Read, Update, Delete
- [ ] All operations require authentication

### Error Handling
- [ ] 400 errors display validation messages
- [ ] 401 errors redirect to login
- [ ] 404 errors display "not found"
- [ ] 500 errors display generic message
- [ ] Network errors handled gracefully

---

## Support

For questions about frontend integration points, refer to:
- `README.md` - General frontend architecture
- `src/js/config/api.config.js` - Endpoint definitions
- Service files in `src/js/services/` - API call locations


