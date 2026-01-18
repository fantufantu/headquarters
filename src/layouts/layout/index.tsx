import { Bench, Avatar, Popover, Menu, useTheme, IconButton } from "musae";
import { useNavigations } from "./hooks";
import { Outlet, useNavigate, useResolvedPath } from "@aiszlab/bee/router";
import { useMutation } from "@apollo/client/react";
import { LOGOUT } from "../../api/authentication";
import { createElement, useCallback } from "react";
import { useAuthentication } from "../../store/authentication";
import { WbSunny, Bedtime } from "musae/icons";
import { AppConfigProvider } from "../../contexts/app-config.context";

const Layout = () => {
  const navigations = useNavigations();
  const pathname = useResolvedPath(window.location.pathname);
  const navigate = useNavigate();
  const { me } = useAuthentication();
  const [logout] = useMutation(LOGOUT);
  const { toggle, mode } = useTheme();

  const onLogout = useCallback(async () => {
    await logout();
    window.location.reload();
  }, [logout]);

  const toSetting = useCallback(() => {
    navigate("/setting");
  }, [navigate]);

  return (
    <AppConfigProvider>
      <Bench
        title="水番二土"
        layout="side"
        location={pathname.pathname}
        navigations={navigations}
        onNavigate={navigate}
        classNames={{
          main: "px-10 pb-8",
        }}
        trailing={
          <div className="flex gap-4">
            <IconButton onClick={toggle} variant="text" size="small">
              {createElement(mode === "light" ? Bedtime : WbSunny)}
            </IconButton>
            <Popover
              content={
                <div className="flex flex-col items-center gap-2">
                  <span>你好，{me?.nickname ?? me?.username}</span>
                  <Menu
                    items={[
                      {
                        label: "修改个人信息",
                        key: "edit",
                        onClick: toSetting,
                        className: "justify-center",
                      },
                      {
                        label: "退出登录",
                        key: "logout",
                        onClick: onLogout,
                        className: "justify-center",
                      },
                    ]}
                  />
                </div>
              }
            >
              <Avatar
                src={me?.avatar}
                crossOrigin="anonymous"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </Popover>
          </div>
        }
      >
        <Outlet />
      </Bench>
    </AppConfigProvider>
  );
};

export default Layout;
