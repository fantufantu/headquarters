import { useBoolean } from '@aiszlab/relax'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Dialog, Form, Input } from 'musae'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { CREATE_RESUME_TEMPLATE, RESUME_TEMPLATE, UPDATE_RESUME_TEMPLATE } from '../../../api/resume-template'

export interface EditorRef {
  open: (id?: number) => Promise<void>
}

interface FormValue {
  name: string
  cover: string
}

const Editor = forwardRef<EditorRef>((_, ref) => {
  const [isVisible, { turnOn, turnOff }] = useBoolean(false)
  const [id, setId] = useState<number>()
  const form = Form.useForm<FormValue>()
  const [queryResumeTemplate] = useLazyQuery(RESUME_TEMPLATE)
  const [createResumeTemplate] = useMutation(CREATE_RESUME_TEMPLATE)
  const [updateResumeTemplate] = useMutation(UPDATE_RESUME_TEMPLATE)

  useImperativeHandle(ref, () => {
    return {
      open: async (id) => {
        form.clear()

        if (id) {
          const _resumeTemplate = (await queryResumeTemplate({ variables: { id } }).catch(() => null))?.data
            ?.resumeTemplate
          if (!_resumeTemplate) return

          console.log('_resumeTemplate====', _resumeTemplate)

          form.setFieldsValue({
            name: _resumeTemplate.name,
            cover: _resumeTemplate.cover
          })
        }

        setId(id)
        turnOn()
      }
    }
  })

  const submit = async () => {
    const isValid = await form.validate().catch(() => false)
    if (!isValid) return

    const _values = form.getFieldsValue() as FormValue
    const isSucceed = await (id
      ? updateResumeTemplate({ variables: { id, input: _values } })
      : createResumeTemplate({
          variables: {
            input: _values
          }
        }).then((_created) => !!_created.data?.createResumeTemplate)
    ).catch(() => false)

    if (!isSucceed) return
    turnOff()
  }

  return (
    <Dialog title='编辑' open={isVisible} onClose={turnOff} onConfirm={submit}>
      <Form form={form}>
        <Form.Item label='模板名称' name='name' required>
          <Input placeholder='请输入模板名称' />
        </Form.Item>

        <Form.Item label='模板封面' name='cover' required>
          <Input placeholder='请输入模板封面' />
        </Form.Item>
      </Form>
    </Dialog>
  )
})

export default Editor
