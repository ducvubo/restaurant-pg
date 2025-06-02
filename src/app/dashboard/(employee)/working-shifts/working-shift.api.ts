'use server'

import { sendRequest } from '@/lib/api'
import { IWorkingShift } from './working-shift.interface'
import { ILabel } from '../labels/label.interface'

const URL_SERVER_EMPLOYEE = process.env.URL_SERVER_EMPLOYEE

export const createWorkingShift = async (payload: any) => {
  const res: IBackendRes<IWorkingShift> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/working-shift`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllWorkingShifts = async ({
  pageIndex,
  pageSize,
  type,
  wks_name = ''
}: {
  pageIndex: string
  pageSize: string
  type: 'all' | 'recycle',
  wks_name?: string
}) => {
  const url =
    type === 'all'
      ? `${URL_SERVER_EMPLOYEE}/working-shift`
      : `${URL_SERVER_EMPLOYEE}/working-shift/recycle`
  const res: IBackendRes<IModelPaginate<IWorkingShift>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      wks_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findWorkingShiftById = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IWorkingShift> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/working-shift/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })

  return res
}

export const updateWorkingShift = async (payload: any) => {
  const res: IBackendRes<IWorkingShift> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/working-shift`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteWorkingShift = async ({ wks_id }: { wks_id: string }) => {
  const res: IBackendRes<IWorkingShift> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/working-shift/${wks_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreWorkingShift = async ({ wks_id }: { wks_id: string }) => {
  const res: IBackendRes<IWorkingShift> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/working-shift/restore/${wks_id}`,
    method: 'PATCH'
  })

  return res
}

export const getAllLabel = async () => {
  const res: IBackendRes<ILabel[]> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/label/all`,
    method: 'GET'
  })

  return res
}
