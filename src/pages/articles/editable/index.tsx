import { Form, RichTextEditor, Input, Button, Space, Select, useNotification, useMessage } from 'musae'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_ARTICLE } from '../../../api/article'
import { useCategories } from './hooks'

interface FormValues {
  title: string
  content: string
  categories: string[]
}

const Editable = () => {
  const navigate = useNavigate()
  const form = Form.useForm<FormValues>()
  const [_mutate] = useMutation(CREATE_ARTICLE)
  const { categoryOptions, onSearch } = useCategories()
  const [messager] = useMessage()

  const back = useCallback(() => {
    navigate('..', { relative: 'path' })
  }, [])

  const submit = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const { categories, ..._values } = form.getValues()

    const _article = (
      await _mutate({
        variables: {
          createBy: {
            ..._values,
            categoryCodes: categories.map((_category) => _category)
          }
        }
      })
    ).data?.createArticle

    if (!_article) return
    messager.success({ description: '文章编辑成功' })
    back()
  }, [])

  return (
    <Form form={form}>
      <Form.Item name='title' label='标题' required>
        <Input className='w-full' />
      </Form.Item>

      <Form.Item name='categories' label='分类' required>
        <Select
          mode='multiple'
          options={categoryOptions}
          searchable
          onSearch={onSearch}
          onFilter={false}
          onChange={(_) => {
            console.log(_)
          }}
        />
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
