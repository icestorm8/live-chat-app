// import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Conversation from "./Pages/Conversation";
import LoginForm from "./Pages/Login";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import UserProfile from "./Pages/UserProfile";
import Home from "./Pages/Home";
import PageNotFound from "./Pages/PageNotFound";
import { UserContext, useUser } from "./Context/UserContext";
import { useContext, useEffect } from "react";

const App = () => {
  const user = useUser();
  const { setIsConnected, setUser } = useContext(UserContext);
  // Inactivity timeout
  let inactivityTimeout;

  // Function to start the inactivity timer
  const startInactivityTimer = () => {
    // Timeout to log out user after 15 minutes of inactivity
    inactivityTimeout = setTimeout(async () => {
      console.log("User is inactive for too long. Offline...");
      const res = await setIsConnected(false);
      const { user } = res.data;
      if (user) setUser(user);
    }, 900000); // 15 minutes -900000
  };

  // Reset inactivity timer
  const resetInactivityTimer = async () => {
    const res = await setIsConnected(true);
    const { user } = res.data;
    if (user) setUser(user);
    clearTimeout(inactivityTimeout);
    startInactivityTimer(); // Restart the inactivity timer on user activity
  };

  // Only start inactivity timer if the user is logged in
  useEffect(() => {
    if (user) {
      startInactivityTimer();
      // Add event listeners to reset inactivity timer on user activity
      window.addEventListener("mousemove", resetInactivityTimer);
      window.addEventListener("keydown", resetInactivityTimer);
    }

    // Cleanup on component unmount or when user logs out
    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, [user]); // Re-run effect whenever the user changes

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/chat/:id" element={<Conversation />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
