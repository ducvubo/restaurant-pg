'use server'

import { IRestaurant } from "@/app/auth/auth.interface"
import { sendRequest } from "@/lib/api"

export const updateInforRestaurant = async (data: any) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/update-info`,
    method: 'PATCH',
    body: data,
  })
  return res
}