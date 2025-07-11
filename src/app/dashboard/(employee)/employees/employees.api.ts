'use server'

import { sendRequest } from '@/lib/api'
import { IEmployee } from './employees.interface'

export const createEmployee = async (payload: Omit<IEmployee, 'epl_status' | '_id'>) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllEmployees = async ({
  current,
  pageSize,
  epl_name = '',
  type
}: {
  current: string
  pageSize: string
  epl_name?: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${process.env.URL_SERVER}/employees` : `${process.env.URL_SERVER}/employees/recycle`
  const res: IBackendRes<IModelPaginate<IEmployee[]>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      epl_name,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findOneEmployee = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateEmployee = async (payload: Omit<IEmployee, 'epl_status'>) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteEmployee = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/${_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreEmployee = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/restore/${_id}`,
    method: 'PATCH'
  })
  return res
}

export const updateStatus = async ({ _id, epl_status }: { _id: string; epl_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/update-status`,
    method: 'PATCH',
    body: {
      _id,
      epl_status
    }
  })
  return res
}

export const deleteFaceId = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/delete-face`,
    method: 'DELETE',
    queryParams: {
      id: _id
    }
  })
  return res
}
