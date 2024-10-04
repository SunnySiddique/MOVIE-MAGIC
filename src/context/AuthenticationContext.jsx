import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { firebaseAuth, googleProvider, storage } from "../../Firebase";

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
      toast.success("User successfully registered!");

      if (file) {
        const storageRef = ref(storage, `users/${res.user.uid}/profilePicture`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle progress (optional)
          },
          (error) => {
            console.log(error);
            toast.error("Error uploading file");
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
              setCurrentUser({ ...res.user, photoURL: downloadURL });
            } catch (error) {
              console.log(error);
              toast.error("Error updating profile");
            }
          }
        );
      } else {
        await updateProfile(res.user, { displayName });
        setCurrentUser({ ...res.user, displayName });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists! Kindly use a different email.");
      }
      console.error("Error during sign up:", error.message);
      setLoading(false);
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
