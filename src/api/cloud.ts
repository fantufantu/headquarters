import { gql, type TypedDocumentNode } from "@apollo/client";
import { type BucketName, type CosCredential } from "./cloud.types";

export const COS_CREDENTIAL: TypedDocumentNode<
  {
    cosCredential: CosCredential;
  },
  {
    bucketName: BucketName;
  }
> = gql`
  query CosCredential($bucketName: BucketName!) {
    cosCredential(bucketName: $bucketName) {
      secretId
      secretKey
      securityToken
      bucket
      region
    }
  }
`;
