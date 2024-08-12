// import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../types/auth-user";

interface AuthContextProps {
  userDetails: User | null;
  setUserDetails: (newUser: User | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  userDetails: null,
  setUserDetails: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, setUserDetails_] = useState<User | null>(
    JSON.parse(localStorage.getItem("userDetails") || "null")
  );
  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails");
    }
  }, [userDetails]);

  const setUser = (newUser: User | null) => {
    setUserDetails_(newUser);
  };

  // Memoized value of the authentication context
  const contextValue = useMemo<AuthContextProps>(
    () => ({
      userDetails: userDetails,
      setUserDetails: setUser,
    }),
    [userDetails]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};

export default AuthProvider;
