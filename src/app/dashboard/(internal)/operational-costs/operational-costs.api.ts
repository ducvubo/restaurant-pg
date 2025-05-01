'use server'

import { sendRequest } from '@/lib/api'
import { IOperationalCosts } from './operational-costs.interface'

const URL_SERVER_USER = process.env.URL_SERVER_USER

export const createOperationalCosts = async (payload: Partial<IOperationalCosts>) => {
  const res: IBackendRes<IOperationalCosts> = await sendRequest({
    url: `${URL_SERVER_USER}/operational-costs`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllOperationalCostss = async ({
  current,
  pageSize,
  type,
  OperaCostType
}: {
  current: string
  pageSize: string,
  OperaCostType: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_SERVER_USER}/operational-costs`
      : `${URL_SERVER_USER}/operational-costs/recycle`
  const res: IBackendRes<IModelPaginate<IOperationalCosts>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex: current,
      pageSize,
      OperaCostType
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findOperationalCostsById = async ({ opera_cost_id }: { opera_cost_id: string }) => {
  const res: IBackendRes<IOperationalCosts> = await sendRequest({
    url: `${URL_SERVER_USER}/operational-costs/${opera_cost_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateOperationalCosts = async (payload: Partial<IOperationalCosts>) => {
  const res: IBackendRes<IOperationalCosts> = await sendRequest({
    url: `${URL_SERVER_USER}/operational-costs`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteOperationalCosts = async ({ opera_cost_id }: { opera_cost_id: string }) => {
  const res: IBackendRes<IOperationalCosts> = await sendRequest({
    url: `${URL_SERVER_USER}/operational-costs/${opera_cost_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreOperationalCosts = async ({ opera_cost_id }: { opera_cost_id: string }) => {
  const res: IBackendRes<IOperationalCosts> = await sendRequest({
    url: `${URL_SERVER_USER}/operational-costs/restore/${opera_cost_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatusOperationalCosts = async (payload: {
  opera_cost_id: string
  opera_cost_status: 'pending' | 'paid' | 'canceled'
}) => {
  const res: IBackendRes<IOperationalCosts> = await sendRequest({
    url: `${URL_SERVER_USER}/operational-costs/update-status`,
    method: 'PATCH',
    body: payload
  })
  return res
}