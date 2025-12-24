# Backend Development Plan - CalorieQuest

## 1️⃣ Executive Summary
This project will build a robust, scalable backend for **CalorieQuest** using **FastAPI (Python 3.13)** and **MongoDB Atlas**. The system will replace the current frontend mock data with real, persistent data and handle geospatial searching and nutritional filtering server-side.

**Key Constraints & Decisions:**
- **Runtime:** Python 3.13 (Async FastAPI).
- **Database:** MongoDB Atlas (No local DB).
- **Deployment:** No Docker; direct execution.
- **Workflow:** Single branch (`main`), manual testing per task.
- **Scope:** strictly limited to features visible in the current SnapDev V2 frontend.

The development is divided into **3 Sprints (S0-S2)** to ensure a logical progression from environment setup to authentication and finally core search functionality.

---

## 2️⃣ In-Scope & Success Criteria

**In-Scope Features:**
- **System:** Health check & Database connection.
- **Auth:** Google Single Sign-On (SSO) & Guest Access (JWT-based).
- **Search:** Geospatial filtering (Radius/Mileage).
- **Filtering:** Menu item filtering by Calorie limit.
- **Data:** Display of Restaurants and filtered Menu Items.

**Success Criteria:**
- Frontend successfully authenticates users (Google) and guests.
- "Near Me" search returns valid restaurants from MongoDB based on lat/long.
- Calorie filter correctly removes non-compliant menu items from the response.
- All manual test steps pass in the frontend UI.
- Code is pushed to `main` after every sprint.

---

## 3️⃣ API Design

**Base Path:** `/api/v1`

### **System**
- `GET /healthz`
  - **Purpose:** Health check & DB ping.
  - **Response:** `{ "status": "ok", "db": "connected" }`

### **Authentication**
- `POST /auth/google`
  - **Purpose:** Exchange Google ID Token for App JWT. Creates User if new.
  - **Body:** `{ "token": "google_id_token" }`
  - **Response:** `{ "access_token": "jwt...", "token_type": "bearer", "user": { ... } }`
- `POST /auth/guest`
  - **Purpose:** Issue JWT for anonymous guest session.
  - **Body:** `{}`
  - **Response:** `{ "access_token": "jwt...", "token_type": "bearer", "user": { "isGuest": true, ... } }`
- `POST /auth/logout`
  - **Purpose:** Clear session (Client-side token removal primarily).
  - **Response:** `{ "message": "Logged out" }`

### **Restaurants**
- `GET /restaurants/search`
  - **Purpose:** Find restaurants near user, filtering menu items by calories.
  - **Query Params:** `lat` (float), `lng` (float), `mileage` (int, default 5), `max_calories` (int, optional).
  - **Response:** `[ { "restaurant_id": "...", "name": "...", "menu_items": [ ... ] } ]`
  - **Note:** Returns only restaurants with > 0 matching menu items.

---

## 4️⃣ Data Model (MongoDB Atlas)

### **Collection: `users`**
- `_id`: ObjectId
- `user_id`: String (UUID, unique)
- `email`: String (optional for guest)
- `google_id`: String (optional, index)
- `display_name`: String
- `is_guest`: Boolean
- `created_at`: DateTime
- **Example:**
  ```json
  {
    "user_id": "550e8400-e29b...",
    "email": "alex@gmail.com",
    "google_id": "102938...",
    "display_name": "Alex",
    "is_guest": false
  }
  ```

### **Collection: `restaurants`**
- `_id`: ObjectId
- `restaurant_id`: String (UUID, unique)
- `name`: String
- `location`: GeoJSON Point `{ type: "Point", coordinates: [lng, lat] }` (2dsphere index)
- `address`: String
- `menu_items`: Array of Objects (Embedded)
  - `menu_item_id`: String
  - `name`: String
  - `calories`: Integer
  - `description`: String
  - `nutrients`: Object (fat, carbs, etc.)
- **Example:**
  ```json
  {
    "name": "Burger King",
    "location": { "type": "Point", "coordinates": [-118.24, 34.05] },
    "menu_items": [
      { "name": "Whopper", "calories": 660 }
    ]
  }
  ```

---

## 5️⃣ Frontend Audit & Feature Map

| Component / Page | Feature | Backend Need | Auth |
|------------------|---------|--------------|------|
| `GoogleSignInButton.tsx` | Google Login | `POST /auth/google` | Public |
| `GuestSignInButton.tsx` | Guest Login | `POST /auth/guest` | Public |
| `UserMenu.tsx` | Logout | `POST /auth/logout` | Protected |
| `RestaurantList.tsx` | List Restaurants | `GET /restaurants/search` | Protected |
| `CalorieFilter.tsx` | Set Calorie Limit | Passed to Search API | Protected |
| `MileageFilter.tsx` | Set Distance | Passed to Search API | Protected |

---

## 6️⃣ Configuration & ENV Vars

- `APP_ENV`: `development`
- `PORT`: `8000`
- `MONGODB_URI`: `mongodb+srv://...` (Atlas Connection)
- `DB_NAME`: `caloriequest`
- `JWT_SECRET`: `...`
- `JWT_EXPIRES_IN`: `86400` (24h)
- `CORS_ORIGINS`: `http://localhost:5173`

---

## 7️⃣ Testing Strategy

- **Manual Verification Only:** No CI/CD or automated test suite required for this phase.
- **Process:**
  1.  Developer completes task.
  2.  Developer follows "Manual Test Step".
  3.  If Frontend UI behaves as expected → **Done**.
  4.  After Sprint objectives met → **Push to `main`**.

