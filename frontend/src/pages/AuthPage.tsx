"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import GuestSignInButton from "@/components/GuestSignInButton";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuth(); // Use AuthContext functions

  const handleGoogleSignIn = async (token: string) => {
    console.log("Google Sign-In button clicked!");
    setLoading(true);
    await login(token); // Call AuthContext's login function
    console.log("Google Sign-In successful, navigating to /");
    navigate("/");
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    console.log("Guest Login button clicked!");
    setLoading(true);
    await continueAsGuest(); // Call AuthContext's continueAsGuest function
    console.log("Guest Login successful, navigating to /");
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border border-border">
        <CardHeader className="text-center p-6 pb-4">
          <CardTitle className="text-4xl font-extrabold text-primary mb-2">CalorieQuest</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Choose how you want to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            <GoogleSignInButton onSuccess={handleGoogleSignIn} disabled={loading} />
            <GuestSignInButton onClick={handleGuestLogin} disabled={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;