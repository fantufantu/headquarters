import { type UploadBody } from "cos-js-sdk-v5";
import { client } from "../api";
import { COS_CREDENTIAL } from "../api/cloud";
import { exclude } from "@aiszlab/relax";
import { BUCKET_NAME, BucketName } from "../api/cloud.types";
import { ValueOf } from "@aiszlab/relax/types";

export const DIR = {
  ISSUES: "issues",
  STACK_LOGOS: "stack-logos",
  AVATARS: "avatars",
  RESUME_TEMPLATES: "resume-templates",
  NONE: "",
} as const;

type Dir = ValueOf<typeof DIR>;

interface Uploading {
  body: UploadBody;
  dir?: Dir;
  filename?: string;
  bucketName?: BucketName;
}

/**
 * 上传文件至腾讯云`COS`
 */
export const upload = async ({
  body,
  bucketName = BUCKET_NAME.FANTU,
  dir = DIR.NONE,
  filename,
}: Uploading) => {
  const [credential, COS] = await Promise.all([
    client
      .query({
        query: COS_CREDENTIAL,
        variables: {
          bucketName,
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
    Key: exclude([dir, filename ?? crypto.randomUUID()], [DIR.NONE]).join("/"),
    Body: body,
  });

  return `https://${_uploaded.Location}`;
};
