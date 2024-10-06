import { Layout, Skeleton } from 'musae'

const Placeholder = () => {
  return (
    <Layout className='w-screen h-screen'>
      <Layout.Header className='justify-between'>
        <Skeleton className='w-40 h-8' />
        <Skeleton className='w-8 h-8 rounded-full' />
      </Layout.Header>

      <Layout.Sider className='pl-8 flex flex-col gap-4'>
        {Array.from({ length: 2 }).map((_, row) => {
          return [
            <Skeleton className='h-6' key={`${row}-1`} />,
            <div className='flex flex-col gap-4 pl-4' key={`${row}-2`}>
              <Skeleton className='h-6' />
              <Skeleton className='h-6' />
              <Skeleton className='h-6' />
            </div>
          ]
        })}
      </Layout.Sider>

      <Layout.Main className='px-12 flex flex-col gap-4'>
        <Skeleton className='w-40 h-10' />
        <Skeleton className='h-80' />
        <Skeleton className='h-10' />
      </Layout.Main>
    </Layout>
  )
}

export default Placeholder
