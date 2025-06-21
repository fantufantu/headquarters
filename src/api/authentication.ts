import { gql, TypedDocumentNode } from "@apollo/client";
import type { LoginInput, RegisterInput, Who } from "./authentication.types";

/**
 * @description
 * 登录
 */
export const SIGN_IN: TypedDocumentNode<
  { login: string },
  { loginInput: LoginInput }
> = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput)
  }
`;

/**
 * @description
 * 注册
 */
export const SIGN_UP: TypedDocumentNode<
  { register: string },
  { registerInput: RegisterInput }
> = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput)
  }
`;

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
`;

/**
 * @description
 * 发送注册验证码
 */
export const SEND_REIGSTER_CAPTCHA: TypedDocumentNode<
  { sendRegisterCaptcha: string },
  { to: string }
> = gql`
  mutation SendRegisterCaptcha($to: String!) {
    sendRegisterCaptcha(to: $to)
  }
`;

/**
 * @description
 * 用户退出登录
 */
export const LOGOUT: TypedDocumentNode<{ logout: boolean }> = gql`
  mutation Logout {
    logout
  }
`;

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
`;
