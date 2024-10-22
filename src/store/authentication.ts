import type { Who } from '../api/authentication.type'
import { client } from '../api'
import { WHO_AM_I } from '../api/authentication'
import { AuthenticationToken } from './tokens'
import { random } from '@aiszlab/fuzzy/avatar'

import { using } from '@aiszlab/relax/react'

interface Authentication {
  authenticated: string | null
  me: Who | null
  authenticate: (authenticated: string) => void
  whoAmI: () => Promise<Who | null>
}

const useAuthentication = using<Authentication>((setState) => {
  return {
    authenticated: window.localStorage.getItem(AuthenticationToken.Authenticated),
    me: null,

    // 设置用户凭证
    authenticate: (authenticated) => {
      setState((state) => ({
        ...state,
        authenticated,
        me: null
      }))
    },

    // 向服务端进行验证，将验证后的结果存储到全局状态中
    whoAmI: async () => {
      const _me = (await client.query({ query: WHO_AM_I }).catch(() => null))?.data.whoAmI ?? null
      if (!_me) return null

      const me: Who = {
        ..._me,
        avatar: _me.avatar ?? (await random())
      }

      setState((state) => ({
        ...state,
        me
      }))

      return me
    }
  }
})

export { useAuthentication }
