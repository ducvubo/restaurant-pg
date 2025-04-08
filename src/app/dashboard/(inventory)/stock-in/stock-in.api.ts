'use server'

import { sendRequest } from '@/lib/api'
import { IStockIn } from './stock-in.interface'
import { ISupplier } from '../suppliers/supplier.interface'
import { IEmployee } from '../../(employee)/employees/employees.interface'
import { IIngredient } from '../ingredients/ingredient.interface'

const URL_INVENTORY = process.env.URL_SERVER_INVENTORY
const URL_SERVER = process.env.URL_SERVER

export const findSupplierName = async () => {
  const res: IBackendRes<ISupplier[]> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers/supplier-name`,
    method: 'GET'
  })
  return res
}

export const findEmployeeName = async () => {
  const res: IBackendRes<IEmployee[]> = await sendRequest({
    url: `${URL_SERVER}/employees/employee-name`,
    method: 'GET'
  })
  return res
}

export const findIngredientName = async () => {
  const res: IBackendRes<IIngredient[]> = await sendRequest({
    url: `${URL_INVENTORY}/ingredients/ingredient-name`,
    method: 'GET'
  })
  return res
}

export const createStockIn = async (payload: Partial<IStockIn>) => {
  const res: IBackendRes<IStockIn> = await sendRequest({
    url: `${URL_INVENTORY}/stock-in`,
    method: 'POST',
    body: payload
  })

  return res
}

export const updateStockIn = async (payload: Partial<IStockIn>) => {
  const res: IBackendRes<IStockIn> = await sendRequest({
    url: `${URL_INVENTORY}/stock-in`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const getAllStockIns = async ({
  current,
  pageSize,
  type,
  stki_code
}: {
  current: string
  pageSize: string
  stki_code: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_INVENTORY}/stock-in` : `${URL_INVENTORY}/stock-in/recycle`
  const res: IBackendRes<IModelPaginate<IStockIn>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      stki_code
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findStockInById = async ({ stki_id }: { stki_id: string }) => {
  const res: IBackendRes<IStockIn> = await sendRequest({
    url: `${URL_INVENTORY}/stock-in/${stki_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const deleteStockIn = async ({ stki_id }: { stki_id: string }) => {
  const res: IBackendRes<IStockIn> = await sendRequest({
    url: `${URL_INVENTORY}/stock-in/${stki_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreStockIn = async ({ stki_id }: { stki_id: string }) => {
  const res: IBackendRes<IStockIn> = await sendRequest({
    url: `${URL_INVENTORY}/stock-in/restore/${stki_id}`,
    method: 'PATCH'
  })

  return res
}


