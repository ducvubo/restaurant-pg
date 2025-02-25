'use server'

import { sendRequest } from '@/lib/api'
import { ISpecialOffer } from './special-offer.interface'

const URL_SERVER_ORDER = process.env.URL_SERVER_ORDER

export const createSpecialOffer = async (payload: Partial<ISpecialOffer>) => {
  const res: IBackendRes<ISpecialOffer> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers`,
    method: 'POST',
    body: payload
  })
  console.log("🚀 ~ createSpecialOffer ~ res:", res)

  return res
}

export const getAllSpecialOffers = async ({
  current,
  pageSize,
  type,
  spo_title
}: {
  current: string
  pageSize: string
  spo_title: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_ORDER}/special-offers` : `${URL_SERVER_ORDER}/special-offers/recycle`
  const res: IBackendRes<IModelPaginate<ISpecialOffer>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      spo_title
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findSpecialOfferById = async ({ spo_id }: { spo_id: string }) => {
  const res: IBackendRes<ISpecialOffer> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers/${spo_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateSpecialOffer = async (payload: Partial<ISpecialOffer>) => {
  const res: IBackendRes<ISpecialOffer> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteSpecialOffer = async ({ spo_id }: { spo_id: string }) => {
  const res: IBackendRes<ISpecialOffer> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers/${spo_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreSpecialOffer = async ({ spo_id }: { spo_id: string }) => {
  const res: IBackendRes<ISpecialOffer> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers/restore/${spo_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({ spo_id, spo_status }: { spo_id: string; spo_status: 'enable' | 'disable' }) => {
  const res: IBackendRes<ISpecialOffer> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers/update-status`,
    method: 'PATCH',
    body: {
      spo_id,
      spo_status
    }
  })
  return res
}
