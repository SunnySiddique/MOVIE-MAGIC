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
  const [fileUrl, setFileUrl] = useState(""); // For storing the uploaded file URL
  const [uploading, setUploading] = useState(false); // Change to boolean

  const navigate = useNavigate();

  const signUpUserWithEmailAndPassword = async (
    email,
    password,
    displayName
  ) => {
    setLoading(true); // Show "Processing" on the sign-up button

    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      toast.success("User successfully registered!");

      await updateProfile(res.user, {
        displayName,
        photoURL: fileUrl, // Use the uploaded file URL from state
      });
      setCurrentUser({ ...res.user, photoURL: fileUrl });
    } catch (error) {
      if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists! Kindly use a different email.");
      }
      console.error("Error during sign-up:", error.message);
    } finally {
      setLoading(false); // Hide "Processing" after everything is done
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setUploading(true); // Start uploading
      const url = URL.createObjectURL(selectedFile); // Create a URL for the selected file
      setFileUrl(url);

      const storageRef = ref(storage, `users/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.success(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error(error); // More detailed logging for debugging
          toast.error("Error uploading image");
          setUploading(false); // Set uploading to false on error
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFileUrl(downloadURL); // Store the uploaded file URL in state
            toast.success("Image uploaded successfully!");
          } catch (error) {
            console.error(error); // More detailed logging for debugging
            toast.error("Error getting image URL");
          } finally {
            setUploading(false); // Ensure uploading is set to false after process completes
          }
        }
      );
    }
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
      handleFileChange,
      signUpUserWithEmailAndPassword,
      loginInUserWithEmailAndPassword,
      logoutUser,
      currentUser,
      signInWithGoogle,
      displayName,
      setDisplayName,
      setFile,
      file,
      fileUrl,
      uploading,
    }),
    [currentUser, displayName, file, uploading] // Added uploading to dependencies
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {!loading && children}
    </AuthenticationContext.Provider>
  );
};
