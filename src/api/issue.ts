import { client } from ".";
import { DIR } from "../utils/upload";
import { COS_CREDENTIAL } from "./cloud";
import { BUCKET_NAME } from "./cloud.types";

/**
 * @description
 * 获取 issues 列表
 */
export const queryIssues = async () => {
  const _prefix = DIR.issues + "/";
  const [credential, COS] = await Promise.all([
    client
      .query({
        query: COS_CREDENTIAL,
        variables: {
          bucketName: BUCKET_NAME.fantu,
        },
      })
      .then(({ data }) => data?.cosCredential),
    import("cos-js-sdk-v5").then((_) => _.default),
  ]);

  if (!credential) {
    throw new Error("对象存储临时秘钥获取失败");
  }

  const cos = new COS({
    SecretId: credential.secretId,
    SecretKey: credential.secretKey,
    SecurityToken: credential.securityToken,
  });

  return await cos
    .getBucket({
      Bucket: credential.bucket,
      Region: credential.region,
      Prefix: _prefix,
      MaxKeys: 21,
    })
    .then(({ Contents }) => Contents.filter((item) => item.Key !== _prefix));
};
