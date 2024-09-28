import { client } from '../api'
import { CREDENTIAL } from '../api/cloud'

/**
 * @description
 * 上传文件至腾讯云COS
 */
export const upload = async (file: File) => {
  const [credential, COS] = await Promise.all([
    client
      .query({
        query: CREDENTIAL
      })
      .then(({ data }) => data.credential),
    import('cos-js-sdk-v5').then((_) => _.default)
  ])

  const _uploader = new COS({
    SecretId: credential.secretId,
    SecretKey: credential.secretKey,
    SecurityToken: credential.securityToken
  })

  const _uploaded = await _uploader.putObject({
    Bucket: credential.bucket,
    Region: credential.region,
    Key: 'test-file',
    Body: file
  })

  return _uploaded.Location
}
