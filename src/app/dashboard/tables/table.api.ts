'use server'

import { sendRequest } from '@/lib/api'
import { ITable } from './table.interface'

export const createTable = async (payload: any) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllTables = async ({
  current,
  pageSize,
  tbl_name = '',
  type
}: {
  current: string
  pageSize: string
  tbl_name?: string
  type: 'all' | 'recycle'
}) => {
  console.log("🚀 ~ tbl_name:", tbl_name)
  const url = type === 'all' ? `${process.env.URL_SERVER}/tables` : `${process.env.URL_SERVER}/tables/recycle`
  const res: IBackendRes<IModelPaginate<ITable>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      tbl_name,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findTableById = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })

  return res
}

export const updateTable = async (payload: any) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteTable = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables/${_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreTable = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables/restore/${_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({
  _id,
  tbl_status
}: {
  _id: string
  tbl_status: 'enable' | 'disable' | 'serving'
}) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables/update-status`,
    method: 'PATCH',
    body: {
      _id,
      tbl_status
    }
  })
  return res
}

export const updateQrCode = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<ITable> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables/update-token/${_id}`,
    method: 'PATCH'
  })
  return res
}
