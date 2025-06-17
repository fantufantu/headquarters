import { gql, TypedDocumentNode } from '@apollo/client'
import type { LoginBy, RegisterBy, Who } from './authentication.type'

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
export const SEND_REIGSTER_CAPTCHA: TypedDocumentNode<{ sendRegisterCaptcha: string }, { to: string }> = gql`
  mutation SendRegisterCaptcha($to: String!) {
    sendRegisterCaptcha(to: $to)
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

/**
 * @description
 * 发送密码验证码
 */
export const SEND_CHANGE_PASSWORD_CAPTCHA: TypedDocumentNode<
  { sendChangePasswordCaptcha: string },
  { to: string }
> = gql`
  mutation SendChangePasswordCaptcha($to: String!) {
    sendChangePasswordCaptcha(to: $to)
  }
`
