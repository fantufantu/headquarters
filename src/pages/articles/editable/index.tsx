import { Form, Input, Button, Space, Select, useMessage, Loading, RichTextEditor } from 'musae'
import { useNavigate } from '@aiszlab/bee/router'
import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_ARTICLE, UPDATE_ARTICLE } from '../../../api/article'
import { useArticle, useCategories } from './hooks'
import { type FormValues } from './hooks'
import type { CreateArticleBy } from '../../../api/article.types'

const Editable = () => {
  const navigate = useNavigate()
  const form = Form.useForm<FormValues>()
  const [create] = useMutation(CREATE_ARTICLE)
  const [update] = useMutation(UPDATE_ARTICLE)
  const { categoryOptions, onSearch } = useCategories()
  const [messager] = useMessage()
  const { isLoading, article, id } = useArticle({ form })

  const back = useCallback(() => {
    navigate('/articles')
  }, [navigate])

  const submit = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const { categories, ..._values } = form.getValues()
    const _article: CreateArticleBy = {
      ..._values,
      categoryCodes: categories.map((_category) => _category.value.toString())
    }

    const isSucceed = !!id
      ? await update({
          variables: {
            id,
            updateBy: _article
          }
        })
      : !!(
          await create({
            variables: {
              createBy: _article
            }
          })
        ).data?.createArticle

    if (!isSucceed) return
    messager.success({ description: '文章编辑成功' })
    back()
  }, [back, create, form, id, messager, update])

  if (isLoading) {
    return <Loading loading className='min-h-96' />
  }

  return (
    <Form form={form}>
      <Form.Item name='title' label='标题' required>
        <Input className='w-full' />
      </Form.Item>

      <Form.Item name='categories' label='分类' required>
        <Select complex mode='multiple' options={categoryOptions} searchable onSearch={onSearch} onFilter={false} />
      </Form.Item>

      <Form.Item name='content' label='正文'>
        <RichTextEditor defaultValue={article?.content} use='markdown' />
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
