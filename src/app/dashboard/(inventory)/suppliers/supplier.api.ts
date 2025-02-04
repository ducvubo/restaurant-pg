'use server'

import { sendRequest } from '@/lib/api'
import { ISupplier } from './supplier.interface'

const URL_INVENTORY = process.env.URL_SERVER_INVENTORY

export const createSupplier = async (payload: Partial<ISupplier>) => {
  const res: IBackendRes<ISupplier> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllSuppliers = async ({
  current,
  pageSize,
  type,
  spli_name
}: {
  current: string
  pageSize: string,
  spli_name: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_INVENTORY}/suppliers`
      : `${URL_INVENTORY}/suppliers/recycle`
  const res: IBackendRes<IModelPaginate<ISupplier>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      spli_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findSupplierById = async ({ spli_id }: { spli_id: string }) => {
  const res: IBackendRes<ISupplier> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers/${spli_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateSupplier = async (payload: Partial<ISupplier>) => {
  const res: IBackendRes<ISupplier> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteSupplier = async ({ spli_id }: { spli_id: string }) => {
  const res: IBackendRes<ISupplier> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers/${spli_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreSupplier = async ({ spli_id }: { spli_id: string }) => {
  const res: IBackendRes<ISupplier> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers/restore/${spli_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ spli_id, spli_status }: { spli_id: string; spli_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<ISupplier> = await sendRequest({
    url: `${URL_INVENTORY}/suppliers/update-status`,
    method: 'PATCH',
    body: {
      spli_id,
      spli_status
    }
  })
  return res
}
