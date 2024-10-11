import { useNavigate } from '@aiszlab/bee/router'
import { useEvent } from '@aiszlab/relax'

export enum NavigationToken {
  Redirect = 'redirect',
  Authenticated = 'authenticated'
}

/**
 * @description
 * 登录、注册之后重定向到第三方站点
 */
export const useNavigateAtAuthecticated = () => {
  const _navigate = useNavigate()

  const navigate = useEvent((authenticated: string) => {
    const _redirectTo = new URL(globalThis.window.location.href).searchParams.get(NavigationToken.Redirect)

    // 非第三方站点单点登录，直接重定向到站点首页
    if (!_redirectTo) return _navigate('/')

    const _redirect = new URL(_redirectTo)
    const isSameOrigin = _redirect.origin === globalThis.window.location.origin

    console.log('isSameOrigin=====', isSameOrigin)

    !isSameOrigin && _redirect.searchParams.set(NavigationToken.Authenticated, authenticated ?? '')
    window.location.href = _redirect.toString()
    return
  })

  return navigate
}
