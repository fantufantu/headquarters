import { bootstrap } from '@aiszlab/bee'
import Application from './application'
import './styles.css'
import { lazy } from 'react'
import 'musae/styles'
import { store } from './storage'
import Layout from './layouts/layout'
import { redirect } from '@aiszlab/bee/router'

const Home = lazy(() => import('./pages/home'))
const Articles = lazy(() => import('./pages/articles'))
const Categories = lazy(() => import('./pages/categories'))
const Editable = lazy(() => import('./pages/articles/editable'))
const SignUp = lazy(() => import('./pages/sign-up'))
const SignIn = lazy(() => import('./pages/sign-in'))

bootstrap({
  selectors: '#root',
  store,
  render: Application,
  routes: [
    {
      path: '/',
      Component: Layout,
      loader: () => {
        if (!store.getState().authentication.me) {
          return redirect('/sign-up')
        }
        return null
      },
      children: [
        {
          path: '',
          Component: Home
        },
        {
          path: '/articles',
          children: [
            {
              path: '',
              Component: Articles
            },
            {
              path: 'add',
              Component: Editable
            },
            {
              path: 'edit/:id',
              Component: Editable
            }
          ]
        },
        {
          path: '/categories',
          Component: Categories
        }
      ]
    },
    {
      path: '/',
      loader: ({ request }) => {
        if (!store.getState().authentication.me) return null

        const authenticated = store.getState().authentication.authenticated
        const _redirectTo = new URL(request.url).searchParams.get('redirect')

        // 非第三方站点单点登录，直接重定向到站点首页
        if (!_redirectTo) return redirect('/')

        const _redirect = new URL(_redirectTo)
        _redirect.searchParams.set('authenticated', authenticated ?? '')
        return redirect(_redirect.toString())
      },
      children: [
        {
          path: 'sign-in',
          Component: SignIn
        },
        {
          path: 'sign-up',
          Component: SignUp
        }
      ]
    }
  ]
})
