import { Column } from 'musae/types/table'
import { useMemo, type RefObject } from 'react'
import { Category } from '../../api/category.type'
import { Button, Space } from 'musae'
import { type EditableDrawerRef } from '../../components/category/editable-drawer'

export const useColumns = ({ editableRef }: { editableRef: RefObject<EditableDrawerRef> }) => {
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
        key: 'opeartions',
        title: '操作',
        render: (_, { id }) => {
          return (
            <Space>
              <Button variant='text' size='small' onClick={() => editableRef.current?.open(id)}>
                编辑
              </Button>
              <Button variant='text' size='small'>
                删除
              </Button>
            </Space>
          )
        }
      }
    ]
  }, [editableRef])
}
