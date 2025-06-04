'use server'

import { sendRequest } from '@/lib/api'
import { IPolicy } from './policy.interface'

export const createPolicy = async (payload: Omit<IPolicy, 'poly_status' | 'isDeleted' | 'id'>) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/policy`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllPolicy = async ({
  current,
  pageSize,
  poly_name = '',
  type
}: {
  current: string
  pageSize: string
  poly_name?: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${process.env.URL_SERVER}/policy` : `${process.env.URL_SERVER}/policy/recycle`
  const res: IBackendRes<IModelPaginate<IPolicy>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      poly_name,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findPolicyById = async ({ _id }: { _id: string }) => {
  const res: IBackendRes<IPolicy> = await sendRequest({
    url: `${process.env.URL_SERVER}/policy/${_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updatePolicy = async (payload: Omit<IPolicy, 'poly_status' | 'isDeleted'>) => {
  const res: IBackendRes<IPolicy> = await sendRequest({
    url: `${process.env.URL_SERVER}/policy`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deletePolicy = async ({ _id }: { _id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/policy/${_id}`,
    method: 'DELETE'
  })
  return res
}

export const restorePolicy = async ({ _id }: { _id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/policy/restore/${_id}`,
    method: 'PATCH'
  })
  return res
}

export const updateStatus = async ({ _id, poly_status }: { _id: string; poly_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IPolicy> = await sendRequest({
    url: `${process.env.URL_SERVER}/policy/update-status`,
    method: 'PATCH',
    body: {
      _id,
      poly_status
    }
  })
  return res
}
