import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Items from "./pages/Items";
import POS from "./pages/POS";
import POSReport from "./pages/Laporan";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/404" && <Navbar />}
      <div className="container mx-auto p-4 ">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/items" element={<Items />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/laporan" element={<POSReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />{" "}
    </Router>
  );
};

export default App;
