import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import { AnimatePresence } from "framer-motion";
import Ai from "./pages/ai/Ai";
import { SidebarProvider } from "./context/SidebarContext";  // Import SidebarProvider

function App() {
  const location = useLocation();

  const pageTitles = {
    "/": "Home",
    "/about": "About | Aiden Brooks | CG MWT AUG 2024",
  };

  useEffect(() => {
    const currentTitle = pageTitles[location.pathname] || "Aiden Brooks";
    document.title = currentTitle;

    if (location.pathname !== "/archive") {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 700);
    }
  }, [location.pathname]);

  const hideNavbarAndFooter = location.pathname === "/ai";

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Wrap Ai component with SidebarProvider */}
          <Route path="/ai" element={<SidebarProvider><Ai /></SidebarProvider>} />
        </Routes>
      </AnimatePresence>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
