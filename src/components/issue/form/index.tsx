import { Form, Input } from 'musae'

export interface FormValues {
  title: string
  content: string
}

interface Props {
  form: ReturnType<typeof Form.useForm<FormValues>>
}

const _Form = ({ form }: Props) => {
  return (
    <Form form={form}>
      <Form.Item label='标题' name='title' required>
        <Input className='w-full' />
      </Form.Item>

      <Form.Item label='反馈' name='content' required>
        <Input className='w-full' />
      </Form.Item>
    </Form>
  )
}

export default _Form
