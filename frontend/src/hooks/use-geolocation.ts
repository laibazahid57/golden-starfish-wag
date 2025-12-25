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

    const handleError = async (geoError: GeolocationPositionError) => {
      let baseErrorMessage = "An unknown error occurred while getting your location.";

      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          baseErrorMessage = "Location access denied.";
          break;
        case geoError.POSITION_UNAVAILABLE:
          baseErrorMessage = "Location information is unavailable.";
          break;
        case geoError.TIMEOUT:
          baseErrorMessage = "The request to get user location timed out.";
          break;
      }

      console.warn(baseErrorMessage, "Attempting IP fallback...");

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setUserLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            country: data.country_name,
          });
          setLoading(false);
          setIsUsingDefault(false);
          return;
        }
      } catch (ipError) {
        console.error("IP fallback failed:", ipError);
      }
      
      const finalErrorMessage = `${baseErrorMessage} Using default location.`;
      setError(finalErrorMessage);
      // Only show toast error if it's not just a simple permission denial (which the user explicitly chose)
      // or if we want to be persistent. For now, we show it to be clear.
      showError(finalErrorMessage);
      
      setUserLocation(DEFAULT_LOCATION); // Fallback to default location
      setIsUsingDefault(true);
      setLoading(false);
    };

    // Try high accuracy first
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (error) => {
        // If permission is denied, don't bother trying again with low accuracy
        // as it will just be denied again.
        if (error.code === error.PERMISSION_DENIED) {
          handleError(error);
          return;
        }

        console.warn(`High accuracy geolocation failed (${error.message}), trying low accuracy...`);
        
        // Fallback to low accuracy
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          {
            enableHighAccuracy: false,
            timeout: 20000, // Longer timeout for low accuracy fallback
            maximumAge: 30000, // Accept cached positions up to 30 seconds old
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Short timeout for high accuracy attempt
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { userLocation, loading, error, isUsingDefault, refreshLocation: getLocation };
}