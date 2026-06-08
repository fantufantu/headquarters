import type { NavigationItem } from "musae/types/bench";
import { useMemo } from "react";
import { RESOURCE_CODES } from "../../../constants/authorization";
import { useAuthorizationContext } from "@/contexts/authorization";
import { isAuthorized } from "@/utils/authorization";

/**
 * 用户侧边可见菜单
 *
 * 1. 增加用户权限鉴权
 */
export const useNavigations = () => {
  const { authorized } = useAuthorizationContext();

  return useMemo<NavigationItem[]>(() => {
    return [
      {
        path: "/",
        label: "Dashboard",
      },
      {
        path: "/articles",
        label: "文章管理",
        resourceCode: RESOURCE_CODES.ARTICLE,
      },
      {
        path: "/categories",
        label: "分类管理",
        resourceCode: RESOURCE_CODES.CATEGORY,
      },
      {
        path: "/issues",
        label: "反馈管理",
        resourceCode: RESOURCE_CODES.ISSUE,
      },
      {
        path: "/authorizations",
        label: "权限管理",
        resourceCode: RESOURCE_CODES.AUTHORIZATION,
      },
      {
        path: "/roles",
        label: "角色管理",
        resourceCode: RESOURCE_CODES.ROLE,
      },
      {
        path: "/users",
        label: "用户管理",
        resourceCode: RESOURCE_CODES.USER,
      },
      {
        path: "/resume-templates",
        label: "简历模板管理",
        resourceCode: RESOURCE_CODES.RESUME_TEMPLATE,
      },
      {
        path: "/cities",
        label: "城市管理",
        resourceCode: RESOURCE_CODES.CITY,
      },
      {
        path: "/attractions",
        label: "景点管理",
        resourceCode: RESOURCE_CODES.ATTRACTION,
      },
    ].filter(({ resourceCode }) => !resourceCode || isAuthorized(authorized, { resourceCode }));
  }, []);
};
