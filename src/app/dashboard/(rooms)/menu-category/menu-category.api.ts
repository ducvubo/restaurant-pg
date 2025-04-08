'use server'

import { sendRequest } from '@/lib/api'
import { IMenuCategory } from './menu-category.interface'

const URL_SERVER_BOOK = process.env.URL_SERVER_BOOK

export const createMenuCategory = async (payload: Partial<IMenuCategory>) => {
  const res: IBackendRes<IMenuCategory> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllMenuCategory = async ({
  current,
  pageSize,
  type,
  mcat_name
}: {
  current: string
  pageSize: string
  mcat_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_BOOK}/menu-category` : `${URL_SERVER_BOOK}/menu-category/recycle`
  const res: IBackendRes<IModelPaginate<IMenuCategory>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      mcat_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findMenuCategoryById = async ({ mcat_id }: { mcat_id: string }) => {
  const res: IBackendRes<IMenuCategory> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category/${mcat_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateMenuCategory = async (payload: Partial<IMenuCategory>) => {
  const res: IBackendRes<IMenuCategory> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteMenuCategory = async ({ mcat_id }: { mcat_id: string }) => {
  const res: IBackendRes<IMenuCategory> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category/${mcat_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreMenuCategory = async ({ mcat_id }: { mcat_id: string }) => {
  const res: IBackendRes<IMenuCategory> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category/restore/${mcat_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({
  mcat_id,
  mcat_status
}: {
  mcat_id: string
  mcat_status: 'enable' | 'disable'
}) => {
  const res: IBackendRes<IMenuCategory> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category/update-status`,
    method: 'PATCH',
    body: {
      mcat_id,
      mcat_status
    }
  })
  return res
}
