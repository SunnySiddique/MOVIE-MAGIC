import { useState } from "react";
import VideoModal from "./VideoModal";
import VideoPlayer from "./VideoPlayer";

const FullVideosInfo = ({ videosData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(videosData.key);

  const handlePlayClick = (videoKey) => {
    setSelectedVideoKey(videoKey);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideoKey(null);
  };

  const modalData = {
    handleCloseModal,
    isModalOpen,
    selectedVideoKey,
  };

  return (
    <div className="">
      <VideoPlayer
        videoKey={videosData.key}
        thumbnail={`https://img.youtube.com/vi/${videosData.key}/hqdefault.jpg`}
        onPlayClick={() => handlePlayClick(videosData.key)} // Pass the key here
      />

      {/* Modal for playing video */}
      <VideoModal modalData={modalData} />
    </div>
  );
};

export default FullVideosInfo;
