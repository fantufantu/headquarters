export type { BucketName } from "@/constants/enums";

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
