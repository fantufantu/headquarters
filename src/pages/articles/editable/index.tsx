import { Form, RichTextEditor, Input, Button, Space, Select } from 'musae'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_ARTICLE } from '../../../api/article'
import { useCategories } from './hooks'

interface FormValues {
  title: string
  content: string
}

const Editable = () => {
  const navigate = useNavigate()
  const form = Form.useForm<FormValues>()
  const [_mutate] = useMutation(CREATE_ARTICLE)
  const { categoryOptions, onSearch } = useCategories()

  const back = useCallback(() => {
    navigate('..', { relative: 'path' })
  }, [])

  const submit = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()

    const _created = await _mutate({
      variables: {
        createBy: {
          title: '1',
          content: '2',
          categoryCodes: ['java-script']
        }
      }
    })
  }, [])

  return (
    <Form form={form}>
      <Form.Item name='title' label='标题' required>
        <Input className='w-full' />
      </Form.Item>

      <Form.Item name='categories' label='分类' required>
        <Select mode='multiple' options={categoryOptions} searchable onSearch={onSearch} onFilter={false} />
      </Form.Item>

      <Form.Item name='content' label='正文'>
        <RichTextEditor />
      </Form.Item>

      <Form.Item>
        <Space gutter={8}>
          <Button onClick={submit}>保存</Button>
          <Button color='secondary' variant='outlined' onClick={back}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Editable
