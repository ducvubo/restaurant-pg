'use server'

import { sendRequest } from "@/lib/api"
import { IFood } from "./food.interface"

export const getAllFoods = async ({
  current,
  pageSize,
  food_name = "",
  type
}: {
  current: string
  pageSize: string
  food_name?: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${process.env.URL_SERVER_ORDER}/food-restaurant` : `${process.env.URL_SERVER_ORDER}/food-restaurant/recycle`
  const res: IBackendRes<IModelPaginate<IFood>> = await sendRequest({
   url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      food_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}


