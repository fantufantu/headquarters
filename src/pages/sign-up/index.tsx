import { useTheme, Form, Input, Button, Countdown, OtpInput, useMessage, PasswordInput } from 'musae'
import styles from './styles.module.css'
import { clsx, useEvent } from '@aiszlab/relax'
import { KeyboardArrowLeft, KeyboardDoubleArrowRight } from 'musae/icons'
import { Link } from '@aiszlab/bee/router'
import { useMutation } from '@apollo/client'
import { SEND_CAPTCHA, SIGN_UP } from '../../api/authentication'
import { useWho } from '../../hooks/authentication.hooks'
import { redirectBy, RedirectToken } from '../../utils/redirect-by'
import { AuthenticationToken } from '../../storage/tokens'

interface FormValues {
  username: string
  emailAddress: string
  captcha: string
  password: string
}

const SignIn = () => {
  const theme = useTheme()
  const form = Form.useForm<FormValues>()
  const [_signUp] = useMutation(SIGN_UP)
  const { whoAmI } = useWho()
  const [_sendCaptcha] = useMutation(SEND_CAPTCHA)
  const [messager] = useMessage()

  const signUp = useEvent(async () => {
    const isValid = await form.trigger().catch(() => false)
    if (!isValid) return

    const authenticated = (
      await _signUp({
        variables: {
          registerBy: form.getValues()
        }
      }).catch(() => null)
    )?.data?.register

    if (!authenticated) return

    await whoAmI(authenticated)
    globalThis.window.sessionStorage.setItem(AuthenticationToken.Authenticated, authenticated)

    // 重定向-单点登录
    redirectBy(({ isSameOrigin }) => ({ ...(!isSameOrigin && { [RedirectToken.Redirect]: authenticated }) }))
  })

  const { invalid: isEmailAddressInvalid } = form.getFieldState('emailAddress', form.formState)
  const { emailAddress } = form.getValues()

  const sendCaptcha = useEvent(async () => {
    const sent = (
      await _sendCaptcha({
        variables: {
          sendBy: {
            to: emailAddress
          }
        }
      }).catch(() => null)
    )?.data?.sendCaptcha

    if (!sent) return
    messager.success({ description: '验证码已发送至您邮箱' })
  })

  return (
    <main className='h-screen w-screen flex flex-row'>
      <div className={clsx('flex-1 flex justify-center items-center', styles.cover)}>
        <div className='relative my-52 mx-40'>
          <img width='100%' height='auto' src='/account.png' alt='Sign In' />
          <span
            className='absolute left-0 top-0 text-5xl font-bold -translate-y-full -translate-x-4'
            style={{
              color: theme.colors['on-primary']
            }}
          >
            Welcome
          </span>
        </div>
      </div>
      <div className='flex-1 flex flex-col'>
        <div className='px-20 py-10 flex-1'>
          <div className='flex items-center gap-2'>
            <Button variant='text' prefix={<KeyboardArrowLeft size={24} />}>
              Back
            </Button>

            <span
              className='ml-auto font-medium'
              style={{
                color: theme.colors['outline-variant']
              }}
            >
              I have an account!
            </span>

            <Link
              className='font-semibold'
              to={`/sign-in${window.location.search}`}
              style={{
                color: theme.colors.primary
              }}
            >
              Sign In
            </Link>
          </div>

          <section className='mt-28'>
            <h3 className='text-2xl font-bold'>Create your Account</h3>

            <Form className='mt-10' form={form}>
              <Form.Item label='Username' required name='username'>
                <Input className='w-full' />
              </Form.Item>

              <Form.Item label='Email Address' required name='emailAddress'>
                <Input className='w-full' />
              </Form.Item>

              <Form.Item label='Password' required name='password'>
                <PasswordInput className='w-full' />
              </Form.Item>

              <Form.Item label='Captcha' name='captcha' className='flex items-center gap-2' required>
                <OtpInput className='w-full' />
                <Countdown disabled={!emailAddress || isEmailAddressInvalid} onClick={sendCaptcha}>
                  GET CAPTCHA
                </Countdown>
              </Form.Item>

              <Form.Item>
                <Button className='w-52' suffix={<KeyboardDoubleArrowRight />} onClick={signUp}>
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default SignIn
