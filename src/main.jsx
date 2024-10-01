import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import APIProvider from "./context/APIContext.jsx";
import { AuthenticationProvider } from "./context/AuthenticationContext.jsx";
import "./index.css";

export const APIinstance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_MOVIE_APP_TOKEN}`, // Using the environment variable
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthenticationProvider>
      <APIProvider>
        <App />
      </APIProvider>
    </AuthenticationProvider>
  </BrowserRouter>
);
