import { useTheme, Form, Input, Checkbox, Button } from 'musae'
import styles from './styles.module.css'
import { clsx } from '@aiszlab/relax'
import { KeyboardArrowLeft, KeyboardDoubleArrowRight } from 'musae/icons'

const SignIn = () => {
  const theme = useTheme()

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

            <a
              className='font-semibold'
              href='/sign-up'
              style={{
                color: theme.colors.primary
              }}
            >
              Sign Up
            </a>
          </div>

          <section className='mt-28'>
            <h3 className='text-2xl font-bold'>Create your Account</h3>

            <Form className='mt-10'>
              <Form.Item label='Email Address or username'>
                <Input className='w-full' />
              </Form.Item>

              <Form.Item label='Password'>
                <Input type='password' className='w-full' />
              </Form.Item>

              <Form.Item className='flex items-center justify-between'>
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
                <Button className='w-52' suffix={<KeyboardDoubleArrowRight />}>
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
