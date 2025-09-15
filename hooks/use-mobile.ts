import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false); // Default to false

  React.useEffect(() => {
    // This code will only run on the client, after the initial render
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set the initial value on the client
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []); // Empty dependency array ensures this runs only once on mount

  return isMobile;
}
