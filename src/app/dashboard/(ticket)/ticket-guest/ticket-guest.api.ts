'use server'

import { sendRequest } from '@/lib/api'
import { ITicketGuestRestaurant, ITicketGuestRestaurantReplice } from './ticket-guest.interface'

const URL_SERVER_TICKET = process.env.URL_SERVER_INVENTORY

export const getTicketGuest = async ({
  current,
  pageSize,
  q,
  tkgr_priority,
  tkgr_status,
  tkgr_type
}: {
  current: string
  pageSize: string
  q: string
  tkgr_status: string
  tkgr_priority: string
  tkgr_type: string
}) => {
  const res: IBackendRes<IModelPaginate<ITicketGuestRestaurant>> = await sendRequest({
    url: `${URL_SERVER_TICKET}/ticket-guest-restaurant/get-ticket-restaurants`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      q,
      tkgr_priority,
      tkgr_status,
      tkgr_type
    }
  })

  return res
}

export const getInformationTicket = async (id: string) => {
  const res: IBackendRes<ITicketGuestRestaurant> = await sendRequest({
    url: `${URL_SERVER_TICKET}/ticket-guest-restaurant/get-ticket-restaurants/${id}`,
    method: 'GET'
  })

  return res
}

export const getTicketReplice = async (tkgr_id: string) => {
  const res: IBackendRes<ITicketGuestRestaurantReplice[]> = await sendRequest({
    url: `${URL_SERVER_TICKET}/tick-guest-restaurant-replices`,
    method: 'GET',
    queryParams: {
      tkgr_id
    }
  })

  return res
}

export const createTicketReplice = async (data: ITicketGuestRestaurantReplice) => {
  const res: IBackendRes<ITicketGuestRestaurantReplice> = await sendRequest({
    url: `${URL_SERVER_TICKET}/tick-guest-restaurant-replices/restaurant-reply`,
    method: 'POST',
    body: data
  })
  return res
}

export const resolvedTicket = async (id: string) => {
  const res: IBackendRes<ITicketGuestRestaurant> = await sendRequest({
    url: `${URL_SERVER_TICKET}/ticket-guest-restaurant/resolved-ticket/${id}`,
    method: 'PUT'
  })

  return res
}
