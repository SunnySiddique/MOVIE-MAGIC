import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthentication } from "../context/AuthenticationContext";
import { isValidEmail } from "../utils/ValidationUtils";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, loginInUserWithEmailAndPassword, currentUser } =
    useAuthentication();
  const navigate = useNavigate();

  // Handle input change dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update only the changed field
    });
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!formData.email) emptyFields.push("Email");
    if (!formData.password) emptyFields.push("Password");

    if (emptyFields.length > 0) {
      const errorMessage = `Please fill in the following fields: ${emptyFields.join(
        ", "
      )}`;
      toast.error(errorMessage);
      return;
    }

    const emailError = isValidEmail(formData.email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    try {
      setIsLoading(true);
      await loginInUserWithEmailAndPassword(formData.email, formData.password);

      toast.success(
        "Successfully logged in! Enjoy your experience and check out your profile."
      );
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-credential") {
        toast.error(
          "Please check your email format and ensure your password is correct."
        );
      } else if (error.code === "auth/user-not-found") {
        toast.error(
          "No user found with this email. Please check the email you entered."
        );
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Error logging in: " + error.message);
      }
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

  return (
    <section className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8 min-h-screen">
      <form className="flex flex-col gap-4 p-8 w-full max-w-md bg-gray-900 rounded-2xl shadow-xl">
        <h2 className="text-center text-2xl font-bold leading-tight text-white">
          Sign in to your account
        </h2>

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

        <button
          onClick={handleSubmit}
          type="submit"
          className={`mt-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          } transition duration-300`}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-400">
          New here? Click below to sign up{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
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

export default LoginForm;
