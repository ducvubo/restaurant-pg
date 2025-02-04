'use server'

import { sendRequest } from '@/lib/api'
import { ILabel } from '../labels/label.interface'
import { IWorkingShift } from '../working-shifts/working-shift.interface'

const URL_SERVER_EMPLOYEE = process.env.URL_SERVER_EMPLOYEE

export const getAllLabel = async () => {
  const res: IBackendRes<ILabel[]> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/labels/all`,
    method: 'GET'
  })
  return res
}

export const getAllWorkingShift = async () => {
  const res: IBackendRes<IWorkingShift[]> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/working-shift/all`,
    method: 'GET'
  })
  return res
}
