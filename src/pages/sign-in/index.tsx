import { useTheme, Form, Input, Checkbox, Button, PasswordInput } from 'musae'
import styles from './styles.module.css'
import { stringify } from '@aiszlab/relax/class-name'
import { KeyboardDoubleArrowRight } from 'musae/icons'
import { useMutation } from '@apollo/client'
import { SIGN_IN } from '../../api/authentication'
import { useCallback } from 'react'
import { useWho } from '../../hooks/authentication.hooks'
import { AuthenticationToken } from '../../store/tokens'
import { redirectBy, RedirectToken } from '../../utils/redirect-by'
import { Link } from '@aiszlab/bee/router'

interface FormValues {
  who: string
  password: string
  isRememberMe?: boolean
}

const SignIn = () => {
  const theme = useTheme()
  const [_login] = useMutation(SIGN_IN)
  const form = Form.useForm<FormValues>()
  const { whoAmI } = useWho()

  // 用户登录
  const login = useCallback(async () => {
    const isValid = await form.validate()
    if (!isValid) return

    const { isRememberMe, who = '', password = '' } = form.getFieldsValue()
    const authenticated = (
      await _login({
        variables: {
          loginBy: {
            password,
            who
          }
        }
      }).catch(() => null)
    )?.data?.login

    if (!authenticated) return

    await whoAmI(authenticated)
    ;(isRememberMe ? globalThis.window.localStorage : globalThis.window.sessionStorage).setItem(
      AuthenticationToken.Authenticated,
      authenticated
    )

    // 重定向-单点登录
    redirectBy(({ isSameOrigin }) => ({
      ...(!isSameOrigin && { [RedirectToken.Authenticated]: authenticated })
    }))
  }, [_login, form, whoAmI])

  return (
    <main className='h-screen w-screen flex flex-row'>
      <div className={stringify('flex-1 flex justify-center items-center', styles.cover)}>
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
            <span
              className='ml-auto font-medium'
              style={{
                color: theme.colors['outline-variant']
              }}
            >
              I am new here!
            </span>

            <Link
              className='font-semibold'
              to={`/sign-up${window.location.search}`}
              style={{
                color: theme.colors.primary
              }}
            >
              Sign Up
            </Link>
          </div>

          <section className='mt-28'>
            <h3 className='text-2xl font-bold'>Login your Account</h3>

            {/* className="mt-10" */}
            <Form form={form}>
              <Form.Item
                label='Email Address or username'
                required
                name='who'
                rules={[
                  {
                    validate: (_v) => !!_v,
                    message: '请输入邮箱或用户名'
                  }
                ]}
              >
                <Input className='w-full' />
              </Form.Item>

              <Form.Item
                label='Password'
                required
                name='password'
                rules={[
                  {
                    validate: (_v) => !!_v,
                    message: '请输入密码'
                  }
                ]}
              >
                <PasswordInput className='w-full' />
              </Form.Item>

              <Form.Item className='flex items-center justify-between' name='isRememberMe'>
                <Checkbox>Remember me</Checkbox>
                <a
                  className='text-xs font-semibold'
                  style={{
                    color: theme.colors.primary
                  }}
                  href='/forgot-password'
                >
                  Forgot password?
                </a>
              </Form.Item>

              <Form.Item>
                <Button className='w-52' suffix={<KeyboardDoubleArrowRight />} onClick={login}>
                  Sign In
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
