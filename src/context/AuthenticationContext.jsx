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

  const navigate = useNavigate();

  const signUpUserWithEmailAndPassword = async (email, password, displayName) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      toast.success("User successfully registered!");

      await updateProfile(res.user, {
        displayName,
      });

      setCurrentUser({ ...res.user });
    } catch (error) {
      if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists! Kindly use a different email.");
      }
      console.error("Error during sign-up:", error.message);
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
    }),
    [currentUser, displayName]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {!loading && children}
    </AuthenticationContext.Provider>
  );
};
