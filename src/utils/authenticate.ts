import { useNavigate } from '@aiszlab/bee/router'
import { useEvent } from '@aiszlab/relax'

/**
 * @description
 * 登录、注册之后重定向到第三方站点
 */
export const useNavigateAtAuthecticated = () => {
  const _navigate = useNavigate()

  const navigate = useEvent((authenticated: string) => {
    const _redirectTo = new URL(window.location.href).searchParams.get('redirect')

    // 非第三方站点单点登录，直接重定向到站点首页
    if (!_redirectTo) return _navigate('/')

    const _redirect = new URL(_redirectTo)
    _redirect.searchParams.set('authenticated', authenticated ?? '')
    window.location.href = _redirect.toString()
    return
  })

  return navigate
}
