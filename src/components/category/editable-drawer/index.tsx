import { Button, Drawer, Form, Input } from 'musae'
import { useBoolean, useEvent } from '@aiszlab/relax'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CREATE_CATEGORY, CATEGORY } from '../../../api/category'
import { forwardRef, useImperativeHandle, useState } from 'react'

interface FormValues {
  code: string
  name: string
}

export interface EditableDrawerRef {
  open: (id?: number) => void
}

const EditableDrawer = forwardRef<EditableDrawerRef>((_, ref) => {
  const [isOpen, { turnOff, turnOn }] = useBoolean(false)
  const form = Form.useForm<FormValues>()
  const [refetch] = useLazyQuery(CATEGORY)
  const [create] = useMutation(CREATE_CATEGORY)
  const [id, setId] = useState<number>()

  useImperativeHandle(ref, () => {
    return {
      open: async (_id) => {
        setId(_id)

        if (!_id) {
          form.reset()
          turnOn()
          return
        }

        const _category = (await refetch({ variables: { id: _id } }).catch(() => null))?.data?.articleCategory
        if (!_category) {
          form.reset()
        } else {
          form.setValue('code', _category.code)
          form.setValue('name', _category.name)
        }
        turnOn()
      }
    }
  })

  const submit = useEvent(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const _edited = form.getValues()
    const isSucceed = !!(
      await create({
        variables: {
          createArticleCategoryBy: _edited
        }
      })
    ).data?.createArticleCategory

    if (!isSucceed) return
    turnOff()
  })

  return (
    <Drawer open={isOpen} onClose={turnOff} title='编辑分类'>
      <Form>
        <Form.Item name='code' label='唯一标识' required>
          <Input />
        </Form.Item>

        <Form.Item name='name' label='名称' required>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button onClick={submit}>提交</Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
})

export default EditableDrawer