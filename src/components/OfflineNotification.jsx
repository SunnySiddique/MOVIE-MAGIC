import { motion } from "framer-motion"; // Import motion from framer-motion
import { Wifi, WifiOff, X } from "lucide-react";
import { useState } from "react";

const styles = `
  .notification-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 300px;
    width: 100%;
    font-family: Arial, sans-serif;
  }

  .notification {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
  }

  .notification.online {
    background-color: #4CAF50;
  }

  .notification.offline {
    background-color: #F44336;
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .notification-content {
    display: flex;
    align-items: center;
  }

  .notification-icon {
    margin-right: 12px;
  }

  .notification-text {
    color: white;
  }

  .notification-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 4px 0;
  }

  .notification-message {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .close-button:hover {
    opacity: 1;
  }
`;

export default function OfflineNotification({ isOnline, closeNotification }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false); // State to track if exiting

  // Animation variants for Framer Motion
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Handle close button click
  const handleClose = () => {
    setIsExiting(true); // Set exiting state to true
    setTimeout(() => {
      setIsVisible(false); // Hide notification after exit animation completes
      closeNotification(); // Call the passed closeNotification function
    }, 300); // Match this duration with the exit animation duration
  };

  return (
    <>
      <style>{styles}</style>
      {isVisible && (
        <motion.div
          className={`notification-container`}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }} // Adjust duration as needed
        >
          <div className={`notification ${isOnline ? "online" : "offline"}`}>
            <div className="notification-header">
              <div className="notification-content">
                <div className="notification-icon">
                  {isOnline ? (
                    <Wifi color="white" size={24} />
                  ) : (
                    <WifiOff color="white" size={24} />
                  )}
                </div>
                <div className="notification-text">
                  <h3 className="notification-title">
                    {isOnline ? "You're back online" : "You're offline"}
                  </h3>
                  <p className="notification-message">
                    {isOnline
                      ? "Your internet connection has been restored."
                      : "Please check your internet connection."}
                  </p>
                </div>
              </div>
              <button className="close-button" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
