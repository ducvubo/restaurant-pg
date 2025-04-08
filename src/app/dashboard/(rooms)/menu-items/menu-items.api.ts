'use server'

import { sendRequest } from '@/lib/api'
import { IMenuItems } from './menu-items.interface'
import { IMenuCategory } from '../menu-category/menu-category.interface'

const URL_SERVER_BOOK = process.env.URL_SERVER_BOOK

export const createMenuItems = async (payload: Partial<IMenuItems>) => {
  const res: IBackendRes<IMenuItems> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-items`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllMenuItems = async ({
  current,
  pageSize,
  type,
  mitems_name
}: {
  current: string
  pageSize: string
  mitems_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_BOOK}/menu-items` : `${URL_SERVER_BOOK}/menu-items/recycle`
  const res: IBackendRes<IModelPaginate<IMenuItems>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      mitems_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findMenuItemsById = async ({ mitems_id }: { mitems_id: string }) => {
  const res: IBackendRes<IMenuItems> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-items/${mitems_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateMenuItems = async (payload: Partial<IMenuItems>) => {
  const res: IBackendRes<IMenuItems> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-items`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteMenuItems = async ({ mitems_id }: { mitems_id: string }) => {
  const res: IBackendRes<IMenuItems> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-items/${mitems_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreMenuItems = async ({ mitems_id }: { mitems_id: string }) => {
  const res: IBackendRes<IMenuItems> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-items/restore/${mitems_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({
  mitems_id,
  mitems_status
}: {
  mitems_id: string
  mitems_status: 'enable' | 'disable'
}) => {
  const res: IBackendRes<IMenuItems> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-items/update-status`,
    method: 'PATCH',
    body: {
      mitems_id,
      mitems_status
    }
  })
  return res
}

export const getAllMenuCategoryName = async () => {
  const res: IBackendRes<IMenuCategory[]> = await sendRequest({
    url: `${URL_SERVER_BOOK}/menu-category/cat-name`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  console.log('🚀 ~ getAllMenuCategoryName ~ res:', res)
  return res
}
