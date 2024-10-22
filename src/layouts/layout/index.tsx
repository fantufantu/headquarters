import { Bench, Avatar, Popover, Menu, useTheme, Button } from 'musae'
import { useNavigations } from './hooks'
import { Outlet, useNavigate, useResolvedPath } from '@aiszlab/bee/router'
import { useMutation } from '@apollo/client'
import { LOGOUT } from '../../api/authentication'
import { createElement, useCallback } from 'react'
import { useAuthentication } from '../../store/authentication'
import { WbSunny, Bedtime } from 'musae/icons'

const Layout = () => {
  const navigations = useNavigations()
  const pathname = useResolvedPath(window.location.pathname)
  const navigate = useNavigate()
  const { me } = useAuthentication()
  const [logout] = useMutation(LOGOUT)
  const { toggle, mode } = useTheme()

  const onLogout = useCallback(async () => {
    await logout()
    window.location.reload()
  }, [logout])

  const toSetting = useCallback(() => {
    navigate('/setting')
  }, [navigate])

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
        <>
          <Button onClick={toggle} variant='text' shape='circular'>
            {createElement(mode === 'light' ? Bedtime : WbSunny)}
          </Button>
          <Popover
            content={
              <div className='flex flex-col items-center gap-2'>
                <span>你好，{me?.nickname ?? me?.username}</span>
                <Menu
                  items={[
                    {
                      label: '修改个人信息',
                      key: 'edit',
                      onClick: toSetting,
                      className: 'justify-center'
                    },
                    {
                      label: '退出登录',
                      key: 'logout',
                      onClick: onLogout,
                      className: 'justify-center'
                    }
                  ]}
                />
              </div>
            }
          >
            <Avatar src={me?.avatar} crossOrigin='anonymous' referrerPolicy='strict-origin-when-cross-origin' />
          </Popover>
        </>
      }
    >
      <Outlet />
    </Bench>
  )
}

export default Layout
