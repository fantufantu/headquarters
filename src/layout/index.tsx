import { lazy, Suspense } from 'react'
import { useTheme, Bench } from 'musae'
import { useNavigations } from './hooks'

const Outlet = lazy(() => import('@aiszlab/bee/router').then((router) => ({ default: router.Outlet })))

const Layout = () => {
  const theme = useTheme()
  const navigations = useNavigations()

  return (
    <Bench
      title='水番二土'
      guidance='side'
      navigations={navigations}
      classNames={{
        main: 'px-10 pb-8'
      }}
    >
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </Bench>
  )
}

export default Layout
