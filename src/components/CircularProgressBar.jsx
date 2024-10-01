const CircularProgressBar = ({ percentage }) => {
  const getBarColor = () => {
    if (percentage === 100) return "#f100f9";
    if (percentage >= 70) return "#21d07a";
    if (percentage >= 50) return "#d2d531";
    return "#db2360";
  };

  // Calculate the circumference of the circle
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center w-12 h-12">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#423d0f"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="50%" cy="50%" r={radius} fill="#0a0f19" />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={getBarColor()}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          className="transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-white text-[12px] font-bold flex items-center justify-center">
        {percentage}
      </div>
    </div>
  );
};

export default CircularProgressBar;
