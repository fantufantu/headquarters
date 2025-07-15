import { Table, Pagination, Loading, Button } from 'musae'
import { useColumns } from './hooks'
import EditableDrawer, { type EditableDrawerRef } from '../../components/category/editable-drawer'
import { useRef } from 'react'
import { useEvent } from '@aiszlab/relax'
import { useResumeTemplates } from '../../hooks/resume-template.hooks'
import { ResumeTemplate } from '../../api/resume-template.types'

const ResumeTemplates = () => {
  const {
    resumeTemplates,
    onPageChange,
    onPageSizeChange,
    page,
    isLoading,
    pageSize,
    total,
    refetch: _refetch
  } = useResumeTemplates()

  const ref = useRef<EditableDrawerRef>(null)

  const refetch = useEvent(() => {
    onPageChange(1)
    _refetch({ paginateBy: { page: 1, limit: pageSize } })
  })

  const columns = useColumns()

  const add = useEvent(() => {
    ref.current?.open()
  })

  return (
    <Loading className='flex flex-col gap-4' loading={isLoading}>
      <div>
        <Button onClick={add}>新增分类</Button>
      </div>

      <Table<ResumeTemplate> columns={columns} bordered dataSource={resumeTemplates} />

      <Pagination
        at={page}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <EditableDrawer ref={ref} onSubmitted={refetch} />
    </Loading>
  )
}

export default ResumeTemplates
