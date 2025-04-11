import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import OfflineNotification from "./components/OfflineNotification";
import Content from "./routes/Content";

const App = () => {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {


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
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const closeNotification = () => setShowNotification(false);

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
        <div className="container mx-auto mb-24 md:mb-0">
          <Content  />
        </div>
      )}
    </div>
  );
};

export default App;
