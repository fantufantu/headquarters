import type { NavigationItem } from "musae/types/bench";
import { useMemo } from "react";
import { useAppConfig } from "../../contexts/app-config.context";
import { RESOURCE_CODE } from "../../constants/authorization";

/**
 * 用户侧边可见菜单
 *
 * 1. 增加用户权限鉴权
 */
export const useNavigations = () => {
  const { authorizations } = useAppConfig();

  return useMemo<NavigationItem[]>(() => {
    return [
      {
        path: "/",
        label: "Dashboard",
      },
      {
        path: "/articles",
        label: "文章管理",
        resourceCode: RESOURCE_CODE.ARTICLE,
      },
      {
        path: "/categories",
        label: "分类管理",
        resourceCode: RESOURCE_CODE.CATEGORY,
      },
      {
        path: "/resume-templates",
        label: "简历模板管理",
        resourceCode: RESOURCE_CODE.RESUME_TEMPLATE,
      },
      {
        path: "/issues",
        label: "反馈管理",
        resourceCode: RESOURCE_CODE.ISSUE,
      },
    ].filter(
      ({ resourceCode }) =>
        !resourceCode ||
        authorizations.some((authorization) => authorization.resourceCode === resourceCode),
    );
  }, []);
};
