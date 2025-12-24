"use client";

import React from 'react';

interface UserAvatarInitialProps {
  initial: string;
}

const UserAvatarInitial: React.FC<UserAvatarInitialProps> = ({ initial }) => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
      {initial}
    </div>
  );
};

export default UserAvatarInitial;