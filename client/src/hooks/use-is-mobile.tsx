import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is a mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initially
    checkMobile();

    // Listen for window resize events
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}

/**
 * Utility function to check if the current device is a mobile device
 * This is exported as a standalone function that can be used outside of React components
 */
export const isMobile = (): boolean => {
  // Simple check based on screen width
  // This is for use in imports - the hook should be preferred within components
  return typeof window !== "undefined" && window.innerWidth <= 768;
};