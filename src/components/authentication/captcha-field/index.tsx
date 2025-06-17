import { useMutation } from '@apollo/client'
import { Countdown, Form, OtpInput, useMessage } from 'musae'
import { SEND_REIGSTER_CAPTCHA } from '../../../api/authentication'
import { useEvent } from '@aiszlab/relax'

interface Props {
  dependency: string
}

const CaptchaField = ({ dependency }: Props) => {
  const to = Form.useWatch(dependency)
  const [messager] = useMessage()

  console.log('to=======', to)

  const [_sendCaptcha] = useMutation(SEND_REIGSTER_CAPTCHA)

  const sendCaptcha = useEvent(async () => {
    const sent = (
      await _sendCaptcha({
        variables: {
          to
        }
      }).catch(() => null)
    )?.data?.sendRegisterCaptcha

    if (!sent) return
    messager.success({ description: '验证码已发送至您邮箱' })
  })

  return (
    <Form.Item label='Captcha' name='captcha' className='flex justify-between items-center gap-2' required>
      <OtpInput />

      <Countdown disabled={!to} onClick={sendCaptcha}>
        GET CAPTCHA
      </Countdown>
    </Form.Item>
  )
}

export default CaptchaField
