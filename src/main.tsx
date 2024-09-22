import { bootstrap } from '@aiszlab/bee'
import Application from './application'
import './styles.css'
import { lazy } from 'react'
import 'musae/styles.css'
import { store } from './storage'
import Layout, { loader } from './layout'

const Home = lazy(() => import('./pages/home'))
const Articles = lazy(() => import('./pages/articles'))
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
      loader,
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
        }
      ]
    },
    {
      path: '/sign-in',
      Component: SignIn
    },
    {
      path: '/sign-up',
      Component: SignUp
    }
  ]
})
