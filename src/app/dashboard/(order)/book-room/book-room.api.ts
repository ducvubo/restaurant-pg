'use server'

import { sendRequest } from "@/lib/api"
import { IBookRoom } from "./book-room.interface"
import { IAmenities } from "../../(rooms)/amenities/amenities.interface"
import { IMenuItems } from "../../(rooms)/menu-items/menu-items.interface"


export const restaurantConfirmDepositBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-confirm-deposit`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantConfirmBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-confirm`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantCancelBookRoom = async (bkr_id: string, bkr_reason_cancel: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-cancel`,
    method: 'PATCH',
    body: { bkr_id, bkr_reason_cancel }
  })

  return res
}

export const restaurantCheckInBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-check-in`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantInUseBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-in-use`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantNoShowBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-no-show`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantRefundDepositBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-refund-deposit`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantRefundOneThirdDepositBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-refund-one-third-deposit`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantRefundOneTwoDepositBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-refund-one-two-deposit`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantNoDepositBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-no-deposit`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantCheckOutBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-check-out`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantCheckOutOvertimeBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-check-out-overtime`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantConfirmPaymentBookRoom = async (bkr_id: string, bkr_plus_price: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-confirm-payment`,
    method: 'PATCH',
    body: { bkr_id, bkr_plus_price }
  })

  return res
}

export const restaurantExceptionBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-exception`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const restaurantFeedbackBookRoom = async (bkr_id: string, bkr_reply: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-feedback`,
    method: 'PATCH',
    body: { bkr_id, bkr_reply }
  })

  return res
}

export const addMenuItemsToBookRoom = async (bkr_id: string, menu_items: { menu_id: string; bkr_menu_quantity: number }[]) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/add-menu-items`,
    method: 'POST',
    body: { bkr_id, menu_items }
  })

  return res
}

export const addAmenitiesToBookRoom = async (bkr_id: string, amenities: { ame_id: string; bkr_ame_quantity: number }[]) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/add-amenities`,
    method: 'POST',
    body: { bkr_id, amenities }
  })

  return res
}

export const getListBookRoomRestaurantPagination = async ({
  pageIndex,
  pageSize,
  keyword,
  bkr_status,
  fromDate,
  toDate
}: {
  pageIndex: number;
  pageSize?: number;
  keyword: string;
  bkr_status: string;
  fromDate: string;
  toDate: string;
}) => {
  const res: IBackendRes<IModelPaginate<IBookRoom>> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/restaurant-list`,
    method: 'GET',
    queryParams: { pageIndex, pageSize, keyword, bkr_status, fromDate, toDate }
  })

  return res
}

export const doneComplaintBookRoom = async (bkr_id: string) => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/done-complaint`,
    method: 'PATCH',
    body: { bkr_id }
  })

  return res
}

export const getAllAmenities = async () => {
  const res: IBackendRes<IAmenities[]> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/amenities/ame-name`,
    method: 'GET'
  })

  return res
}

export const getAllMenuItems = async () => {
  const res: IBackendRes<IMenuItems[]> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/menu-items/menu-name`,
    method: 'GET'
  })

  return res
}

export const updateFeedViewBookRoom = async (bkr_id: string, bkr_feed_view: 'active' | 'disable') => {
  const res: IBackendRes<IBookRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_BOOK}/book-room/update-feed-view`,
    method: 'PATCH',
    body: { bkr_id, bkr_feed_view }
  })

  return res
}