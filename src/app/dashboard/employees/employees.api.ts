'use server'

import { sendRequest } from '@/lib/api'
import { IEmployee } from '../employees.interface'

export const createEmployee = async (payload: any) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees`,
    method: 'POST',
    body: payload
  })
  console.log(res)
  return res
}

export const getAllEmployees = async ({ current, pageSize }: { current: string; pageSize: string }) => {
  const res: IBackendRes<IModelPaginate<IEmployee[]>> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees`,
    method: 'GET',
    queryParams: {
      current,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}
