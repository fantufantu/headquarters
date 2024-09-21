import { gql, TypedDocumentNode } from '@apollo/client'
import type { LoginBy, Who } from './authentication.type'

export const SIGN_UP: TypedDocumentNode<{ login: string }, { loginBy: LoginBy }> = gql`
  mutation Login($loginBy: LoginBy!) {
    login(loginBy: $loginBy)
  }
`

export const WHO_AM_I: TypedDocumentNode<{ whoAmI: Who }> = gql`
  query WhoAmI {
    whoAmI {
      id
      nickname
      avatar
    }
  }
`
