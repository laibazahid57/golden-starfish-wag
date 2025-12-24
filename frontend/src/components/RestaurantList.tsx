import React from "react";
import { useSearch } from "@/context/SearchContext";
import { Loader2, TriangleAlert, UtensilsCrossed } from "lucide-react"; // Added UtensilsCrossed
import RestaurantCard from "./RestaurantCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RestaurantList = () => {
  const { filteredRestaurants, loadingLocation, locationError } = useSearch();

  if (loadingLocation) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
        <p className="text-xl font-medium">Finding your location and nearby restaurants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {locationError && (
        <Alert variant="destructive" className="shadow-md">
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Location Error</AlertTitle>
          <AlertDescription className="text-base">
            {locationError}
            <p className="text-sm text-muted-foreground mt-2">Please ensure location services are enabled or try refreshing.</p>
          </AlertDescription>
        </Alert>
      )}

      {filteredRestaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground bg-card rounded-lg shadow-lg p-8">
          <UtensilsCrossed className="h-20 w-20 text-primary mb-6 opacity-70" />
          <p className="text-2xl font-bold mb-3 text-primary">No restaurants found matching your criteria.</p>
          <p className="text-lg text-muted-foreground max-w-md">Try adjusting your calorie or mileage filters to discover more options.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;