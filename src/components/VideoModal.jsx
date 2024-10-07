import { AnimatePresence, motion } from "framer-motion";
import { FaX } from "react-icons/fa6";

const VideoModal = ({ modalData }) => {
  const { isModalOpen, handleCloseModal, selectedVideoKey } = modalData;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center items-center h-screen">
            <motion.div
              className="bg-white rounded-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-0 right-0"
                onClick={handleCloseModal}
              >
                <FaX className="flex justify-center items-center w-7 h-7 bg-[rgba(0,0,0,.7)] p-[6px] rounded-bl-lg" />
              </button>
              {selectedVideoKey && (
                <iframe
                  className="w-full h-[50vh]"
                  src={`https://www.youtube.com/embed/${selectedVideoKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
