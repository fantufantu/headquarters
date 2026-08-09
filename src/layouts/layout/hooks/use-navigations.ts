import type { NavigationItem } from "musae/types/bench";
import { useMemo } from "react";
import { RESOURCE_CODES } from "../../../constants/authorization";
import { useAuthorizationContext } from "@/contexts/authorization";
import { isAuthorized } from "@/utils/authorization";

/**
 * 递归过滤需要授权的菜单项
 */
const filterAuthorized = <T extends { children?: T[]; resourceCode?: string }>(
  items: T[],
  authorized: ReturnType<typeof useAuthorizationContext>["authorized"],
): T[] => {
  return items
    .values()
    .map((item) => {
      if (item.children?.length) {
        return {
          ...item,
          children: filterAuthorized(item.children, authorized),
        };
      }

      return item;
    })
    .filter((item) => {
      // 无 resourceCode 的项始终可见
      return !item.resourceCode || isAuthorized(authorized, { resourceCode: item.resourceCode });
    })
    .toArray();
};

/**
 * 用户侧边可见菜单
 *
 * 1. 增加用户权限鉴权
 * 2. 支持嵌套子菜单递归鉴权
 */
export const useNavigations = () => {
  const { authorized } = useAuthorizationContext();

  return useMemo<NavigationItem[]>(() => {
    return filterAuthorized(
      [
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
          path: "",
          label: "旅游应用管理",
          children: [
            {
              path: "/districts",
              label: "行政区管理",
              resourceCode: RESOURCE_CODES.DISTRICT,
            },
            {
              path: "/attractions",
              label: "景点管理",
              resourceCode: RESOURCE_CODES.ATTRACTION,
            },
          ],
        },
      ],
      authorized,
    );
  }, []);
};
