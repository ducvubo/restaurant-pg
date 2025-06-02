'use server'

import { sendRequest } from '@/lib/api'
import { IInternalNote } from './internal-note.interface'

const URL_SERVER_USER = process.env.URL_SERVER_USER

export const createInternalNote = async (payload: Partial<IInternalNote>) => {
  const res: IBackendRes<IInternalNote> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-note`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllInternalNotes = async ({
  current,
  pageSize,
  type,
  ItnNoteTitle
}: {
  current: string
  pageSize: string,
  ItnNoteTitle: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_SERVER_USER}/internal-note`
      : `${URL_SERVER_USER}/internal-note/recycle`
  const res: IBackendRes<IModelPaginate<IInternalNote>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex: current,
      pageSize,
      ItnNoteTitle
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findInternalNoteById = async ({ itn_note_id }: { itn_note_id: string }) => {
  const res: IBackendRes<IInternalNote> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-note/${itn_note_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateInternalNote = async (payload: Partial<IInternalNote>) => {
  const res: IBackendRes<IInternalNote> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-note`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteInternalNote = async ({ itn_note_id }: { itn_note_id: string }) => {
  const res: IBackendRes<IInternalNote> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-note/${itn_note_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreInternalNote = async ({ itn_note_id }: { itn_note_id: string }) => {
  const res: IBackendRes<IInternalNote> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-note/restore/${itn_note_id}`,
    method: 'PATCH'
  })

  return res
}