"use client";

import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import CalorieFilter from '@/components/CalorieFilter';
import MileageFilter from '@/components/MileageFilter';
import RestaurantList from '@/components/RestaurantList';
// Removed: import { Toaster } from '@/components/ui/sonner'; // Using sonner for toasts
// Removed: import { ThemeToggle } from '@/components/ThemeToggle'; // Using the correct ThemeToggle component

const IndexPage = () => {
  const { userLocation, loadingLocation, locationError } = useSearch();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary mb-2">
          CalorieQuest
        </h1>
        <p className="text-lg text-muted-foreground">
          Find healthy fast-food options near you.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        {/* Current Location Display */}
        <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground mb-6">
          <MapPin className="h-5 w-5 text-primary" />
          {loadingLocation ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Getting your location...
            </span>
          ) : userLocation ? (
            <span>Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</span>
          ) : (
            <span>Location: Not available (using default)</span>
          )}
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl bg-card border border-border shadow-2xl max-w-3xl w-full mx-auto">
          <div className="flex-1 w-full">
            <CalorieFilter />
          </div>
          <div className="flex-1 w-full">
            <MileageFilter />
          </div>
        </div>

        {/* Restaurant List */}
        <RestaurantList />
      </main>

      {/* Removed: <ThemeToggle /> */}
      {/* Removed: <Toaster /> */}
    </div>
  );
};

export default IndexPage;