import { Button, useTheme, Popconfirm, useMessage } from 'musae'
import type { Column } from 'musae/types/table'
import { RefObject, useMemo } from 'react'
import { ResumeTemplate } from '../../api/resume-template.types'
import { EditorRef } from '../../components/resume-template/editor'
import { useMutation } from '@apollo/client'
import { REMOVE_RESUME_TEMPLATE } from '../../api/resume-template'

/**
 * @description
 * 列配置
 */
export const useColumns = ({
  editorRef,
  onRemove
}: {
  editorRef: RefObject<EditorRef | null>
  onRemove: () => void
}) => {
  const theme = useTheme()
  const { 0: messager } = useMessage()

  // 删除简历模板
  const { 0: remove } = useMutation(REMOVE_RESUME_TEMPLATE, {
    onCompleted({ removeResumeTemplate: isSucceed }) {
      if (!isSucceed) return
      messager.success({ description: '删除成功！' })
      onRemove()
    }
  })

  return useMemo<Column<ResumeTemplate>[]>(() => {
    return [
      {
        valueAt: 'id',
        title: 'ID'
      },
      {
        valueAt: 'name',
        title: '名称'
      },
      {
        key: 'actions',
        title: '操作',
        render: (_, { id }) => (
          <div className='flex gap-2'>
            <Button variant='text' size='small' onClick={() => editorRef.current?.open(id)}>
              编辑
            </Button>
            <Popconfirm
              onConfirm={() => {
                remove({ variables: { id } })
              }}
              content='确定删除吗？'
            >
              <Button variant='text' size='small' color='error'>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    ]
  }, [theme])
}
