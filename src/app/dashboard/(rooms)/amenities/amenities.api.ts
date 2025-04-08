'use server'

import { sendRequest } from '@/lib/api'
import { IAmenities } from './amenities.interface'

const URL_SERVER_BOOK = process.env.URL_SERVER_BOOK

export const createAmenities = async (payload: Partial<IAmenities>) => {
  const res: IBackendRes<IAmenities> = await sendRequest({
    url: `${URL_SERVER_BOOK}/amenities`,
    method: 'POST',
    body: payload
  })
  console.log('🚀 ~ createAmenities ~ res:', res)

  return res
}

export const getAllAmenities = async ({
  current,
  pageSize,
  type,
  ame_name
}: {
  current: string
  pageSize: string
  ame_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_BOOK}/amenities` : `${URL_SERVER_BOOK}/amenities/recycle`
  const res: IBackendRes<IModelPaginate<IAmenities>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      ame_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findAmenitiesById = async ({ ame_id }: { ame_id: string }) => {
  const res: IBackendRes<IAmenities> = await sendRequest({
    url: `${URL_SERVER_BOOK}/amenities/${ame_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateAmenities = async (payload: Partial<IAmenities>) => {
  const res: IBackendRes<IAmenities> = await sendRequest({
    url: `${URL_SERVER_BOOK}/amenities`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteAmenities = async ({ ame_id }: { ame_id: string }) => {
  const res: IBackendRes<IAmenities> = await sendRequest({
    url: `${URL_SERVER_BOOK}/amenities/${ame_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreAmenities = async ({ ame_id }: { ame_id: string }) => {
  const res: IBackendRes<IAmenities> = await sendRequest({
    url: `${URL_SERVER_BOOK}/amenities/restore/${ame_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ ame_id, ame_status }: { ame_id: string; ame_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<IAmenities> = await sendRequest({
    url: `${URL_SERVER_BOOK}/amenities/update-status`,
    method: 'PATCH',
    body: {
      ame_id,
      ame_status
    }
  })
  return res
}
