import { type UploadBody } from "cos-js-sdk-v5";
import { client } from "../api";
import { CREDENTIAL } from "../api/cloud";
import { exclude } from "@aiszlab/relax";

export const Dir = {
  Issues: "issues",
  StackLogos: "stack-logos",
  Avatars: "avatars",
  ResumeTemplates: "resume-templates",
  None: "",
} as const;

/**
 * 上传文件至腾讯云`COS`
 */
export const upload = async (uploading: UploadBody, dir = Dir.None, filename?: string) => {
  const [credential, COS] = await Promise.all([
    client
      .query({
        query: CREDENTIAL,
      })
      .then(({ data }) => data?.credential),
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
    Key: exclude([dir, filename ?? crypto.randomUUID()], [Dir.None]).join("/"),
    Body: uploading,
  });

  return `https://${_uploaded.Location}`;
};
