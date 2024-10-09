'use server'

import { sendRequest } from '@/lib/api'
import { IBlog } from './blog.interface'

export const createBlog = async (
  payload: Omit<IBlog, 'blg_restaurant_id' | '_id' | 'isDeleted' | 'blg_status' | 'blg_verify'>
) => {
  const res: IBackendRes<IBlog> = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllBlog = async ({
  current,
  pageSize,
  type
}: {
  current: string
  pageSize: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${process.env.URL_SERVER}/blogs` : `${process.env.URL_SERVER}/blogs/recycle`
  const res: IBackendRes<IModelPaginate<IBlog>> = await sendRequest({
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

export const findBLogById = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IBlog> = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateBlog = async (
  payload: Omit<IBlog, 'blg_restaurant_id' | 'isDeleted' | 'blg_status' | 'blg_verify'>
) => {
  const res: IBackendRes<IBlog> = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const updateBlogStatus = async ({ _id, blg_status }: { _id: string; blg_status: 'draft' | 'publish' }) => {
  const res: IBackendRes<IBlog> = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs/update-status`,
    method: 'PATCH',
    body: {
      blg_status,
      _id
    }
  })
  return res
}

export const deleteBlog = async ({ _id }: { _id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs/${_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreBlog = async ({ _id }: { _id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs/restore/${_id}`,
    method: 'PATCH'
  })
  return res
}
