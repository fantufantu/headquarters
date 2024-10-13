import { toFunction } from '@aiszlab/relax'
import type { Voidable } from '@aiszlab/relax/types'

export enum RedirectToken {
  Redirect = 'redirect',
  Authenticated = 'authenticated'
}

type Options = { isSameOrigin: boolean }

/**
 * @description
 * 根据 url 中的重定向参数，跳转指定页面
 */
export const redirectBy = (
  searchParams?: Voidable<Record<string, string>> | ((options: Options) => Voidable<Record<string, string>>)
) => {
  const _redirectTo = new URL(globalThis.window.location.href).searchParams.get(RedirectToken.Redirect)

  // 非第三方站点单点登录，直接重定向到站点首页
  if (!_redirectTo) {
    window.location.href = window.location.origin
    return
  }

  const _redirect = new URL(_redirectTo)
  const isSameOrigin = _redirect.origin === globalThis.window.location.origin
  const _searchParams = toFunction<(options: Options) => Voidable<Record<string, string>>>(searchParams)({
    isSameOrigin
  })

  Object.entries(_searchParams ?? {}).forEach(([key, value]) => {
    _redirect.searchParams.set(key, value)
  })

  window.location.href = _redirect.toString()
  return
}
