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
import { firebaseAuth, googleProvider, storage } from "../../firebase";

const AuthenticationContext = createContext(null);

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const signUpUserWithEmailAndPassword = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      if (file) {
        const storageRef = ref(storage, `users/${res.user.uid}/profilePicture`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.log(error);
            toast.error(error.message);
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
      }
      toast.success("Registration successful!");
    } catch (error) {
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
      uploadProgress,
    }),
    [currentUser, displayName, file, uploadProgress]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {!loading && children}
    </AuthenticationContext.Provider>
  );
};
