import { motion } from "framer-motion";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAPI } from "../context/APIContext";

export default function FullBackdropsImagesInfo({ backdropsData }) {
  const { imageUrl } = useAPI();
  const handleOpen = () => window.open(imageUrl + backdropsData?.file_path);
  const [icon, setIcon] = useState(false);
  const [DisIcon, setDisIcon] = useState(false);

  const handleRated = () => {
    toast.success("The image has been rated successfully.");
    setIcon((prev) => !prev);
  };
  const handleDisRated = () => {
    toast.success("The image has been rated successfully.");
    setDisIcon((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-full md:max-w-full lg:max-w-[15rem] mx-auto bg-white rounded-lg overflow-hidden   shadow-lg hover:shadow-2xl"
    >
      <div className="relative aspect-[16/9] group">
        <img
          src={imageUrl + backdropsData?.file_path}
          alt="Backdrop scene"
          className="w-full h-full object-cover max-w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 w-full flex justify-center items-center space-x-4">
          <div className="flex space-x-4 items-center justify-between w-full p-4 opacity-0 group-hover:opacity-100 group-hover:bg-[rgba(255,255,255,.7)] transition-opacity duration-300 ">
            <button className="text-black" onClick={handleRated}>
              {icon ? (
                <BiSolidLike className="w-4 h-4" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
            </button>
            <button className="text-black" onClick={handleDisRated}>
              {DisIcon ? (
                <BiSolidDislike className="w-4 h-4" />
              ) : (
                <ThumbsDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="p-[14px] border border-gray-300">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
          <span className="text-md font-semibold text-gray-800">Info</span>
          <FaLock className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-6">
          <InfoItem label="Added By" value="Lord-of-TV" />
          <InfoItem
            label="Size"
            value={`${backdropsData.width}x${backdropsData.height}`}
            handleOpen={handleOpen}
          />
          <div>
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Language
            </label>
            <div className="relative">
              <select
                id="language-select"
                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 pr-8 text-gray-700 cursor-pointer focus:outline-none appearance-none"
              >
                <option>No Language</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({ label, value, handleOpen }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span
        className="text-sm text-gray-800 font-semibold cursor-pointer hover:underline"
        onClick={handleOpen}
      >
        {value}✓
      </span>
    </div>
  );
}
