import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import Loader from "./components/loader/Loader";
import OfflineNotification from "./components/OfflineNotification";
import Content from "./routes/Content";

const App = () => {
  const location = useLocation(); // Get current path

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 7000); // auto-hide after 5 seconds
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearTimeout(loadingTimeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const closeNotification = () => setShowNotification(false);

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
      {showNotification && (
        <OfflineNotification
          isOnline={isOnline}
          closeNotification={closeNotification}
        />
      )}
      {isOnline && (
        <div className="mb-24 md:mb-0">
          <Content isLoading={setIsLoading} />
        </div>
      )}
    </div>
  );
};

export default App;
