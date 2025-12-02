import { HashRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/AlbumPage";
import ITunesPage from "./pages/ITunesPage";
import { ROUTES } from "../Routes";
import Navigation from "./components/Navigation";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <HashRouter>
    <Navigation />
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ALBUMS} element={<ITunesPage />} />
        <Route path={`${ROUTES.ALBUMS}/:id`} element={<AlbumPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;