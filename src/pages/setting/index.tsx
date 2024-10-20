import { Button, Form, Image, Input, Menu, Popconfirm, Popover, Upload, useMessage } from 'musae'
import { useSelector } from '../../hooks/storage.hooks'
import { useEvent, useMounted } from '@aiszlab/relax'
import { useState } from 'react'
import { random } from '@aiszlab/fuzzy/avatar'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '../../api/user'

interface FormValues {
  nickname: string
  username: string
  emailAddress: string
}

const Setting = () => {
  const me = useSelector((store) => store.authentication.me)
  const form = Form.useForm<FormValues>()
  const [avatar, setAvatar] = useState(me?.avatar ?? '')
  const [_update] = useMutation(UPDATE_USER)
  const [messager] = useMessage()

  useMounted(() => {
    if (!me) return

    form.setValue('username', me.username)
    form.setValue('nickname', me.nickname ?? '')
    form.setValue('emailAddress', me.emailAddress)
  })

  const removeAvatar = useEvent(async () => {
    setAvatar(await random())
  })

  const submit = useEvent(async () => {
    const isValid = await form.trigger().catch(() => false)
    if (!isValid) return

    const { nickname } = form.getValues()
    const isSucceed = !!(
      await _update({
        variables: {
          updateUserBy: {
            nickname: nickname ?? null
          }
        }
      }).catch(() => null)
    )?.data?.updateUser

    if (!isSucceed) return
    messager.success({
      description: '更新成功！'
    })
  })

  return (
    <div className='flex gap-40'>
      <Form className='flex-1' form={form}>
        <Form.Item
          label='昵称'
          name='nickname'
          support='昵称将会向所有用户直接展示。如果您非要展示用户名，可以在昵称中填写用户名~'
          required
        >
          <Input className='w-full' />
        </Form.Item>

        <Form.Item label='用户名' name='username' support='没有昵称时，用户名将直接展示'>
          <Input disabled className='w-full' />
        </Form.Item>

        <Form.Item label='邮箱' name='emailAddress'>
          <Input disabled className='w-full' />
        </Form.Item>

        <Form.Item>
          <Button onClick={submit}>更新个人信息</Button>
        </Form.Item>
      </Form>
      <div className='relative w-50 h-fit'>
        <Image width={200} height={200} src={avatar} className='rounded-full' previewable={false} />
        <Popover
          content={
            <Menu
              selectedKeys={[]}
              items={[
                {
                  key: 'upload',
                  label: <Upload renderItem={false}>上传头像</Upload>
                },
                {
                  key: 'remove',
                  label: (
                    <Popconfirm
                      content='移除当前头像后，每次访问系统都将随机生成'
                      onConfirm={removeAvatar}
                      offset={12}
                      placement='bottom'
                    >
                      移除头像
                    </Popconfirm>
                  )
                }
              ]}
            />
          }
          triggerBy='click'
        >
          <Button className='bottom-0 right-0 absolute'>编辑头像</Button>
        </Popover>
      </div>
    </div>
  )
}

export default Setting
