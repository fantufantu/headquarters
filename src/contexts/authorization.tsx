import { useAuthentication } from "@/store/authentication.store";
import { createContext, type ReactNode, useContext, useMemo } from "react";

const AuthorizationContext = createContext<{
  authorized?: Map<string, Set<string>>;
}>({});

const AuthorizationContextProvider = ({ children }: { children: ReactNode }) => {
  const authorizations = useAuthentication().me?.authorizations;

  // 构建权限树
  const authorized = useMemo(() => {
    return (authorizations ?? []).reduce((prev, { resourceCode, actionCode }) => {
      const actions = prev.get(resourceCode) ?? new Set<string>();
      actions.add(actionCode);
      prev.set(resourceCode, actions);
      return prev;
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
