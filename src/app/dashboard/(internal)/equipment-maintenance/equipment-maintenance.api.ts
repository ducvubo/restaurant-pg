'use server'

import { sendRequest } from '@/lib/api'
import { IEquipmentMaintenance } from './equipment-maintenance.interface'

const URL_SERVER_USER = process.env.URL_SERVER_USER

export const createEquipmentMaintenance = async (payload: Partial<IEquipmentMaintenance>) => {
  const res: IBackendRes<IEquipmentMaintenance> = await sendRequest({
    url: `${URL_SERVER_USER}/equipment-maintenance`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllEquipmentMaintenances = async ({
  current,
  pageSize,
  type,
  EqpMtnName
}: {
  current: string
  pageSize: string,
  EqpMtnName: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_SERVER_USER}/equipment-maintenance`
      : `${URL_SERVER_USER}/equipment-maintenance/recycle`
  const res: IBackendRes<IModelPaginate<IEquipmentMaintenance>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex: current,
      pageSize,
      EqpMtnName
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findEquipmentMaintenanceById = async ({ eqp_mtn_id }: { eqp_mtn_id: string }) => {
  const res: IBackendRes<IEquipmentMaintenance> = await sendRequest({
    url: `${URL_SERVER_USER}/equipment-maintenance/${eqp_mtn_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateEquipmentMaintenance = async (payload: Partial<IEquipmentMaintenance>) => {
  const res: IBackendRes<IEquipmentMaintenance> = await sendRequest({
    url: `${URL_SERVER_USER}/equipment-maintenance`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteEquipmentMaintenance = async ({ eqp_mtn_id }: { eqp_mtn_id: string }) => {
  const res: IBackendRes<IEquipmentMaintenance> = await sendRequest({
    url: `${URL_SERVER_USER}/equipment-maintenance/${eqp_mtn_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreEquipmentMaintenance = async ({ eqp_mtn_id }: { eqp_mtn_id: string }) => {
  const res: IBackendRes<IEquipmentMaintenance> = await sendRequest({
    url: `${URL_SERVER_USER}/equipment-maintenance/restore/${eqp_mtn_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatusEquipmentMaintenance = async (payload: {
  eqp_mtn_id: string
  eqp_mtn_status: 'pending' | ' in_progress' | ' done' | ' rejected'
}) => {
  const res: IBackendRes<IEquipmentMaintenance> = await sendRequest({
    url: `${URL_SERVER_USER}/equipment-maintenance/update-status`,
    method: 'PATCH',
    body: payload
  })
  return res
}