'use server'

import { sendRequest } from '@/lib/api'
import { IUnit } from './unit.interface'

const URL_INVENTORY = process.env.URL_SERVER_INVENTORY

export const createUnit = async (payload: Partial<IUnit>) => {
  const res: IBackendRes<IUnit> = await sendRequest({
    url: `${URL_INVENTORY}/units`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllUnits = async ({
  current,
  pageSize,
  type,
  unt_name
}: {
  current: string
  pageSize: string
  unt_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_INVENTORY}/units` : `${URL_INVENTORY}/units/recycle`
  const res: IBackendRes<IModelPaginate<IUnit>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      unt_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findUnitById = async ({ unt_id }: { unt_id: string }) => {
  const res: IBackendRes<IUnit> = await sendRequest({
    url: `${URL_INVENTORY}/units/${unt_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateUnit = async (payload: Partial<IUnit>) => {
  const res: IBackendRes<IUnit> = await sendRequest({
    url: `${URL_INVENTORY}/units`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteUnit = async ({ unt_id }: { unt_id: string }) => {
  const res: IBackendRes<IUnit> = await sendRequest({
    url: `${URL_INVENTORY}/units/${unt_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreUnit = async ({ unt_id }: { unt_id: string }) => {
  const res: IBackendRes<IUnit> = await sendRequest({
    url: `${URL_INVENTORY}/units/restore/${unt_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ unt_id, unt_status }: { unt_id: string; unt_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IUnit> = await sendRequest({
    url: `${URL_INVENTORY}/units/update-status`,
    method: 'PATCH',
    body: {
      unt_id,
      unt_status
    }
  })
  return res
}
