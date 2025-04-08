'use server'

import { sendRequest } from '@/lib/api'
import { IRoom } from './rooms.interface'

const URL_SERVER_BOOK = process.env.URL_SERVER_BOOK

export const createRoom = async (payload: Partial<IRoom>) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${URL_SERVER_BOOK}/rooms`,
    method: 'POST',
    body: payload
  })
  return res
}

export const getAllRoom = async ({
  current,
  pageSize,
  type,
  room_name
}: {
  current: string
  pageSize: string
  room_name: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_BOOK}/rooms` : `${URL_SERVER_BOOK}/rooms/recycle`
  const res: IBackendRes<IModelPaginate<IRoom>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      room_name
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findRoomById = async ({ room_id }: { room_id: string }) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${URL_SERVER_BOOK}/rooms/${room_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  console.log('🚀 ~ findRoomById ~ res:', res)
  return res
}

export const updateRoom = async (payload: Partial<IRoom>) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${URL_SERVER_BOOK}/rooms`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteRoom = async ({ room_id }: { room_id: string }) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${URL_SERVER_BOOK}/rooms/${room_id}`,
    method: 'DELETE'
  })

  return res
}

export const restoreRoom = async ({ room_id }: { room_id: string }) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${URL_SERVER_BOOK}/rooms/restore/${room_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatus = async ({
  room_id,
  room_status
}: {
  room_id: string
  room_status: 'enable' | 'disable'
}) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${URL_SERVER_BOOK}/rooms/update-status`,
    method: 'PATCH',
    body: {
      room_id,
      room_status
    }
  })
  return res
}
