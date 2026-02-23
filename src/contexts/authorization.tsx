import { useAuthentication } from "@/store/authentication";
import { createContext, type ReactNode, useContext, useMemo } from "react";

const AuthorizationContext = createContext<{
  authorized?: Map<string, Set<string>>;
}>({});

const AuthorizationContextProvider = ({ children }: { children: ReactNode }) => {
  const authorizations = useAuthentication().me?.authorizations;

  // 构建权限树
  const authorized = useMemo(() => {
    return (authorizations ?? []).reduce((authorized, { resourceCode, actionCode }) => {
      const actions = authorized.get(resourceCode) ?? new Set<string>();
      actions.add(actionCode);
      authorized.set(resourceCode, actions);
      return authorized;
    }, new Map<string, Set<string>>());
  }, [authorizations]);

  return (
    <AuthorizationContext.Provider value={{ authorized }}>{children}</AuthorizationContext.Provider>
  );
};

const useAuthorizationContext = () => {
  return useContext(AuthorizationContext);
};

export { AuthorizationContextProvider, useAuthorizationContext };
