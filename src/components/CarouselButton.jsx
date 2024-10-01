import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CarouselButton = ({
  direction,
  onClick,
  isVisible,
  top = "50%",
  transform = "translateY(-50%)",
}) => {
  if (!isVisible) return null; // Render nothing if not visible

  return (
    <div
      className={`absolute z-50 ${
        direction === "prev" ? "-left-6" : "-right-6"
      }`}
      style={{ top, transform }}
    >
      <motion.button
        className="bg-[rgba(18,18,18,0.45)] border border-white hover:bg-opacity-75 rounded-sm w-[55px] h-[70px] flex justify-center items-center text-[30px] group"
        initial={{ opacity: 0, x: direction === "prev" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction === "prev" ? -20 : 20 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {direction === "prev" ? (
          <FaChevronLeft className="text-white transition-all duration-300 group-hover:text-[rgb(245,197,24)]" />
        ) : (
          <FaChevronRight className="text-white transition-all duration-300 group-hover:text-[rgb(245,197,24)]" />
        )}
      </motion.button>
    </div>
  );
};

export default CarouselButton;
