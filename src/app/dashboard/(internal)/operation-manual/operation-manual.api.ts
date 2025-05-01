'use server'

import { sendRequest } from '@/lib/api'
import { IOperationManual } from './operation-manual.interface'

const URL_SERVER_USER = process.env.URL_SERVER_USER

export const createOperationManual = async (payload: Partial<IOperationManual>) => {
  const res: IBackendRes<IOperationManual> = await sendRequest({
    url: `${URL_SERVER_USER}/operation-manual`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllOperationManuals = async ({
  current,
  pageSize,
  type,
  OperaManualTitle
}: {
  current: string
  pageSize: string,
  OperaManualTitle: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_SERVER_USER}/operation-manual`
      : `${URL_SERVER_USER}/operation-manual/recycle`
  const res: IBackendRes<IModelPaginate<IOperationManual>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex: current,
      pageSize,
      OperaManualTitle
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findOperationManualById = async ({ opera_manual_id }: { opera_manual_id: string }) => {
  const res: IBackendRes<IOperationManual> = await sendRequest({
    url: `${URL_SERVER_USER}/operation-manual/${opera_manual_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateOperationManual = async (payload: Partial<IOperationManual>) => {
  const res: IBackendRes<IOperationManual> = await sendRequest({
    url: `${URL_SERVER_USER}/operation-manual`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteOperationManual = async ({ opera_manual_id }: { opera_manual_id: string }) => {
  const res: IBackendRes<IOperationManual> = await sendRequest({
    url: `${URL_SERVER_USER}/operation-manual/${opera_manual_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreOperationManual = async ({ opera_manual_id }: { opera_manual_id: string }) => {
  const res: IBackendRes<IOperationManual> = await sendRequest({
    url: `${URL_SERVER_USER}/operation-manual/restore/${opera_manual_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatusOperationManual = async (payload: {
  opera_manual_id: string
  opera_manual_status: "active" | "archived"
}) => {
  const res: IBackendRes<IOperationManual> = await sendRequest({
    url: `${URL_SERVER_USER}/operation-manual/update-status`,
    method: 'PATCH',
    body: payload
  })
  return res
}