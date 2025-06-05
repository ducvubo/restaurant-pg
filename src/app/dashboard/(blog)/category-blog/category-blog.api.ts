'use server'

import { sendRequest } from '@/lib/api'
import { ICategory } from './category-blog.interface'

const URL_SERVER_BLOG = process.env.URL_SERVER_BLOG

export const createCategory = async (payload: Partial<ICategory>) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllCategorys = async ({
  pageIndex,
  pageSize,
  type,
  catName
}: {
  pageIndex: string
  pageSize: string
  catName: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_BLOG}/categories` : `${URL_SERVER_BLOG}/categories/recycle`
  const res: IBackendRes<IModelPaginate<ICategory>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      catName
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findCategoryById = async ({ catId }: { catId: string }) => {
  console.log("🚀 ~ findCategoryById ~ catId:", catId)
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories/${catId}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  console.log("🚀 ~ findCategoryById ~ res:", res)
  return res
}

export const updateCategory = async (payload: Partial<ICategory>) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteCategory = async ({ catId }: { catId: string }) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories/${catId}`,
    method: 'DELETE'
  })

  return res
}

export const restoreCategory = async ({ catId }: { catId: string }) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories/restore/${catId}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ catId, catStatus }: { catId: string; catStatus: 'ENABLED' | 'DISABLED' }) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories/update-status`,
    method: 'PATCH',
    body: {
      catId,
      catStatus
    }
  })
  return res
}
