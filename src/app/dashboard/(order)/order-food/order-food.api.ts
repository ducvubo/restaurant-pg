'use server'
import { sendRequest } from '@/lib/api'
import { IOrderFood } from './order-food.interface'
import { string } from 'zod'

export const getListOrderFood = async ({
  current,
  pageSize,
  toDate,
  fromDate,
  status = 'all',
  q = ''
}: {
  current: number
  pageSize: number
  toDate: Date
  fromDate: Date
  status: string
  q: string
}) => {
  const res: IBackendRes<IModelPaginate<IOrderFood>> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/get-list-order-food-restaurant-pagination`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      toDate,
      fromDate,
      od_status: status,
      q
    }
  })
  return res
}

export const restaurantConfirmOrderFood = async (od_id: string) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-confirm-order-food`,
    method: 'PATCH',
    body: {
      od_id
    }
  })
  return res
}

export const restaurantConfirmShipping = async (od_id: string) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-confirm-shipping-order-food`,
    method: 'PATCH',
    body: {
      od_id
    }
  })
  return res
}

export const restaurantDeliveredOrderFood = async (od_id: string) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-delivered-order-food`,
    method: 'PATCH',
    body: {
      od_id
    }
  })
  return res
}

export const restaurantCustomerUnreachableOrderFood = async (od_id: string) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-customer-unreachable-order-food`,
    method: 'PATCH',
    body: {
      od_id,
    }
  })
  return res
}

export const restaurantCancelOrderFood = async (od_id: string, od_reason_cancel: string) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-cancel-order-food`,
    method: 'PATCH',
    body: {
      od_id, od_reason_cancel
    }
  })
  return res
}

export const restaurantFeedbackOrderFood = async (od_id: string, od_feed_reply: string) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-feedback-order-food`,
    method: 'PATCH',
    body: {
      od_id,
      od_feed_reply
    }
  })
  return res
}

export const restaurantUpdateViewFeedbackOrderFood = async (od_id: string, od_feed_view: 'active' | 'disable') => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/restaurant-update-view-feedback-order-food`,
    method: 'PATCH',
    body: {
      od_id,
      od_feed_view
    }
  })
  return res
}

