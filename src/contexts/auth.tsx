import { createContext, ReactNode, useContext, useState } from "react";
import storageUtils from "../utils/localStorage";

interface AuthContextType {
  authState: UserWithToken | null;
  setAuthState: (x: UserWithToken) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const loggedUser = storageUtils.loadLoggedUser();

  const [authState, setAuthState] = useState(loggedUser);

  function setAuthInfo(newUser: UserWithToken) {
    storageUtils.saveLoggedUser(newUser);
    setAuthState(newUser);
  }

  function logout() {
    storageUtils.removeLoggedUser();
    setAuthState(null);
  }

  function isAuthenticated() {
    if (authState === null) {
      return false;
    }
    return new Date().getTime() / 1000 < authState.expiresAt;
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: (authInfo: UserWithToken) => setAuthInfo(authInfo),
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
