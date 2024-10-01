import { FileImage, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthentication } from "../context/AuthenticationContext";
import { isStrongPassword, isValidEmail } from "../utils/ValidationUtils";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null); // State to hold the file URL

  const {
    signUpUserWithEmailAndPassword,
    displayName,
    setDisplayName,
    setFile,
    file,
    currentUser,
    signInWithGoogle,
  } = useAuthentication();
  const navigate = useNavigate();

  // Handle input change dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const emptyFields = [];
    if (!formData.email) emptyFields.push("Email");
    if (!formData.password) emptyFields.push("Password");
    if (!displayName) emptyFields.push("User Name");
    if (!file) emptyFields.push("Upload Image");

    // Show error message for empty fields
    if (emptyFields.length > 0) {
      const errorMessage = `Please fill in the following fields: ${emptyFields.join(
        ", "
      )}`;
      toast.error(errorMessage);
      return; // Stop further execution if there are empty fields
    }

    // Validate email
    const emailError = isValidEmail(formData.email);
    if (emailError) {
      toast.error(emailError); // Show specific email error
      return; // Stop further execution if there's an email error
    }

    // Validate password
    const passwordError = isStrongPassword(formData.password);
    if (passwordError) {
      toast.error(passwordError); // Show specific password error
      return; // Stop further execution if there's a password error
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Don't math the password");
    }

    try {
      setIsLoading(true);
      await signUpUserWithEmailAndPassword(formData.email, formData.password);
      setFormData({ email: "", password: "" });
      setDisplayName("");
      setFile(null);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile); // Create a URL for the selected file
      setFileUrl(url);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <section className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8 min-h-screen">
      <form className="flex flex-col gap-4 p-8 w-full max-w-md bg-gray-900 rounded-2xl shadow-xl">
        <h2 className="text-center text-2xl font-bold leading-tight text-white">
          Sign up to your account
        </h2>
        <div className="flex flex-col items-center">
          {fileUrl ? (
            <img
              src={fileUrl}
              alt="Uploaded"
              className="mt-4 w-[120px] h-[80px] object-cover rounded-md shadow-lg auth-image"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
              <User className="w-12 h-12" />
            </div>
          )}
          <label className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700 transition duration-300 flex items-center gap-2">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <FileImage className="w-5 h-5" />
            Choose a file
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">
            Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="name"
              type="text"
              name="name"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter your Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="email"
              type="email"
              name="email"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="password"
              type="password"
              name="password"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-300"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className={`mt-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          } transition duration-300`}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-400">
          Have an account? Click below to sign in{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
        <div className="mt-6">
          <button
            onClick={handleSignInWithGoogle}
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </form>
    </section>
  );
};

export default RegisterForm;
