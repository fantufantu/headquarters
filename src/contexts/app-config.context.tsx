import { useQuery } from "@apollo/client/react";
import { createContext, ReactNode, useContext } from "react";
import { Skeleton } from "musae";
import { Authorization } from "../api/authorization.types";
import { APP_CONFIG } from "@/api/app-config";
import { Who } from "@/api/user.types";

interface ContextValue {
  authorizations?: Authorization[];
  me?: Who;
}

const AppConfigContext = createContext<ContextValue>({});

interface Props {
  children: ReactNode;
}

const AppConfigProvider = ({ children }: Props) => {
  // 初始化用户权限
  const { data, loading } = useQuery(APP_CONFIG);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <AppConfigContext.Provider value={{ authorizations: data?.authorizedList, me: data?.whoAmI }}>
      {children}
    </AppConfigContext.Provider>
  );
};

const useAppConfig = () => {
  const { authorizations = [] } = useContext(AppConfigContext);

  return {
    authorizations,
  };
};

export { useAppConfig, AppConfigProvider };
