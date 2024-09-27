import { Bench } from 'musae'
import { useNavigations } from './hooks'
import { Outlet, useNavigate, useResolvedPath } from '@aiszlab/bee/router'

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
