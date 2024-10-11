import { useTheme, Form, Input, Button, Countdown } from 'musae'
import styles from './styles.module.css'
import { clsx, useEvent } from '@aiszlab/relax'
import { KeyboardArrowLeft, KeyboardDoubleArrowRight } from 'musae/icons'
import { Link } from '@aiszlab/bee/router'
import { useMutation } from '@apollo/client'
import { SIGN_UP } from '../../api/authentication'

interface FormValues {
  username: string
  email: string
  captcha: string
}

const SignIn = () => {
  const theme = useTheme()
  const form = Form.useForm<FormValues>()
  const [_signUp] = useMutation(SIGN_UP)

  const signUp = useEvent(async () => {
    const isValid = await form.trigger().catch(() => false)
    if (!isValid) return

    await _signUp({
      variables: {
        loginBy: form.getValues() as any
      }
    })
  })

  return (
    <main className='h-screen w-screen flex flex-row'>
      <div className={clsx('flex-1 flex justify-center items-center', styles.cover)}>
        <div className='relative my-52 mx-40'>
          <img
            width='100%'
            height='auto'
            src='https://s3-alpha-sig.figma.com/img/db9e/5204/baddde6ac60cef3494a2d9433b5f2293?Expires=1727654400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CsqxMaq7n3VF7td8~QvZJBWIUGy3waieRbJbIFZIdWNhOgaB-dkB9uYCWLDQXXQxXFc6Paxi~YLsEcG9hYFVj6NSn4mwW4TRGhW2LSz-MomxfU~4kHkqF0Z-kcC2RK5P1B~OpgWtFNBwUqRfX-EEL-cYu2R~8UD1r6S4PYd3MJE0nY~5bgYywG4rR0Ezl9h-JljplasJBqW0C-CVAqOUbbtkNjrR~XrAT0fhUlBPl1orRH-WvflmkGuAowLclxf81n7GGS~lUUSZ6igScEQ0i7KQfcOobkMV~2KqxMU~pUkDpJy7JlJLWNMiJGeJqkgFCgd-CaFUXXVVf6Hl8VdPNQ__'
            alt='Sign In'
          />
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

              <Form.Item label='Email Address' required name='email'>
                <Input className='w-full' />
              </Form.Item>

              <Form.Item label='Captcha' className='flex items-center gap-2' required name='captcha'>
                <Input className='w-full' />
                <Countdown>GET</Countdown>
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
