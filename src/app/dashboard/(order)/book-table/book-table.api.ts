'use server'
import { sendRequest } from '@/lib/api'
import { IBookTable } from './book-table.interface'
import { string } from 'zod'

export const getListBookTable = async ({
  current,
  pageSize,
  toDate,
  fromDate
}: {
  current: number
  pageSize: number
  toDate: Date
  fromDate: Date
}) => {
  const res: IBackendRes<IModelPaginate<IBookTable>> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/list-book-table-restaurant`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      toDate,
      fromDate
    }
  })
  return res
}

export const updateStatusBookTable = async ({
  _id,
  book_tb_status
}: {
  _id: string
  book_tb_status: 'Nhà hàng đã tiếp nhận' | 'Đã hoàn thành' | 'Hủy'
}) => {
  const res: IBackendRes<IBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/update-status`,
    method: 'PATCH',
    body: {
      _id,
      book_tb_status
    }
  })

  return res
}
