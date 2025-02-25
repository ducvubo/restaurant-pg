'use server'

import { sendRequest } from '@/lib/api'
import { ICatIngredient } from './cat-ingredient.interface'

const URL_INVENTORY = process.env.URL_SERVER_INVENTORY

export const createCatIngredient = async (payload: Partial<ICatIngredient>) => {
  const res: IBackendRes<ICatIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllCatIngredients = async ({
  current,
  pageSize,
  type,
  cat_igd_name
}: {
  current: string
  pageSize: string,
  cat_igd_name: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_INVENTORY}/cat-ingredient`
      : `${URL_INVENTORY}/cat-ingredient/recycle`
  const res: IBackendRes<IModelPaginate<ICatIngredient>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      cat_igd_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findCatIngredientById = async ({ cat_igd_id }: { cat_igd_id: string }) => {
  const res: IBackendRes<ICatIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient/${cat_igd_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateCatIngredient = async (payload: Partial<ICatIngredient>) => {
  const res: IBackendRes<ICatIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient`,
    method: 'PATCH',
    body: payload
  })
  console.log("🚀 ~ updateCatIngredient ~ res:", res)

  return res
}

export const deleteCatIngredient = async ({ cat_igd_id }: { cat_igd_id: string }) => {
  const res: IBackendRes<ICatIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient/${cat_igd_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreCatIngredient = async ({ cat_igd_id }: { cat_igd_id: string }) => {
  const res: IBackendRes<ICatIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient/restore/${cat_igd_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ cat_igd_id, cat_igd_status }: { cat_igd_id: string; cat_igd_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<ICatIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient/update-status`,
    method: 'PATCH',
    body: {
      cat_igd_id,
      cat_igd_status
    }
  })
  return res
}
