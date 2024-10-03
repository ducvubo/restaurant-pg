'use server'

import { sendRequest } from '@/lib/api'
import { IGuest } from './guest.interface'

export const getListGuest = async ({ current, pageSize }: { current: string; pageSize: string }) => {
  const res: IBackendRes<IModelPaginate<IGuest>> = await sendRequest({
    url: `${process.env.URL_SERVER}/guest-restaurant`,
    method: 'GET',
    queryParams: {
      current,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}
