import { FaPlay } from "react-icons/fa";

const VideoPlayer = ({ thumbnail, onPlayClick }) => {
  return (
    <div
      className="relative w-full"
      style={{
        paddingTop: "56.25%",
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        aspectRatio: "16/9",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative cursor-pointer"
          onClick={onPlayClick} // Ensure this is called correctly
        >
          <div className="w-16 h-16 bg-[rgba(0,0,0,.7)] rounded-full flex items-center justify-center text-white font-bold text-xl">
            <FaPlay />
          </div>
          <div className="absolute inset-0 rounded-full bg-black opacity-30 pulse-animation"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
