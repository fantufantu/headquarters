import { useMemo } from 'react'
import type { Article } from '../../api/article.type'
import type { Column } from 'musae/types/table'
import { Space, Popconfirm, Button, useMessage } from 'musae'
import { useNavigate } from '@aiszlab/bee/router'
import { REMOVE_ARTICLE } from '../../api/article'
import { useMutation } from '@apollo/client'

/**
 * @description
 * table columns
 */
export const useColumns = ({ onPageChange }: { onPageChange: (page: number) => void }) => {
  const navigate = useNavigate()
  const [_remove] = useMutation(REMOVE_ARTICLE)
  const [messager] = useMessage()

  return useMemo<Column<Article>[]>(() => {
    return [
      {
        valueAt: 'id',
        title: 'ID'
      },
      {
        valueAt: 'title',
        title: '标题'
      },
      {
        key: 'opeartions',
        title: '操作',
        render: (_, { id }) => {
          return (
            <Space>
              <Button
                variant='text'
                size='small'
                onClick={() => {
                  navigate(`/articles/edit/${id}`)
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title='确定删除吗？'
                content='删除后不可恢复'
                onConfirm={async () => {
                  const isSucceed = (await _remove({ variables: { id } }).catch(() => null))?.data?.removeArticle
                  if (!isSucceed) return
                  messager.success({ description: '删除成功！' })
                  onPageChange(1)
                }}
              >
                <Button variant='text' size='small'>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )
        }
      }
    ]
  }, [])
}
