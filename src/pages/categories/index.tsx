import { Table, Pagination, Loading } from 'musae'
import { useCategories } from '../../hooks/category.hooks'
import type { Category } from '../../api/category.type'
import { useColumns } from './hooks'

const Categories = () => {
  const { categories, onPageChange, onPageSizeChange, page, isLoading, pageSize, total } = useCategories()
  const columns = useColumns()

  return (
    <Loading className='flex flex-col gap-4' loading={isLoading}>
      <Table<Category> columns={columns} bordered dataSource={categories} />

      <Pagination
        at={page}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Loading>
  )
}

export default Categories
