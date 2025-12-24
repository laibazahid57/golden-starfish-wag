import { useState, useEffect } from "react";
import { showError } from "@/utils/toast";

interface UserLocation {
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: 34.052235, // Los Angeles latitude
  longitude: -118.243683, // Los Angeles longitude
};

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setUserLocation(DEFAULT_LOCATION);
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const handleError = (geoError: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred while getting your location.";
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = "Location access denied. Using default location.";
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Using default location.";
          break;
        case geoError.TIMEOUT:
          errorMessage = "The request to get user location timed out. Using default location.";
          break;
      }
      setError(errorMessage);
      showError(errorMessage);
      setUserLocation(DEFAULT_LOCATION); // Fallback to default location
      setLoading(false);
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  return { userLocation, loading, error };
}