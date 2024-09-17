import styles from './styles.module.css'
import { clsx } from '@aiszlab/relax'

const SignIn = () => {
  return (
    <main className='h-screen w-screen flex flex-row'>
      <div className={clsx('flex-1', styles.cover)}>
        <div></div>
      </div>
      <div className='flex-1'></div>
    </main>
  )
}

export default SignIn
