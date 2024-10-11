import { Drawer, Form, Input, Upload } from 'musae'
import { useBoolean, useEvent } from '@aiszlab/relax'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CREATE_CATEGORY, CATEGORY, UPDATE_CATEGORY } from '../../../api/category'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Dir, upload } from '../../../utils/upload'
import type { UploadedItem } from 'musae/types/upload'

interface FormValues {
  code: string
  name: string
  images: UploadedItem[]
}

export interface EditableDrawerRef {
  open: (id?: number) => void
}

interface Props {
  onSubmitted?: () => void | Promise<void>
}

const EditableDrawer = forwardRef<EditableDrawerRef, Props>(({ onSubmitted }, ref) => {
  const [isOpen, { turnOff, turnOn }] = useBoolean(false)
  const form = Form.useForm<FormValues>()
  const [refetch] = useLazyQuery(CATEGORY)
  const [create] = useMutation(CREATE_CATEGORY)
  const [update] = useMutation(UPDATE_CATEGORY)
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
          form.setValue('images', [{ url: _category.image, key: _category.image, status: 'success' }])
        }
        turnOn()
      }
    }
  })

  const submit = useEvent(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const _values = form.getValues()
    const _editing = {
      code: _values.code,
      name: _values.name,
      image: _values.images
        .map((_) => _.url)
        .filter(Boolean)
        .at(0)!
    }

    const isSucceed = !!id
      ? update({ variables: { id, updateBy: _editing } })
      : !!(
          await create({
            variables: {
              createBy: _editing
            }
          })
        ).data?.createArticleCategory

    if (!isSucceed) return
    turnOff()
    await onSubmitted?.()
  })

  const uploader = useCallback((file: File) => {
    return upload(file, Dir.StackLogos)
  }, [])

  return (
    <Drawer open={isOpen} onClose={turnOff} title='编辑分类' onConfirm={submit}>
      <Form form={form}>
        <Form.Item name='code' label='唯一标识' required>
          <Input />
        </Form.Item>

        <Form.Item name='name' label='名称' required>
          <Input />
        </Form.Item>

        <Form.Item name='images' label='logo' required>
          <Upload uploader={uploader} limit={1} />
        </Form.Item>
      </Form>
    </Drawer>
  )
})

export default EditableDrawer
