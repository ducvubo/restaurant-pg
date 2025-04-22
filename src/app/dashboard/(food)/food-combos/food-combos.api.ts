'use server'

import { sendRequest } from '@/lib/api'
import { IFoodComboRes } from './food-combos.interface'
import { IFood } from '../foods/food.interface'

export const getAllFoodCombos = async ({
  current,
  pageSize,
  fcb_name = '',
  type
}: {
  current: string
  pageSize: string
  fcb_name?: string
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${process.env.URL_SERVER_ORDER}/combo-food-res`
      : `${process.env.URL_SERVER_ORDER}/combo-food-res/recycle`
  const res: IBackendRes<IModelPaginate<IFoodComboRes>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      fcb_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}


export const createFoodCombo = async (payload: Partial<IFoodComboRes>) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res`,
    method: 'POST',
    body: payload
  })
  return res
}

export const updateFoodCombo = async (payload: Partial<IFoodComboRes>) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const findFoodComboById = async (id: string) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/${id}`,
    method: 'GET'
  })

  return res
}

export const updateStatusFoodCombo = async (data: { fcb_id: string; fcb_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/update-status`,
    method: 'PATCH',
    body: data
  })

  return res
}

export const updateStateFoodCombo = async (data: {
  fcb_id: string
  fcb_state: 'soldOut' | 'inStock' | 'almostOut'
}) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/update-state`,
    method: 'PATCH',
    body: data
  })

  return res
}

export const deleteFoodCombo = async (id: string) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/${id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreFoodCombo = async (id: string) => {
  const res: IBackendRes<IFoodComboRes> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/restore/${id}`,
    method: 'PATCH'
  })

  return res
}

export const getListFood = async () => {
  const res: IBackendRes<IFood[]> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/food-name`,
    method: 'GET'
  })

  return res
}
