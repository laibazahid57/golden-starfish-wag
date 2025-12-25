"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AuthProvider>
          <Routes>
          {/* Public-only route for authentication */}
          <Route path="/auth" element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          } />

          {/* Protected routes that require authentication and the main layout */}
          <Route element={
            <ProtectedRoute> {/* This ensures only authenticated users can access its children */}
              <SearchProvider>
                <MainLayout /> {/* MainLayout provides the header/footer */}
              </SearchProvider>
            </ProtectedRoute>
          }>
            <Route path="/" element={<Index />} /> {/* Now '/' is the main app content */}
            <Route path="/restaurant/:restaurantId" element={<RestaurantDetailPage />} />
          </Route>

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;