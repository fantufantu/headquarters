import { Bench, Avatar } from 'musae'
import { useNavigations } from './hooks'
import { Outlet, useNavigate, useResolvedPath } from '@aiszlab/bee/router'
import { useSelector } from '../../hooks/storage.hooks'

const Layout = () => {
  const navigations = useNavigations()
  const pathname = useResolvedPath(window.location.pathname)
  const navigate = useNavigate()
  const _me = useSelector((_) => _.authentication.me)

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
          <Avatar src={_me?.avatar} />
        </>
      }
    >
      <Outlet />
    </Bench>
  )
}

export default Layout
