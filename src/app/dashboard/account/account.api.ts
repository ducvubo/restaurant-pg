'use server'

import { IRestaurant } from "@/app/auth/auth.interface"
import { sendRequest } from "@/lib/api"
import { IEmployee } from "../(employee)/employees/employees.interface"
import { IWorkSchedule } from "../(employee)/work-schedules/work-schedule.interface"

export const updateInforRestaurant = async (data: any) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/update-info`,
    method: 'PATCH',
    body: data,
  })
  return res
}

export const updateInforEmployee = async (data: any) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/update-infor`,
    method: 'PATCH',
    body: data,
  })
  return res
}


export const getListWorkSchedule = async () => {
  const res: IBackendRes<IWorkSchedule[]> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/work-schedule/by-employee`,
    method: 'GET',
  })
  return res
}