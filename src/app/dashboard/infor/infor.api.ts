'use server'

import { sendRequest } from '@/lib/api'
import { IAmentities, IRestaurantTypes } from './infor.interface'

export const getAmentities = async () => {
  const res: IBackendRes<IAmentities[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/amenities`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const getRestaurantTypes = async () => {
  const res: IBackendRes<IRestaurantTypes[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurant-type`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}
