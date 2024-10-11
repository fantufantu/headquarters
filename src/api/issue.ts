import { client } from '.'
import { Dir } from '../utils/upload'
import { CREDENTIAL } from './cloud'

/**
 * @description
 * 获取 issues 列表
 */
export const queryIssues = async () => {
  const _prefix = Dir.Issues + '/'
  const [credential, COS] = await Promise.all([
    client
      .query({
        query: CREDENTIAL
      })
      .then(({ data }) => data.credential),
    import('cos-js-sdk-v5').then((_) => _.default)
  ])

  const cos = new COS({
    SecretId: credential.secretId,
    SecretKey: credential.secretKey,
    SecurityToken: credential.securityToken
  })

  return await cos
    .getBucket({
      Bucket: credential.bucket,
      Region: credential.region,
      Prefix: _prefix,
      MaxKeys: 21
    })
    .then(({ Contents }) => Contents.filter((item) => item.Key !== _prefix))
}
