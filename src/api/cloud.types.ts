import { ValueOf } from "@aiszlab/relax/types";

/**
 * 腾讯云`COS`临时秘钥
 */
export interface CosCredential {
  secretKey: string;
  secretId: string;
  securityToken: string;
  bucket: string;
  region: string;
}

/**
 * 存储桶名称枚举
 */
export const BUCKET_NAME = {
  fantu: "fantu",
  knowthy: "knowthy",
} as const;

export type BucketName = ValueOf<typeof BUCKET_NAME>;
