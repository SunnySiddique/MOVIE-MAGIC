const ErrorText = ({ msg, justifyCenter = "start", height = "" }) => {
  return (
    <>
      <div
        className="flex flex-col items-center mt-10"
        style={{ justifyContent: justifyCenter, height: height }}
      >
        <div className="flex items-center text-lg font-extrabold text-red-700 p-6 border-4 border-red-500 bg-red-200 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <span className="text-lg mr-2">❌</span>
          {msg}
        </div>
      </div>
    </>
  );
};

export default ErrorText;
