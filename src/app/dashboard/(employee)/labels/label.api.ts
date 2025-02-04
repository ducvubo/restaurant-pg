'use server'

import { sendRequest } from '@/lib/api'
import { ILabel } from './label.interface'

const URL_SERVER_EMPLOYEE = process.env.URL_SERVER_EMPLOYEE

export const createLabel = async (payload: Partial<ILabel>) => {
  const res: IBackendRes<ILabel> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllLabels = async ({
  pageIndex,
  pageSize,
  type,
  lb_name
}: {
  pageIndex: string
  pageSize: string
  lb_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_EMPLOYEE}/labels` : `${URL_SERVER_EMPLOYEE}/labels/recycle`
  const res: IBackendRes<IModelPaginate<ILabel>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      lb_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findLabelById = async ({ lb_id }: { lb_id: string }) => {
  const res: IBackendRes<ILabel> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels/${lb_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateLabel = async (payload: Partial<ILabel>) => {
  const res: IBackendRes<ILabel> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteLabel = async ({ lb_id }: { lb_id: string }) => {
  const res: IBackendRes<ILabel> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels/${lb_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreLabel = async ({ lb_id }: { lb_id: string }) => {
  const res: IBackendRes<ILabel> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels/restore/${lb_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ lb_id, lb_status }: { lb_id: string; lb_status: 'ENABLED' | 'DISABLED' }) => {
  const res: IBackendRes<ILabel> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels/update-status`,
    method: 'PATCH',
    body: {
      lb_id,
      lb_status
    }
  })
  console.log('🚀 ~ updateStatus ~ res:', res)
  return res
}
