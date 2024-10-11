import { Button, Form, Input, Space, useMessage } from 'musae'
import { useCallback } from 'react'
import { Dir, upload } from '../../utils/upload'

interface FormValues {
  title: string
  content: string
}

const Issue = () => {
  const form = Form.useForm<FormValues>()
  const [messager] = useMessage()

  const back = useCallback(() => {
    window.history.back()
  }, [])

  const submit = useCallback(async () => {
    const isValid = await form.trigger().catch(() => false)
    if (!isValid) return

    const formValues = form.getValues()
    const blob = new Blob([JSON.stringify(formValues)], { type: 'application/json' })
    const url = await upload(blob, Dir.Issues, formValues.title).catch(() => null)

    if (!url) {
      messager.error({ description: '反馈失败！' })
      return
    }

    back()
  }, [back, form, messager])

  return (
    <div className='p-5 flex justify-center'>
      <div className='max-w-2xl w-full'>
        <Form form={form}>
          <Form.Item label='标题' name='title' required>
            <Input className='w-full' />
          </Form.Item>

          <Form.Item label='反馈' name='content' required>
            <Input className='w-full' />
          </Form.Item>

          <Form.Item>
            <Space gutter={12}>
              <Button onClick={submit}>提交</Button>
              <Button color='secondary' variant='outlined' onClick={back}>
                返回
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Issue
