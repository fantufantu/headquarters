import { type UploadBody } from "cos-js-sdk-v5";
import { client } from "../api";
import { COS_CREDENTIAL } from "../api/cloud.api";
import { exclude } from "@aiszlab/relax";
import { BUCKET_NAME, type BucketName } from "../api/cloud.types";
import { ValueOf } from "@aiszlab/relax/types";

export const DIR = {
  ISSUES: "issues",
  STACK_LOGOS: "stack-logos",
  AVATARS: "avatars",
  RESUME_TEMPLATES: "resume-templates",
  DISTRICTS: "districts",
  ATTRACTIONS: "attractions",
  NONE: "",
} as const;

type Dir = ValueOf<typeof DIR>;
type Bucket = ValueOf<typeof BUCKET_NAME>;

const BUCKET_NAMES_BY_VALUE = {
  [BUCKET_NAME.FANTU]: "FANTU",
  [BUCKET_NAME.KNOWTHY]: "KNOWTHY",
  [BUCKET_NAME.CABIN_CAB]: "CABIN_CAB",
} as const satisfies Record<Bucket, BucketName>;

interface Uploading {
  body: UploadBody;
  dir?: Dir;
  filename?: string;
  bucketName?: Bucket;
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
          bucketName: BUCKET_NAMES_BY_VALUE[bucketName],
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
