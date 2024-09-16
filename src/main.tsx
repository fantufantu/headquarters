import { bootstrap } from '@aiszlab/bee'
import Application from './application'
import './styles.css'
import Home from './pages/home'

bootstrap({
  selectors: '#root',
  routes: [
    {
      path: '/',
      element: <Application />,
      children: [
        {
          path: '/',
          element: <Home />
        }
      ]
    }
  ]
})
