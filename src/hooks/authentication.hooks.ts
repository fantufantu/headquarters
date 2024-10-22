import { useCallback } from 'react'
import { useNotification } from 'musae'
import { useAuthentication } from '../store/authentication'

/**
 * @description
 * 用户注册或者登录都能从服务端换到 json web token
 * 但是 jwt 是兑换不了用户信息，需要重新调用后端获取用户信息的接口
 *
 * 并且完成登录和兑换用户信息后，需要重定向到首页
 */
export const useWho = () => {
  const [notifier] = useNotification()
  const { me, authenticate, whoAmI: _whoAmI } = useAuthentication()

  const whoAmI = useCallback(
    async (authenticated?: string) => {
      if (!authenticated) return

      authenticate(authenticated)

      const _who = await _whoAmI().catch(() => null)

      if (!_who) {
        notifier.error({
          title: '登录异常',
          description: '系统繁忙！请重新登录！'
        })
        return
      }
    },
    [notifier]
  )

  return {
    me,
    whoAmI
  }
}
