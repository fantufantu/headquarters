import { Column } from 'musae/types/table'
import { useMemo, type RefObject } from 'react'
import { Category } from '../../api/category.type'
import { Button, Popconfirm, Space, useMessage } from 'musae'
import { type EditableDrawerRef } from '../../components/category/editable-drawer'
import { useMutation } from '@apollo/client'
import { REMOVE_CATEGORY } from '../../api/category'

export const useColumns = ({
  editableRef,
  refetch
}: {
  editableRef: RefObject<EditableDrawerRef>
  refetch: VoidFunction
}) => {
  const [_remove] = useMutation(REMOVE_CATEGORY)
  const [messager] = useMessage()

  return useMemo<Column<Category>[]>(() => {
    return [
      {
        valueAt: 'code',
        title: 'Code'
      },
      {
        valueAt: 'name',
        title: '名称'
      },
      {
        valueAt: 'image',
        title: 'logo',
        render: (image) => {
          return <img src={`https://${image}`} alt='logo' width={32} />
        }
      },
      {
        key: 'actions',
        title: '操作',
        render: (_, { id }) => {
          return (
            <Space>
              <Button variant='text' size='small' onClick={() => editableRef.current?.open(id)}>
                编辑
              </Button>
              <Popconfirm
                title='请确认'
                content='确认删除当前分类'
                onConfirm={async () => {
                  const isSucceed = !!(await _remove({ variables: { id } })).data?.removeArticleCategory
                  if (!isSucceed) return
                  messager.success({ description: '删除成功！' })
                  refetch()
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
  }, [_remove, editableRef, messager, refetch])
}