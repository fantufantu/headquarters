import { Drawer, Form } from 'musae'
import { useBoolean, useEvent } from '@aiszlab/relax'
import { forwardRef, useImperativeHandle } from 'react'
import { Dir, upload } from '../../../utils/upload'
import IssueForm, { FormValues as IssueFormValues } from '../form'

export interface EditableDrawerRef {
  open: () => void
}

interface Props {
  onSubmitted?: () => void | Promise<void>
}

const EditableDrawer = forwardRef<EditableDrawerRef, Props>(({ onSubmitted }, ref) => {
  const [isOpen, { turnOff, turnOn }] = useBoolean(false)
  const form = Form.useForm<IssueFormValues>()

  useImperativeHandle(ref, () => {
    return {
      open: async () => {
        form.reset()
        turnOn()
      }
    }
  })

  const submit = useEvent(async () => {
    const isValid = await form.trigger().catch(() => false)
    if (!isValid) return

    const formValues = form.getValues()
    const blob = new Blob([JSON.stringify(formValues)], { type: 'application/json' })
    const url = await upload(blob, Dir.Issues, `${formValues.title}.json`).catch(() => null)
    if (!url) return

    turnOff()
    await onSubmitted?.()
  })

  return (
    <Drawer open={isOpen} onClose={turnOff} title='编辑分类' onConfirm={submit}>
      <IssueForm form={form} />
    </Drawer>
  )
})

export default EditableDrawer
