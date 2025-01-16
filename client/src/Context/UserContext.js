import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
export const UserContext = createContext();

// UserProvider Component to Provide Context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data here
  const [token, setToken] = useState(localStorage.getItem("authToken")); // Store token here (use localStorage or secure method)

  useEffect(() => {
    // Fetch user data if token exists and it's changed
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Required to specify the type of data
              },
            }
          );
          const { user } = response.data; // Destructure the response to get token and user data
          setUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null); // Reset if there's an error
        }
      };

      fetchUser();
    } else {
      setUser(null);
    }
  }, []); // Refetch when the token changes

  const login = (token, user) => {
    localStorage.setItem("authToken", token);
    setUser(user);
  };

  const setIsConnected = async (isConnected) => {
    const token = localStorage.getItem("authToken");
    try {
      if (token) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/setIsConnected`,
          { isConnected: isConnected },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Required to specify the type of data
            },
          }
        );
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // setUser(null); // Reset if there's an error
    }
  };

  const logout = async () => {
    try {
      const response = await setIsConnected(false);
      const { user } = response.data; // Destructure the response to get token and user data
      if (user) {
        localStorage.removeItem("authToken");
        setUser(null);
      }
    } catch (err) {
      console.log("log out failed");
    }
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, setIsConnected, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);
