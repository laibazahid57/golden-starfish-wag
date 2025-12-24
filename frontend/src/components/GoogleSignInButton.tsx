"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react"; // Using Chrome icon for Google

interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-2 text-base shadow-sm hover:shadow-md transition-all duration-200"
    >
      <Chrome className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;