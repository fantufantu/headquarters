import { gql, TypedDocumentNode } from '@apollo/client'
import type { LoginBy, RegisterBy, SendCaptchaBy, Who } from './authentication.type'

/**
 * @description
 * 登录
 */
export const SIGN_IN: TypedDocumentNode<{ login: string }, { loginBy: LoginBy }> = gql`
  mutation Login($loginBy: LoginBy!) {
    login(loginBy: $loginBy)
  }
`

/**
 * @description
 * 注册
 */
export const SIGN_UP: TypedDocumentNode<{ register: string }, { registerBy: RegisterBy }> = gql`
  mutation Register($registerBy: RegisterBy!) {
    register(registerBy: $registerBy)
  }
`

/**
 * @description
 * 查询当前用户信息
 */
export const WHO_AM_I: TypedDocumentNode<{ whoAmI: Who }> = gql`
  query WhoAmI {
    whoAmI {
      id
      username
      nickname
      avatar
      emailAddress
    }
  }
`

/**
 * @description
 * 发送注册验证码
 */
export const SEND_CAPTCHA: TypedDocumentNode<{ sendCaptcha: string }, { sendBy: SendCaptchaBy }> = gql`
  mutation SendCaptcha($sendBy: SendCaptchaBy!) {
    sendCaptcha(sendBy: $sendBy)
  }
`

/**
 * @description
 * 用户退出登录
 */
export const LOGOUT: TypedDocumentNode<{ logout: boolean }> = gql`
  mutation Logout {
    logout
  }
`
