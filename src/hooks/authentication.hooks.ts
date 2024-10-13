import { useCallback } from 'react'
import { useDispatch, useSelector } from './storage.hooks'
import { whoAmI as _whoAmI, authenticate } from '../storage/authentication'
import { useNotification } from 'musae'

/**
 * @description
 * 用户注册或者登录都能从服务端换到 json web token
 * 但是 jwt 是兑换不了用户信息，需要重新调用后端获取用户信息的接口
 *
 * 并且完成登录和兑换用户信息后，需要重定向到首页
 */
export const useWho = () => {
  const dispatch = useDispatch()
  const [notifier] = useNotification()
  const me = useSelector((store) => store.authentication.me)

  const whoAmI = useCallback(
    async (authenticated?: string) => {
      if (!authenticated) return

      dispatch(authenticate(authenticated))

      const _who = await dispatch(_whoAmI())
        .unwrap()
        .catch(() => null)

      if (!_who) {
        notifier.error({
          title: '登录异常',
          description: '系统繁忙！请重新登录！'
        })
        return
      }
    },
    [dispatch, notifier]
  )

  return {
    me,
    whoAmI
  }
}
