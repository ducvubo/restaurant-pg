'use server'

import { sendRequest } from '@/lib/api'
import { IFood } from './food.interface'

export const getAllFoods = async ({
  current,
  pageSize,
  food_name = '',
  type
}: {
  current: string
  pageSize: string
  food_name?: string
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${process.env.URL_SERVER_ORDER}/food-restaurant`
      : `${process.env.URL_SERVER_ORDER}/food-restaurant/recycle`
  const res: IBackendRes<IModelPaginate<IFood>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      food_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const createFood = async (payload: Partial<IFood>) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant`,
    method: 'POST',
    body: payload
  })
  return res
}

export const updateFood = async (payload: Partial<IFood>) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const findFoodById = async (id: string) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/${id}`,
    method: 'GET'
  })

  return res
}

export const updateStatusFood = async (data: { food_id: string; food_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/update-status`,
    method: 'PATCH',
    body: data
  })

  return res
}

export const updateStateFood = async (data: { food_id: string; food_state: 'soldOut' | 'inStock' | 'almostOut' }) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/update-state`,
    method: 'PATCH',
    body: data
  })

  return res
}

export const deleteFood = async (id: string) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/${id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreFood = async (id: string) => {
  const res: IBackendRes<IFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/restore/${id}`,
    method: 'PATCH'
  })

  return res
}
