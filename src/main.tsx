import { bootstrap } from '@aiszlab/bee'
import { lazy } from 'react'
import { redirect } from '@aiszlab/bee/router'
import { RedirectToken } from './utils/redirect-by'

import './styles.css'
import 'musae/styles.css'

import Application from './application'
import Layout from './layouts/layout'
import { useAuthentication } from './store/authentication'

const Home = lazy(() => import('./pages/home'))
const Articles = lazy(() => import('./pages/articles'))
const Categories = lazy(() => import('./pages/categories'))
const Editable = lazy(() => import('./pages/articles/editable'))
const SignUp = lazy(() => import('./pages/sign-up'))
const SignIn = lazy(() => import('./pages/sign-in'))
const Issue = lazy(() => import('./pages/issue'))
const Issues = lazy(() => import('./pages/issues'))
const Setting = lazy(() => import('./pages/setting'))
const ForgotPassword = lazy(() => import('./pages/forgot-password'))
const ResumeTemplates = lazy(() => import('./pages/resume-templates'))

bootstrap({
  selectors: '#root',
  render: Application,
  routes: [
    {
      path: '/',
      loader: ({ request }) => {
        // signed in, allow visit
        if (useAuthentication.state.me) return null

        const _redirect = new URL('/sign-in', request.url)
        _redirect.searchParams.append(RedirectToken.Redirect, request.url)
        return redirect(_redirect.toString())
      },
      children: [
        {
          Component: Layout,
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
            },
            {
              path: '/issues',
              Component: Issues
            },
            {
              path: '/resume-templates',
              Component: ResumeTemplates
            },
            {
              path: '/setting',
              Component: Setting
            }
          ]
        },
        {
          path: 'issue',
          Component: Issue
        }
      ]
    },
    {
      path: '/',
      loader: ({ request }) => {
        if (!useAuthentication.state.me) return

        const authenticated = useAuthentication.state.authenticated
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
          Component: SignIn,
          index: true
        },
        {
          path: 'sign-up',
          Component: SignUp
        },
        {
          path: 'forgot-password',
          Component: ForgotPassword
        }
      ]
    }
  ]
})
