import { useState, useEffect, useCallback } from "react";
import { showError } from "@/utils/toast";

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: 34.052235, // Los Angeles latitude
  longitude: -118.243683, // Los Angeles longitude
  city: "Los Angeles",
  country: "USA",
};

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDefault, setIsUsingDefault] = useState(false);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setIsUsingDefault(false);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setUserLocation(DEFAULT_LOCATION);
      setIsUsingDefault(true);
      setLoading(false);
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      let city: string | undefined;
      let country: string | undefined;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "User-Agent": "CalorieQuest/1.0",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb;
          country = data.address?.country;
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }

      setUserLocation({
        latitude,
        longitude,
        city,
        country,
      });
      setLoading(false);
      setIsUsingDefault(false);
    };

    const handleError = (geoError: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred while getting your location.";
      let isPermissionDenied = false;

      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = "Location access denied. Using default location.";
          isPermissionDenied = true;
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Using default location.";
          break;
        case geoError.TIMEOUT:
          errorMessage = "The request to get user location timed out. Using default location.";
          break;
      }
      
      setError(errorMessage);
      // Only show toast error if it's not just a simple permission denial (which the user explicitly chose)
      // or if we want to be persistent. For now, we show it to be clear.
      showError(errorMessage);
      
      setUserLocation(DEFAULT_LOCATION); // Fallback to default location
      setIsUsingDefault(true);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { userLocation, loading, error, isUsingDefault, refreshLocation: getLocation };
}