'use server'

import { sendRequest } from "@/lib/api";
import { INotification } from "./notification.slice"

export const getAllNotificationPagination = async ({ offset = 0, limit = 10 }: { offset: number, limit: number }) => {
  const res: IBackendRes<{
    data: INotification[]; offset: number; limit: number;
  }> = await sendRequest({
    url: `${process.env.URL_SERVER}/notification`,
    method: 'GET',
    queryParams: {
      offset,
      limit
    }
  })
  return res
}

export const getCountNotification = async () => {
  const res: IBackendRes<{
    totalNoti: number;
    unreadNoti: number;
  }> = await sendRequest({
    url: `${process.env.URL_SERVER}/notification/count`,
    method: 'GET',
  })
  return res
}

export const readOneNotification = async (noti_id: string) => {
  const res: IBackendRes<INotification> = await sendRequest({
    url: `${process.env.URL_SERVER}/notification/read`,
    method: 'PATCH',
    queryParams: {
      noti_id
    }
  })
  return res
}

export const readAllNotification = async () => {
  const res: IBackendRes<INotification[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/notification/read-all`,
    method: 'PATCH',
  })
  return res
}