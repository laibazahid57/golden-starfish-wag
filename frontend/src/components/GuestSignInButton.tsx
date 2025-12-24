"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface GuestSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GuestSignInButton: React.FC<GuestSignInButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-2 text-base shadow-sm hover:shadow-md transition-all duration-200"
    >
      <User className="h-5 w-5" />
      Continue as Guest
    </Button>
  );
};

export default GuestSignInButton;