import { Bench, Avatar, Popover, Menu } from 'musae'
import { useNavigations } from './hooks'
import { Outlet, useNavigate, useResolvedPath } from '@aiszlab/bee/router'
import { useSelector } from '../../hooks/storage.hooks'
import { useMutation } from '@apollo/client'
import { LOGOUT } from '../../api/authentication'
import { useCallback } from 'react'

const Layout = () => {
  const navigations = useNavigations()
  const pathname = useResolvedPath(window.location.pathname)
  const navigate = useNavigate()
  const _me = useSelector((_) => _.authentication.me)
  const [logout] = useMutation(LOGOUT)

  const onLogout = useCallback(async () => {
    await logout()
    window.location.reload()
  }, [logout])

  return (
    <Bench
      title='水番二土'
      layout='side'
      location={pathname.pathname}
      navigations={navigations}
      onNavigate={navigate}
      classNames={{
        main: 'px-10 pb-8'
      }}
      trailing={
        <Popover
          content={
            <div className='flex flex-col items-center gap-2'>
              <span>你好，{_me?.username}</span>
              <Menu
                items={[
                  {
                    label: '退出登录',
                    key: 'logout',
                    onClick: onLogout
                  }
                ]}
              />
            </div>
          }
        >
          <Avatar src={_me?.avatar} />
        </Popover>
      }
    >
      <Outlet />
    </Bench>
  )
}

export default Layout
