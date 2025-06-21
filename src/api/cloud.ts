import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Credential } from "./cloud.types";

export const CREDENTIAL: TypedDocumentNode<{
  credential: Credential;
}> = gql`
  query Credential {
    credential {
      secretId
      secretKey
      securityToken
      bucket
      region
    }
  }
`;
