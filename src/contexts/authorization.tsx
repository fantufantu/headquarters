import { createContext } from "react";

const AuthorizationContext = createContext({});

const AuthorizationProvider = () => {
  return (
    <AuthorizationContext.Provider value={{}}>
      <></>
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContext;
