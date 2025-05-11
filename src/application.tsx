import { ConfigProvider, ThemeProvider } from "musae";
import { ApolloProvider } from "@apollo/client";
import { client } from "./api";
import { AuthenticationToken } from "./store/tokens";
import { useMounted } from "@aiszlab/relax";
import { useState } from "react";
import { useWho } from "./hooks/authentication.hooks";
import { type ApplicationProps } from "@aiszlab/bee";
import Placeholder from "./layouts/placeholder";

const Application = ({ children }: ApplicationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { whoAmI } = useWho();

  // 页面缓存中存在token，尝试换取用户信息
  // 再挂载页面内容
  useMounted(async () => {
    const _authenticated =
      globalThis.window.localStorage.getItem(
        AuthenticationToken.Authenticated
      ) ??
      globalThis.window.sessionStorage.getItem(
        AuthenticationToken.Authenticated
      );

    !!_authenticated && (await whoAmI(_authenticated));

    setIsLoading(false);
  });

  return (
    <ApolloProvider client={client}>
      <ConfigProvider>
        <ThemeProvider>
          {/* 页面主体内容 */}
          {!isLoading && children}
          {/* 保证体验：在应用初始化过程中，使用骨架屏代替主体内容 */}
          {isLoading && <Placeholder />}
        </ThemeProvider>
      </ConfigProvider>
    </ApolloProvider>
  );
};

export default Application;
