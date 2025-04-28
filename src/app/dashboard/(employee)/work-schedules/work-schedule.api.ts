'use server'

import { sendRequest } from '@/lib/api'
import { ILabel } from '../labels/label.interface'
import { IWorkingShift } from '../working-shifts/working-shift.interface'
import { IWorkSchedule } from './work-schedule.interface'
import { IEmployee } from '../employees/employees.interface'

const URL_SERVER_EMPLOYEE = process.env.URL_SERVER_EMPLOYEE
const URL_SERVER = process.env.URL_SERVER

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

export const createWorkSchedule = async (data: Partial<IWorkSchedule>) => {
  const res: IBackendRes<IWorkSchedule> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/work-schedule`,
    method: 'POST',
    body: data
  })
  console.log("🚀 ~ createWorkSchedule ~ res:", res)
  return res
}

export const updateWorkSchedule = async (data: Partial<IWorkSchedule>) => {
  const res: IBackendRes<IWorkSchedule> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/work-schedule`,
    method: 'PATCH',
    body: data
  })
  return res
}


export const getListWorkSchedule = async (startDate: Date, endDate: Date) => {
  const res: IBackendRes<IWorkSchedule[]> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/work-schedule`,
    method: 'GET',
    queryParams: {
      startDate,
      endDate
    }
  })
  return res
}

export const getWorkScheduleById = async ({ id }: { id: string }) => {
  const res: IBackendRes<IWorkSchedule> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/work-schedule/${id}`,
    method: 'GET'
  })
  return res
}

export const getAllEmployee = async () => {
  const res: IBackendRes<IEmployee[]> = await sendRequest({
    url: `${URL_SERVER}/employees/employee-name`,
    method: 'GET'
  })
  return res
}


export const deleteWorkSchedule = async (id: string) => {
  const res: IBackendRes<IWorkSchedule> = await sendRequest({
    url: `${URL_SERVER_EMPLOYEE}/work-schedule/${id}`,
    method: 'DELETE'
  })
  return res
}