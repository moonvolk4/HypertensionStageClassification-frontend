import { HashRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/AlbumPage";
import ITunesPage from "./pages/ITunesPage";
import { ROUTES } from "../Routes";
import Navigation from "./components/Navigation";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import VacancyApplicationPage from "./pages/VacancyApplicationPage";
import RegisterPage from "./pages/RegisterPage";
import RecordsPage from "./pages/RecordsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <HashRouter>
    <Navigation />
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ALBUMS} element={<ITunesPage />} />
        <Route path={`${ROUTES.ALBUMS}/:id`} element={<AlbumPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.RECORDS} element={<RecordsPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={`${ROUTES.VACANCYAPPLICATION}/:app_id`} element={<VacancyApplicationPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;