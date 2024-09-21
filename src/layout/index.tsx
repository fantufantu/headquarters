import { Bench } from 'musae'
import { useNavigations } from './hooks'
import { Outlet, redirect, useNavigate, useResolvedPath } from '@aiszlab/bee/router'
import { store } from '../storage'

const Layout = () => {
  const navigations = useNavigations()
  const pathname = useResolvedPath(window.location.pathname)
  const navigate = useNavigate()

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
    >
      <Outlet />
    </Bench>
  )
}

export default Layout

export const loader = () => {
  const me = store.getState().authentication.me

  if (!me) {
    return redirect('/sign-up')
  }

  return null
}
