# Frontend Authentication Verification Guide

This guide outlines how to verify the integration of the Frontend AuthContext with the Backend Authentication Endpoints.

## Prerequisites

*   Ensure you have a terminal open for the Backend.
*   Ensure you have a terminal open for the Frontend.

## Step 1: Start the Backend

If the backend is not already running:

1.  Open a terminal.
2.  Navigate to the `backend` directory: `cd backend`
3.  Activate the virtual environment (if not active): `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Mac/Linux)
4.  Run the server: `uvicorn main:app --reload`
5.  Verify it's running by visiting: `http://localhost:8000/healthz` (Should return `{"status": "ok", "db": "connected"}`)

## Step 2: Start the Frontend

1.  Open a new terminal.
2.  Navigate to the `frontend` directory: `cd frontend`
3.  Install dependencies (if needed): `npm install`
4.  Start the development server: `npm run dev`
5.  Open the URL shown (usually `http://localhost:5173`) in your browser.

## Step 3: Verification Scenarios

### Scenario A: Guest Login

1.  Navigate to the Login page (if not already there).
2.  Open your browser's Developer Tools (F12) -> Application tab -> Local Storage.
3.  Click the **"Continue as Guest"** button.
4.  **Expected Result:**
    *   You should be redirected to the Home page.
    *   A "Continuing as guest" toast notification should appear.
    *   In Developer Tools -> Local Storage:
        *   `token`: Should contain a JWT string.
        *   `currentUser`: Should contain a JSON object with `is_guest: true`.
    *   The top-right User Menu should show a generic avatar.

### Scenario B: Mock Google Login

1.  Logout if currently logged in (Click Avatar -> Log out).
2.  Click the **"Sign in with Google"** button.
3.  **Expected Result:**
    *   You should be redirected to the Home page.
    *   A "Successfully signed in with Google!" toast notification should appear.
    *   In Developer Tools -> Local Storage:
        *   `token`: Should contain a JWT string.
        *   `currentUser`: Should contain a JSON object with `google_id: "mock-google-id-..."` and `is_guest: false`.
    *   The top-right User Menu should show "Google User" and the email "user@example.com".

### Scenario C: Logout

1.  While logged in, click the User Avatar in the top right.
2.  Click **"Log out"**.
3.  **Expected Result:**
    *   You should be redirected to the Auth/Login page.
    *   In Developer Tools -> Local Storage:
        *   `token` should be removed.
        *   `currentUser` should be removed.

## Troubleshooting

*   **CORS Errors:** If you see CORS errors in the browser console, ensure the Backend `main.py` has the correct `allow_origins` configured (should include `http://localhost:5173`).
*   **Backend Connection Refused:** Ensure the backend is running on port 8000.