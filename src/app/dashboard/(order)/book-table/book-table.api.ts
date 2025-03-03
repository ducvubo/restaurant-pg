'use server'
import { sendRequest } from '@/lib/api'
import { IBookTable } from './book-table.interface'
import { string } from 'zod'

export const getListBookTable = async ({
  current,
  pageSize,
  toDate,
  fromDate,
  status = '',
  q = ''
}: {
  current: number
  pageSize: number
  toDate: Date
  fromDate: Date
  status: string
  q: string
}) => {
  const res: IBackendRes<IModelPaginate<IBookTable>> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/list-order-restaurant`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      toDate,
      fromDate,
      status: status,
      q
    }
  })
  return res
}

export const confirmBookTable = async (id: string) => {
  const res: IBackendRes<IBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/restaurant-confirm/${id}`,
    method: 'PATCH'
  })
  return res
}

export const cancelBookTable = async (id: string) => {
  const res: IBackendRes<IBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/restaurant-cancel/${id}`,
    method: 'PATCH'
  })
  return res
}

export const doneBookTable = async (id: string) => {
  const res: IBackendRes<IBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/restaurant-done/${id}`,
    method: 'PATCH'
  })
  return res
}

export const exceptionBookTable = async (id: string, book_tb_note_res: string) => {
  const res: IBackendRes<IBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/exception/${id}`,
    method: 'PATCH',
    body: {
      book_tb_note_res
    }
  })
  return res
}

export const sendFeedbackBookTable = async (id: string, book_tb_feedback_restaurant: string) => {
  const res: IBackendRes<IBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/restaurant-feedback/${id}`,
    method: 'PATCH',
    body: {
      book_tb_feedback_restaurant
    }
  })
  return res
}
