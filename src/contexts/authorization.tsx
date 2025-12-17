import { useQuery } from "@apollo/client/react";
import { createContext, ReactNode, useContext } from "react";
import { AUTHORIZED } from "../api/authorization";
import { Skeleton } from "musae";
import { Authorization } from "../api/authorization.types";

interface ContextValue {
  authorizations?: Authorization[];
}

const AuthorizationContext = createContext<ContextValue>({});

interface Props {
  children: ReactNode;
}

const AuthorizationProvider = ({ children }: Props) => {
  // 初始化用户权限
  const { data, loading } = useQuery(AUTHORIZED);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <AuthorizationContext.Provider value={{ authorizations: data?.authorized }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

const useAuthorization = () => {
  const { authorizations = [] } = useContext(AuthorizationContext);

  return {
    authorizations,
  };
};

export { useAuthorization, AuthorizationProvider };
