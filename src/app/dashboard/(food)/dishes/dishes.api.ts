'use server'

import { sendRequest } from '@/lib/api'
import { IDish } from './dishes.interface'

export const createDish = async (payload: Omit<IDish, 'dish_status' | 'isDeleted' | 'id'>) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllDish = async ({
  current,
  pageSize,
  type
}: {
  current: string
  pageSize: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${process.env.URL_SERVER}/dishes` : `${process.env.URL_SERVER}/dishes/recycle`
  const res: IBackendRes<IModelPaginate<IDish>> = await sendRequest({
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

export const findDishById = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IDish> = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateDish = async (payload: Omit<IDish, 'dish_status' | 'isDeleted'>) => {
  const res: IBackendRes<IDish> = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteDish = async ({ _id }: { _id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes/${_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreDish = async ({ _id }: { _id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes/restore/${_id}`,
    method: 'PATCH'
  })
  return res
}

export const updateStatus = async ({ _id, dish_status }: { _id: string; dish_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IDish> = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes/update-status`,
    method: 'PATCH',
    body: {
      _id,
      dish_status
    }
  })
  return res
}
