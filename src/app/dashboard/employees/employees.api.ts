'use server'

import { sendRequest } from '@/lib/api'

export const createEmployee = async (payload: any) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/employees`,
    method: 'POST',
    body: payload
  })
  console.log(res)
  return res
}
