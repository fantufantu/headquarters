import { lazy, Suspense } from 'react'
import { AddAlert, AutoDelete } from 'musae/icons'
import { useTheme, Bench } from 'musae'
import { useNavigations } from './hooks'

const Outlet = lazy(() => import('@aiszlab/bee/router').then((router) => ({ default: router.Outlet })))

const Layout = () => {
  const theme = useTheme()
  const navigations = useNavigations()

  return (
    <Bench title='水番二土' guidance='side' navigations={navigations}>
      <div
        className='h-screen flex flex-row'
        style={{
          backgroundColor: theme.colors['surface-dim']
        }}
      >
        <aside className='flex flex-col gap-4 p-4'>
          <AddAlert size='large' />
          <AutoDelete size='large' />
        </aside>

        <div className='flex-1 flex flex-col rounded-l-3xl' style={{ backgroundColor: theme.colors['surface'] }}>
          <header className='py-2 px-2'>12321321</header>

          <main className='flex-1'>
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </Bench>
  )
}

export default Layout