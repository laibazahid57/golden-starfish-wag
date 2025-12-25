import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Restaurant } from "@/types";
import { useGeolocation } from "@/hooks/use-geolocation";
import { mockRestaurants } from "@/data/mockData";

interface SearchContextType {
  calorieRange: number | null;
  setCalorieRange: (range: number | null) => void;
  mileageRange: number | null;
  setMileageRange: (range: number | null) => void;
  userLocation: { latitude: number; longitude: number; city?: string; country?: string } | null;
  filteredRestaurants: Restaurant[];
  loadingLocation: boolean;
  locationError: string | null;
  isUsingDefaultLocation: boolean;
  refreshLocation: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [calorieRange, setCalorieRange] = useState<number | null>(null);
  const [mileageRange, setMileageRange] = useState<number | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const {
    userLocation,
    loading: loadingLocation,
    error: locationError,
    isUsingDefault: isUsingDefaultLocation,
    refreshLocation
  } = useGeolocation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      // If we don't have a location yet, we can't search
      if (!userLocation) {
        return;
      }

      try {
        setApiError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append("lat", userLocation.latitude.toString());
        params.append("lng", userLocation.longitude.toString());
        
        // Handle mileage
        // Backend defaults to 5 miles if not provided. 
        // If mileageRange is null (Any), we send a large radius (e.g., 50 miles)
        if (mileageRange !== null) {
          params.append("mileage", mileageRange.toString());
        } else {
          params.append("mileage", "50");
        }

        // Handle calories
        if (calorieRange !== null) {
          params.append("max_calories", calorieRange.toString());
        }

        const response = await fetch(`http://localhost:8000/restaurants/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.length > 0) {
          setFilteredRestaurants(data);
        } else {
          // Fallback to mock data if no results found
          console.log("No restaurants found. Falling back to mock data.");
          let fallbackData = mockRestaurants;

          if (calorieRange !== null) {
            fallbackData = fallbackData.map(restaurant => ({
              ...restaurant,
              menu_items: restaurant.menu_items.filter(item => item.calories <= calorieRange)
            })).filter(restaurant => restaurant.menu_items.length > 0);
          }
          
          setFilteredRestaurants(fallbackData);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setApiError(err instanceof Error ? err.message : "Failed to fetch restaurants");
        
        // Fallback to mock data on error
        console.log("API Error. Falling back to mock data.");
        let fallbackData = mockRestaurants;

        if (calorieRange !== null) {
          fallbackData = fallbackData.map(restaurant => ({
            ...restaurant,
            menu_items: restaurant.menu_items.filter(item => item.calories <= calorieRange)
          })).filter(restaurant => restaurant.menu_items.length > 0);
        }
        
        setFilteredRestaurants(fallbackData);
      }
    };

    fetchRestaurants();
  }, [userLocation, mileageRange, calorieRange]);

  return (
    <SearchContext.Provider
      value={{
        calorieRange,
        setCalorieRange,
        mileageRange,
        setMileageRange,
        userLocation,
        filteredRestaurants,
        loadingLocation,
        locationError: locationError || apiError, // Combine location error with API error
        isUsingDefaultLocation,
        refreshLocation,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};