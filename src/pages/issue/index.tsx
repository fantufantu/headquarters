import { Button, Form, Space, useMessage } from 'musae'
import { useCallback } from 'react'
import { Dir, upload } from '../../utils/upload'
import IssueForm, { type FormValues as IssueFormValues } from '../../components/issue/form'
import { redirectBy } from '../../utils/redirect-by'

const Issue = () => {
  const [messager] = useMessage()
  const form = Form.useForm<IssueFormValues>()

  const back = useCallback(() => {
    redirectBy()
  }, [])

  const submit = useCallback(async () => {
    const isValid = await form.trigger().catch(() => false)
    if (!isValid) return

    const formValues = form.getValues()
    const blob = new Blob([JSON.stringify(formValues)], { type: 'application/json' })
    const url = await upload(blob, Dir.Issues, `${formValues.title}.json`).catch(() => null)

    if (!url) {
      messager.error({ description: '反馈失败！' })
      return
    }

    back()
  }, [messager, form, back])

  return (
    <div className='p-5 flex justify-center'>
      <div className='max-w-2xl w-full'>
        <IssueForm form={form} />

        <Space gutter={12}>
          <Button onClick={submit}>提交</Button>
          <Button color='secondary' variant='outlined' onClick={back}>
            返回
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Issue
