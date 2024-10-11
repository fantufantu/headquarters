import type { CosObject } from 'cos-js-sdk-v5'
import { useTheme } from 'musae'
import type { Column } from 'musae/types/table'
import { useMemo } from 'react'

/**
 * @description
 * 列配置
 */
export const useColumns = () => {
  const theme = useTheme()

  return useMemo<Column<CosObject>[]>(() => {
    return [
      {
        valueAt: 'Key',
        title: 'OSS Key'
      },
      {
        key: 'actions',
        title: '操作',
        render: (_, { Key }) => {
          return (
            <a
              href={`https://console.cloud.tencent.com/cos/bucket?type=object&tab=objectDetail&bucket=fantu-1304340057&region=ap-shanghai&path=${encodeURIComponent(
                '/' + Key
              )}`}
              target='_blank'
              rel='noreferrer'
              style={{
                color: theme.colors.primary
              }}
            >
              查看
            </a>
          )
        }
      }
    ]
  }, [theme])
}
