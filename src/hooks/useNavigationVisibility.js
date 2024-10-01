// useNavigationVisibility.js
import { useEffect, useState } from "react";

const useNavigationVisibility = (breakpoint = 640) => {
  const [isNavigationEnabled, setNavigationEnabled] = useState(
    window.innerWidth >= breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setNavigationEnabled(window.innerWidth >= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isNavigationEnabled;
};

export default useNavigationVisibility;
