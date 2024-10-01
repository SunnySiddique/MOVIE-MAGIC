import { Route, Routes } from "react-router-dom";
import AllReviews from "../components/AllReviews";
import AllVideosAndPosters from "../components/AllVideosAndPosters";
import DisplayAllSeason from "../components/DisplayAllSeason";
import FullCastCrewDisplay from "../components/FullCastAndCrewDisplay";
import LoginForm from "../components/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import RegisterForm from "../components/RegisterFrom";
import DetailPage from "../pages/DetailPage";
import ExplorePage from "../pages/ExplorePage";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Header from "../utils/Header";

const Content = ({ isLoading }) => {
  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/:explore" element={<ExplorePage />} />
        <Route path="/:explore/:id" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/fullCastAndCrew" element={<FullCastCrewDisplay />} />
        <Route path="/allSeasons" element={<DisplayAllSeason />} />
        <Route path="/allReviews" element={<AllReviews />} />
        <Route
          path="/allVideosAndPosters/:videoId"
          element={<AllVideosAndPosters />}
        />

        <Route path="/login" element={<LoginForm setALoading={isLoading} />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </div>
  );
};

export default Content;
