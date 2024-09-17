import { ConfigProvider, ThemeProvider } from 'musae'
import { ApolloProvider } from '@apollo/client'
import { client } from './api'
import { lazy } from 'react'

const Outlet = lazy(() => import('@aiszlab/bee/router').then((router) => ({ default: router.Outlet })))

const Application = () => {
  return (
    <ApolloProvider client={client}>
      <ConfigProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </ConfigProvider>
    </ApolloProvider>
  )
}

export default Application
