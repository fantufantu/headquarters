import type { NavigationItem } from "musae/types/bench";
import { useMemo } from "react";
import { RESOURCE_CODES } from "../../constants/authorization";
import { useAuthentication } from "@/store/authentication";

/**
 * 用户侧边可见菜单
 *
 * 1. 增加用户权限鉴权
 */
export const useNavigations = () => {
  const authorizations = useAuthentication().me?.authorizations ?? [];

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
        path: "/resume-templates",
        label: "简历模板管理",
        resourceCode: RESOURCE_CODES.RESUME_TEMPLATE,
      },
      {
        path: "/issues",
        label: "反馈管理",
        resourceCode: RESOURCE_CODES.ISSUE,
      },
      {
        path: "/authorizations",
        label: "权限管理",
      },
      {
        path: "/roles",
        label: "角色管理",
      },
      {
        path: "/users",
        label: "用户管理",
      },
    ].filter(
      ({ resourceCode }) =>
        !resourceCode ||
        authorizations.some((authorization) => authorization.resourceCode === resourceCode),
    );
  }, []);
};
