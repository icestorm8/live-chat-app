import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const UserContext = createContext();

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
  }, [localStorage.getItem("authToken")]); // Refetch when the token changes

  return (
    <UserContext.Provider value={{ user, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);
