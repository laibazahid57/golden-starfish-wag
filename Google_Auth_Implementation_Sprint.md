# Sprint: Google Sign-In Implementation

## Objective
Replace the current mock Google Sign-In implementation with the actual Google Identity Services integration using `@react-oauth/google`.

## Prerequisites
- [ ] User to provide valid Google Client ID.

## Tasks

### 1. Environment Configuration
- [ ] Add `VITE_GOOGLE_CLIENT_ID` to `frontend/.env`.
- [ ] Ensure `VITE_API_URL` is correctly set.

### 2. Dependency Installation
- [ ] Install the Google OAuth package in the frontend:
  ```bash
  cd frontend
  npm install @react-oauth/google
  ```

### 3. Frontend Integration
- [ ] **App Component Update (`frontend/src/App.tsx`):**
    - Import `GoogleOAuthProvider`.
    - Retrieve `clientId` from environment variables.
    - Wrap the application (or Auth routes) with `<GoogleOAuthProvider clientId={...}>`.
- [ ] **Sign-In Button Update (`frontend/src/components/GoogleSignInButton.tsx`):**
    - Use the `useGoogleLogin` hook from `@react-oauth/google`.
    - Implement the `onSuccess` callback to retrieve the `access_token` or `credential`.
    - Call the `login` function from `AuthContext`.
- [ ] **Auth Context Update (`frontend/src/context/AuthContext.tsx`):**
    - Ensure the `login` function accepts the token string.
    - Send the token to the backend endpoint `/auth/google`.

### 4. Backend Verification Logic
- [ ] **Update `backend/main.py` (endpoint `/auth/google`):**
    - Modify the `google_auth` function.
    - Remove or conditionalize the mock token check (`mock-google-token`).
    - Integrate with a library (like `google-auth-library` or `requests`) to verify the token with Google's servers (`https://www.googleapis.com/oauth2/v3/userinfo` or `tokeninfo`).
    - Extract the user's email and Google ID from the verification response.

### 5. Testing
- [ ] Verify flow: Click "Sign in with Google" -> Google Popup -> Select Account -> Backend Verification -> User Logged In.
- [ ] Handle error cases (popup closed, network error, invalid token).

## Estimated Timeline
- Frontend Implementation: 1-2 hours
- Backend Verification Logic: 1-2 hours
- Testing & Debugging: 1 hour