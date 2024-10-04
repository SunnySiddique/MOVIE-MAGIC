import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { firebaseAuth, googleProvider } from "../../Firebase";

const AuthenticationContext = createContext(null);

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const signUpUserWithEmailAndPassword = async (
    email,
    password,
    displayName
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      // Update the user's profile
      await updateProfile(res.user, { displayName });

      // Set the current user state
      setCurrentUser({ ...res.user, displayName });

      // Show a success message
      toast.success("Registration successful!");
    } catch (error) {
      console.error(error); // Log error for debugging

      // Handle specific error cases
      if (error.code === "auth/email-already-in-use") {
        toast.error(
          "This email is already in use. Please use a different email."
        );
      } else {
        toast.error("Error creating user: " + error.message);
      }
    }
  };

  const loginInUserWithEmailAndPassword = async (email, password) => {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logoutUser = async () => {
    await signOut(firebaseAuth);
    navigate("/");
  };

  const signInWithGoogle = () => {
    return signInWithPopup(firebaseAuth, googleProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      signUpUserWithEmailAndPassword,
      loginInUserWithEmailAndPassword,
      logoutUser,
      currentUser,
      signInWithGoogle,
      displayName,
      setDisplayName,
      setFile,
      file,
    }),
    [currentUser, displayName, file]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {!loading && children}
    </AuthenticationContext.Provider>
  );
};
