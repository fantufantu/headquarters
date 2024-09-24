import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_CATEGORIES } from '../../../api/category'
import { usePagination } from '../../../hooks/pagination.hooks'
import { useCallback, useMemo, useState } from 'react'
import type { Option } from 'musae/types/option'
import { useParams } from '@aiszlab/bee/router'
import { GET_ARTICLE_BY_ID } from '../../../api/article'
import { useMounted } from '@aiszlab/relax'
import { UsedForm } from 'musae/types/form'
import { useCategories as _useCategories } from '../../../hooks/category.hooks'

export interface FormValues {
  title: string
  content: string
  categories: Option[]
}

/**
 * @description
 * categories
 */
export const useCategories = () => {
  const { categories, onPageChange, onPageSizeChange, onSearch, page } = _useCategories()

  const categoryOptions = useMemo<Option[]>(() => {
    return categories.map((_category) => {
      return {
        value: _category.code,
        label: _category.name
      }
    })
  }, [categories])

  return {
    categories,
    categoryOptions,
    page,
    onPageChange,
    onPageSizeChange,
    onSearch
  }
}

/**
 * @description
 * article
 */
export const useArticle = ({ form }: { form: UsedForm<FormValues> }) => {
  const { id: _id = '' } = useParams<'id'>()
  const [getArticle, { data }] = useLazyQuery(GET_ARTICLE_BY_ID, { fetchPolicy: 'no-cache' })
  const [isLoading, setIsLoading] = useState(true)
  const id = _id ? +_id : null

  useMounted(async () => {
    await (async () => {
      if (!id) return

      const _article = (
        await getArticle({
          variables: {
            id: +id
          }
        }).catch(() => null)
      )?.data?.article

      if (!_article) return

      form.setValue('title', _article.title)
      form.setValue('content', _article.content)
      form.setValue(
        'categories',
        (_article.categories ?? []).map((_category) => ({ value: _category.code, label: _category.name }))
      )
    })()

    setIsLoading(false)
  })

  return {
    isLoading,
    article: data?.article,
    id
  }
}
