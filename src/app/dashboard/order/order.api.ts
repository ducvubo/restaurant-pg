'use server'

import { sendRequest } from '@/lib/api'
import {
  IModelPaginateWithStatusCount,
  IUpdateStatusOrderDish,
  IOrderRestaurant,
  IRestaurantCreateOrderDish
} from './order.interface'
import { ITable } from '../tables/table.interface'

export const getListOrderDish = async ({
  current,
  pageSize,
  toDate,
  fromDate,
  guest_name,
  tbl_name,
  od_dish_smr_status
}: {
  current: number
  pageSize: number
  toDate: Date
  fromDate: Date
  guest_name?: string
  tbl_name?: string
  od_dish_smr_status: 'ordering' | 'paid' | 'refuse' | 'all'
}) => {
  const res: IBackendRes<IModelPaginateWithStatusCount<IOrderRestaurant>> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/list-order-restaurant`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      toDate,
      fromDate,
      guest_name,
      tbl_name,
      od_dish_smr_status
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

export const updateStatusSummary = async (payload: {
  _id: string
  od_dish_smr_status: 'ordering' | 'paid' | 'refuse'
}) => {
  console.log(payload)
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/update-status`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const getListTableOrder = async () => {
  const res: IBackendRes<ITable[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/tables/list-table-order`,
    method: 'GET'
  })

  return res
}

export const getListOrdring = async () => {
  const res: IBackendRes<IOrderRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/list-ordering`,
    method: 'GET'
  })
  return res
}

export const restaurantCreateOrderDist = async (payload: IRestaurantCreateOrderDish) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish/restaurant-create-order-dish`,
    method: 'POST',
    body: payload
  })
  return res
}

export const restaurantCreateOrderSummary = async ({ od_dish_smr_table_id }: { od_dish_smr_table_id: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/create-order-dish-summary`,
    method: 'POST',
    body: { od_dish_smr_table_id }
  })
  return res
}
