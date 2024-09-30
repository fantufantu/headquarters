import { Layout, Skeleton } from 'musae'

const Placeholder = () => {
  return (
    <Layout className='w-screen h-screen'>
      <Layout.Header className='justify-between'>
        <Skeleton className='w-40 h-8' />
        <Skeleton variant='avatar' />
      </Layout.Header>

      <Layout.Sider className='pl-8'>
        <Skeleton className='h-6' />
        <div className='flex flex-col gap-4 mt-4 pl-4'>
          <Skeleton className='h-6' />
          <Skeleton className='h-6' />
          <Skeleton className='h-6' />
          <Skeleton className='h-6' />
          <Skeleton className='h-6' />
        </div>
      </Layout.Sider>

      <Layout.Main>
        <Skeleton />
      </Layout.Main>
    </Layout>
  )
}

export default Placeholder
