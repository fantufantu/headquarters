import { useBoolean } from '@aiszlab/relax'
import { useLazyQuery } from '@apollo/client'
import { Dialog, Form, Input } from 'musae'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { RESUME_TEMPLATE } from '../../../api/resume-template'

interface EditorRef {
  open: (id?: number) => Promise<void>
}

interface FormValue {
  name: string
  code: string
}

const Editor = forwardRef<EditorRef>((_, ref) => {
  const [isVisible, { turnOn, turnOff }] = useBoolean(false)
  const [id, setId] = useState<number>()
  const form = Form.useForm<FormValue>()
  const [queryResumeTemplate] = useLazyQuery(RESUME_TEMPLATE)

  useImperativeHandle(ref, () => {
    return {
      open: async (id) => {
        form.clear()

        if (id) {
          const _resumeTemplate = (await queryResumeTemplate({ variables: { id } }).catch(() => null))?.data
            ?.resumeTemplate
          form
        }

        setId(id)
        turnOn()
      }
    }
  })

  return (
    <Dialog title='编辑' open={isVisible} onClose={turnOff}>
      <Form>
        <Form.Item label='模板名称' name='name' required>
          <Input placeholder='请输入模板名称' />
        </Form.Item>

        <Form.Item label='模板封面' name='cover' required>
          <Input placeholder='请输入模板名称' />
        </Form.Item>
      </Form>
    </Dialog>
  )
})

export default Editor
