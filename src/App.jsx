import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import Loader from "./components/loader/Loader";
import Content from "./routes/Content";

const App = () => {
  const location = useLocation(); // Get current path

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Set initial online status

  useEffect(() => {
    // Set loading state
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Initial check for online status
    if (!isOnline) {
      toast.error(
        "You're currently offline. Some features may not be available."
      );
    }

    const handleStatusChange = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);
      if (onlineStatus) {
        toast.success("You are back online! Enjoy browsing.");
      } else {
        toast.error(
          "You're currently offline. Some features may not be available."
        );
      }
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    // Cleanup event listeners and timeout
    return () => {
      clearTimeout(loadingTimeout);
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  if (
    isLoading &&
    location.pathname !== "/login" &&
    location.pathname !== "/register"
  ) {
    return <Loader />;
  }
  return (
    <div>
      <ToastContainer position="top-right" />
      {isOnline ? (
        <div className="mb-24 md:mb-0">
          <Content isLoading={setIsLoading} />
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 text-center">
          {`You're currently offline. Some features may not be available.`}
        </div>
      )}
    </div>
  );
};

export default App;