---

## 🔟 Dynamic Sprint Plan & Backlog

---

## 🧱 S0 – Environment Setup & Data Seeding

**Objectives:**
- Initialize FastAPI project.
- Connect to MongoDB Atlas.
- Seed database with the Mock Data from `mockData.ts` to ensure the app works immediately.
- Enable CORS.

**Tasks:**
- **Task 0.1: Project Init & Dependencies**
  - Create `requirements.txt` (fastapi, uvicorn, motor, pydantic, pydantic-settings, python-jose[cryptography], passlib, bcrypt).
  - Create `main.py` with `app` and CORS middleware.
  - **Manual Test:** Run `uvicorn main:app --reload`. Access `http://localhost:8000/docs`.
  - **User Test Prompt:** "Verify the backend server starts without errors."

- **Task 0.2: MongoDB Connection & Health Check**
  - Implement `AsyncIOMotorClient`.
  - Create `GET /healthz` endpoint that pings the DB.
  - **Manual Test:** Visit `/healthz` in browser. Expect `{"status": "ok", "db": "connected"}`.
  - **User Test Prompt:** "Check the health endpoint ensures DB connectivity."

- **Task 0.3: Data Seeding Script**
  - Extract data from `frontend/src/data/mockData.ts`.
  - Write a python script `seed_db.py` to insert this data into Atlas `restaurants` collection with correct GeoJSON format.
  - Create `2dsphere` index on `location`.
  - **Manual Test:** Run script. Check Atlas UI for data.
  - **User Test Prompt:** "Run the seed script and confirm data exists in MongoDB."

- **Task 0.4: Git Init**
  - Initialize git, add `.gitignore`, commit, set branch to `main`.
  - **Manual Test:** `git status` shows clean tree.

**Definition of Done:**
- Backend running, connected to Atlas, populated with initial data.

**Post-sprint:**
- Push to `main`.

---

## 🧩 S1 – Authentication (Google & Guest)

**Objectives:**
- Replace frontend mock auth with real JWT issuance.
- Support Google Sign-In verification.
- Support Anonymous Guest sessions.

**Tasks:**
- **Task 1.1: User Models & JWT Logic**
  - Define `User` model (Pydantic & DB).
  - Create `create_access_token` utility.
  - **Manual Test:** Unit test utility (print token to console).

- **Task 1.2: Guest Auth Endpoint**
  - Implement `POST /auth/guest`.
  - Creates/Returns a guest user token.
  - **Manual Test:** Curl POST to endpoint. Receive JWT. Decode to verify `is_guest: true`.
  - **User Test Prompt:** "Send a request to guest login and verify a token is returned."

- **Task 1.3: Google Auth Endpoint**
  - Implement `POST /auth/google`.
  - Accepting a dummy token for MVP (or validate if Google Client ID provided). *Note: For MVP Dev Plan, we will mock the strict Google Server Validation unless a Client ID is provided, but structure the endpoint to receive the token.*
  - **Manual Test:** Curl POST with dummy token. Receive JWT for "Google User".
  - **User Test Prompt:** "Simulate a Google login request and verify a user token is returned."

- **Task 1.4: Frontend Integration (Auth)**
  - Update `AuthContext.tsx` to fetch from real endpoints instead of setting local state directly.
  - **Manual Test:** Open App -> Click "Guest". Verify `token` in LocalStorage and redirection to Home.
  - **User Test Prompt:** "Click 'Continue as Guest' in the UI and confirm you are logged in."

**Definition of Done:**
- Users can log in via UI buttons and receive a persistent session token.

**Post-sprint:**
- Push to `main`.

---

## 🚀 S2 – Core Search & Filtering

**Objectives:**
- Implement "Near Me" geospatial search.
- Implement Calorie filtering on the server side.
- Connect Frontend `RestaurantList` to Backend.

**Tasks:**
- **Task 2.1: Geospatial Search Endpoint**
  - Implement `GET /restaurants/search`.
  - Use MongoDB `$near` or `$geoWithin` with `2dsphere` index.
  - Filter results by `mileage` (convert miles to meters).
  - **Manual Test:** Call API with lat/long close to Seed Data. Verify results. Call with far away lat/long. Verify empty.
  - **User Test Prompt:** "Query the search API with coordinates near the mock data and confirm results appear."

- **Task 2.2: Calorie Filtering Logic**
  - Enhance `GET /restaurants/search` to accept `max_calories`.
  - Python-side filtering: Iterate found restaurants, filter `menu_items` list.
  - Exclude restaurant if `filtered_menu_items` is empty.
  - **Manual Test:** Call API with `max_calories=200`. Verify no "Whoppers" (660 cal) are in the response.
  - **User Test Prompt:** "Query API with a low calorie limit and ensure high-calorie items are excluded."

- **Task 2.3: Frontend Integration (Search)**
  - Update `SearchContext.tsx` to call `GET /restaurants/search` with live `userLocation`, `calorieRange`, and `mileageRange`.
  - Remove local filtering logic (or keep as fallback, but prefer API).
  - **Manual Test:** Open App -> Allow Location -> See Restaurants. Change Calorie Filter -> See list update.
  - **User Test Prompt:** "Use the app filters (Mileage and Calories) and verify the restaurant list updates correctly via the Network tab."

**Definition of Done:**
- Full end-to-end functionality: Search -> API -> DB -> Filtered Response -> UI Display.

**Post-sprint:**
- Push to `main`.