'use server'

import { sendRequest } from '@/lib/api'
import { IModelPaginateWithStatusCount, IUpdateStatusOrderDish, OrderRestaurant } from './order.interface'

export const getListOrderDish = async ({
  current,
  pageSize,
  toDate,
  fromDate,
  guest_name,
  tbl_name,
  od_dish_status
}: {
  current: number
  pageSize: number
  toDate: Date
  fromDate: Date
  guest_name?: string
  tbl_name?: string
  od_dish_status: 'processing' | 'pending' | 'paid' | 'delivered' | 'refuse' | 'all'
}) => {
  const res: IBackendRes<IModelPaginateWithStatusCount<OrderRestaurant>> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish/list-order-restaurant`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      toDate,
      fromDate,
      guest_name,
      tbl_name,
      od_dish_status
    }
  })

  return res
}

export const updateStatusOrder = async (payload: IUpdateStatusOrderDish) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish/update-status`,
    method: 'PATCH',
    body: payload
  })

  return res
}
