'use server'

import { sendRequest } from '@/lib/api'

export const createBlog = async (payload: any) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/blogs`,
    method: 'POST',
    body: payload
  })

  return res
}
