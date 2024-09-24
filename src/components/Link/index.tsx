import { Link as _Link, type To } from '@aiszlab/bee/router'
import { useTheme } from 'musae'
import { createElement, type ReactNode } from 'react'
import styles from './styles.module.css'

interface Props {
  children?: ReactNode
  to: To
}

const Link = ({ children, to }: Props) => {
  const theme = useTheme()

  return createElement(
    _Link,
    {
      to,
      className: styles.link,
      style: {
        // @ts-ignore
        '--color': theme.colors.primary
      }
    },
    children
  )
}

export default Link
