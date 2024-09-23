import { Table, Pagination, Loading } from 'musae'
import { useCategories } from '../../hooks/category.hooks'
import type { Category } from '../../api/category.type'

const Categories = () => {
  const { categories, onPageChange, onPageSizeChange, onSearch, page, isLoading, pageSize, total } = useCategories()

  return (
    <Loading className='flex flex-col gap-4' loading={isLoading}>
      <Table<Category> columns={[]} bordered dataSource={categories} />

      <Pagination pageSize={pageSize} total={total} />
    </Loading>
  )
}

export default Categories
