import { type UploadBody } from "cos-js-sdk-v5";
import { client } from "../api";
import { COS_CREDENTIAL } from "../api/cloud";
import { exclude } from "@aiszlab/relax";
import { BUCKET_NAME } from "../api/cloud.types";
import { ValueOf } from "@aiszlab/relax/types";

export const DIR = {
  issues: "issues",
  stack_logos: "stack-logos",
  avatars: "avatars",
  resume_templates: "resume-templates",
  None: "",
} as const;

type Dir = ValueOf<typeof DIR>;

/**
 * 上传文件至腾讯云`COS`
 */
export const upload = async (uploading: UploadBody, dir: Dir = DIR.None, filename?: string) => {
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
    throw new Error("获取腾讯云COS凭证失败");
  }

  const _uploader = new COS({
    SecretId: credential.secretId,
    SecretKey: credential.secretKey,
    SecurityToken: credential.securityToken,
  });

  const _uploaded = await _uploader.putObject({
    Bucket: credential.bucket,
    Region: credential.region,
    Key: exclude([dir, filename ?? crypto.randomUUID()], [DIR.None]).join("/"),
    Body: uploading,
  });

  return `https://${_uploaded.Location}`;
};
