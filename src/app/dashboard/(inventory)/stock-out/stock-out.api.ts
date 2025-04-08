'use server'

import { sendRequest } from '@/lib/api'
import { IStockOut } from './stock-out.interface'
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

export const createStockOut = async (payload: Partial<IStockOut>) => {
  const res: IBackendRes<IStockOut> = await sendRequest({
    url: `${URL_INVENTORY}/stock-out`,
    method: 'POST',
    body: payload
  })

  return res
}

export const updateStockOut = async (payload: Partial<IStockOut>) => {
  const res: IBackendRes<IStockOut> = await sendRequest({
    url: `${URL_INVENTORY}/stock-out`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const getAllStockOuts = async ({
  current,
  pageSize,
  type,
  stko_code
}: {
  current: string
  pageSize: string
  stko_code: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_INVENTORY}/stock-out` : `${URL_INVENTORY}/stock-out/recycle`
  const res: IBackendRes<IModelPaginate<IStockOut>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      stko_code
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findStockOutById = async ({ stko_id }: { stko_id: string }) => {
  const res: IBackendRes<IStockOut> = await sendRequest({
    url: `${URL_INVENTORY}/stock-out/${stko_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const deleteStockOut = async ({ stko_id }: { stko_id: string }) => {
  const res: IBackendRes<IStockOut> = await sendRequest({
    url: `${URL_INVENTORY}/stock-out/${stko_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreStockOut = async ({ stko_id }: { stko_id: string }) => {
  const res: IBackendRes<IStockOut> = await sendRequest({
    url: `${URL_INVENTORY}/stock-out/restore/${stko_id}`,
    method: 'PATCH'
  })

  return res
}
