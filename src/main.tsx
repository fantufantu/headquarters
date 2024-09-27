import { bootstrap } from '@aiszlab/bee'
import Application from './application'
import './styles.css'
import { lazy } from 'react'
import 'musae/styles'
import { store } from './storage'
import Layout from './layout'
import { redirect } from '@aiszlab/bee/router'

const Home = lazy(() => import('./pages/home'))
const Articles = lazy(() => import('./pages/articles'))
const Categories = lazy(() => import('./pages/categories'))
const Editable = lazy(() => import('./pages/articles/editable'))
const SignIn = lazy(() => import('./pages/sign-in'))
const SignUp = lazy(() => import('./pages/sign-up'))

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
      loader: () => {
        if (store.getState().authentication.me) {
          return redirect('/')
        }
        return null
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
