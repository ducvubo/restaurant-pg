'use server'
import { sendRequest } from '@/lib/api'
import { IOrderFoodCombo } from './order-food-combo.interface'

export const getListOrderFoodCombo = async ({
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
  const res: IBackendRes<IModelPaginate<IOrderFoodCombo>> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/get-list-order-food-combo-restaurant-pagination`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      toDate,
      fromDate,
      od_cb_status: status,
      q
    }
  })
  return res
}

export const restaurantConfirmOrderFoodCombo = async (od_cb_id: string) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-confirm-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id
    }
  })
  return res
}

export const restaurantConfirmShipping = async (od_cb_id: string) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-confirm-shipping-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id
    }
  })
  return res
}

export const restaurantDeliveredOrderFoodCombo = async (od_cb_id: string) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-delivered-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id
    }
  })
  return res
}

//restaurantCustomerUnreachableOrderFoodCombo
export const restaurantCustomerUnreachableOrderFoodCombo = async (od_cb_id: string) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-customer-unreachable-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id
    }
  })
  return res
}

export const restaurantCancelOrderFoodCombo = async (od_cb_id: string, od_cb_reason_cancel: string) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-cancel-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id, od_cb_reason_cancel
    }
  })
  return res
}

export const restaurantFeedbackOrderFoodCombo = async (od_cb_id: string, od_cb_feed_reply: string) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-feedback-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id,
      od_cb_feed_reply
    }
  })
  return res
}

export const restaurantUpdateViewFeedbackOrderFoodCombo = async (od_cb_id: string, od_cb_feed_view: 'active' | 'disable') => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/restaurant-update-view-feedback-order-food-combo`,
    method: 'PATCH',
    body: {
      od_cb_id,
      od_cb_feed_view
    }
  })
  return res
}

