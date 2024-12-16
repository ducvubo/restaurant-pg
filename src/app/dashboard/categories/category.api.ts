'use server'

import { sendRequest } from '@/lib/api'
import { ICategories } from './category.interface'

export const createCategory = async (payload: any) => {
  const res: IBackendRes<ICategories> = await sendRequest({
    url: `${process.env.URL_SERVER}/category-restaurant`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllCategories = async ({
  current,
  pageSize,
  type
}: {
  current: string
  pageSize: string
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${process.env.URL_SERVER}/category-restaurant`
      : `${process.env.URL_SERVER}/category-restaurant/recycle`
  const res: IBackendRes<IModelPaginate<ICategories>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findCategoryById = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ICategories> = await sendRequest({
    url: `${process.env.URL_SERVER}/category-restaurant/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })

  return res
}

export const updateCategory = async (payload: any) => {
  const res: IBackendRes<ICategories> = await sendRequest({
    url: `${process.env.URL_SERVER}/category-restaurant`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteCategory = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ICategories> = await sendRequest({
    url: `${process.env.URL_SERVER}/category-restaurant/${_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreCategory = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ICategories> = await sendRequest({
    url: `${process.env.URL_SERVER}/category-restaurant/restore/${_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ _id, cat_res_status }: { _id: string; cat_res_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<ICategories> = await sendRequest({
    url: `${process.env.URL_SERVER}/category-restaurant/update-status`,
    method: 'PATCH',
    body: {
      _id,
      cat_res_status
    }
  })
  return res
}
