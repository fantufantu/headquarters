import type { NavigationItem } from 'musae/types/bench'
import { useMemo } from 'react'

/**
 * @description
 * 侧边栏导航数据
 */
export const useNavigations = () => {
  return useMemo<NavigationItem[]>(() => {
    return [
      {
        path: '/',
        label: 'Dashboard'
      },
      {
        path: '/articles',
        label: '文章管理'
      },
      {
        path: '/categories',
        label: '分类管理'
      },
      {
        path: '/issues',
        label: '反馈管理'
      }
    ]
  }, [])
}
