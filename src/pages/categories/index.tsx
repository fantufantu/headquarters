import { Table, Pagination, Loading, Button } from 'musae'
import { useCategories } from '../../hooks/category.hooks'
import type { Category } from '../../api/category.type'
import { useColumns } from './hooks'
import EditableDrawer, { type EditableDrawerRef } from '../../components/category/editable-drawer'
import { useRef } from 'react'
import { useEvent } from '@aiszlab/relax'

const Categories = () => {
  const {
    categories,
    onPageChange,
    onPageSizeChange,
    page,
    isLoading,
    pageSize,
    total,
    refetch: _refetch
  } = useCategories()

  const ref = useRef<EditableDrawerRef>(null)

  const columns = useColumns({
    editableRef: ref
  })

  const add = useEvent(() => {
    ref.current?.open()
  })

  const refetch = useEvent(() => {
    onPageChange(1)
    _refetch({ paginateBy: { page: 1, limit: pageSize } })
  })

  return (
    <Loading className='flex flex-col gap-4' loading={isLoading}>
      <div>
        <Button onClick={add}>新增分类</Button>
      </div>

      <Table<Category> columns={columns} bordered dataSource={categories} />

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

export default Categories
