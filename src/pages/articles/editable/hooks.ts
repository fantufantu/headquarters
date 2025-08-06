import { useLazyQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import type { Option } from "musae/types/option";
import { useParams } from "@aiszlab/bee/router";
import { useMounted } from "@aiszlab/relax";
import { UsedForm } from "musae/types/form";
import { useCategories as _useCategories } from "../../../hooks/category.hooks";
import { ARTICLE } from "../../../api/article";

export interface FormValues {
  title: string;
  content: string;
  categories: Option[];
}

/**
 * @description
 * categories
 */
export const useCategories = () => {
  const { categories, changePage, changeLimit, onSearch, page } = _useCategories();

  const categoryOptions = useMemo<Option[]>(() => {
    return categories.map((_category) => {
      return {
        value: _category.code,
        label: _category.name,
      };
    });
  }, [categories]);

  return {
    categories,
    categoryOptions,
    page,
    changePage,
    changeLimit,
    onSearch,
  };
};

/**
 * @description
 * article
 */
export const useArticle = ({ form }: { form: UsedForm<FormValues> }) => {
  const { id: _id = "" } = useParams<"id">();
  const [getArticle, { data }] = useLazyQuery(ARTICLE);
  const [isLoading, setIsLoading] = useState(true);
  const id = _id ? +_id : null;

  useMounted(async () => {
    await (async () => {
      if (!id) return;

      const _article = (
        await getArticle({
          variables: {
            id: +id,
          },
        }).catch(() => null)
      )?.data?.article;

      if (!_article) return;

      form.setFieldsValue({
        title: _article.title,
        content: _article.content,
        categories: (_article.categories ?? []).map((_category) => ({
          value: _category.code,
          label: _category.name,
        })),
      });
    })();

    setIsLoading(false);
  });

  return {
    isLoading,
    article: data?.article,
    id,
  };
};
