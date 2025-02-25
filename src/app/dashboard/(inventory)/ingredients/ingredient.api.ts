'use server'

import { sendRequest } from '@/lib/api'
import { IIngredient } from './ingredient.interface'
import { ICatIngredient } from '../cat-ingredients/cat-ingredient.interface'
import { IUnit } from '../units/unit.interface'

const URL_INVENTORY = process.env.URL_SERVER_INVENTORY

export const createIngredient = async (payload: Partial<IIngredient>) => {
  const res: IBackendRes<IIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllIngredients = async ({
  current,
  pageSize,
  type,
  igd_name
}: {
  current: string
  pageSize: string
  igd_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_INVENTORY}/ingredients` : `${URL_INVENTORY}/ingredients/recycle`
  const res: IBackendRes<IModelPaginate<IIngredient>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      igd_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findIngredientById = async ({ igd_id }: { igd_id: string }) => {
  const res: IBackendRes<IIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients/${igd_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateIngredient = async (payload: Partial<IIngredient>) => {
  const res: IBackendRes<IIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteIngredient = async ({ igd_id }: { igd_id: string }) => {
  const res: IBackendRes<IIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients/${igd_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreIngredient = async ({ igd_id }: { igd_id: string }) => {
  const res: IBackendRes<IIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients/restore/${igd_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ igd_id, igd_status }: { igd_id: string; igd_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IIngredient> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients/update-status`,
    method: 'PATCH',
    body: {
      igd_id,
      igd_status
    }
  })
  return res
}

export const findAllCategories = async () => {
  const res: IBackendRes<ICatIngredient[]> = await sendRequest({
    url: `${URL_INVENTORY}/cat-ingredient/cat-name`,
    method: 'GET'
  })
  return res
}

export const findAllUnits = async () => {
  const res: IBackendRes<IUnit[]> = await sendRequest({
    url: `${URL_INVENTORY}/units/unit-name`,
    method: 'GET'
  })
  return res
}
