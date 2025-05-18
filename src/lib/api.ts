import { genSignEndPoint } from '@/app/utils'
import { cookies } from 'next/headers'
import queryString from 'query-string'

export const sendRequest = async <T>(props: IRequest) => {
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props
  let options: any
  const cookie = cookies()
  const { nonce, sign, stime, version } = genSignEndPoint()
  const id_user_guest = cookie.get('id_user_guest')?.value

  const access_token_rtr = cookie.get('access_token_rtr')?.value
  const refresh_token_rtr = cookie.get('refresh_token_rtr')?.value

  const access_token_epl = cookie.get('access_token_epl')?.value
  const refresh_token_epl = cookie.get('refresh_token_epl')?.value

  if (access_token_rtr && refresh_token_rtr) {
    options = {
      method: method,
      // by default setting the content-type to be json type
      headers: new Headers({
        'content-type': 'application/json',
        'x-at-rtr': `Bearer ${access_token_rtr}`,
        'x-rf-rtr': `Bearer ${refresh_token_rtr}`,
        nonce,
        sign,
        stime,
        version,
        id_user_guest: id_user_guest,
        ...headers
      }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }

  if (access_token_epl && refresh_token_epl) {
    options = {
      method: method,
      // by default setting the content-type to be json type
      headers: new Headers({
        'content-type': 'application/json',
        'x-at-epl': `Bearer ${access_token_epl}`,
        'x-rf-epl': `Bearer ${refresh_token_epl}`,
        id_user_guest: id_user_guest,
        nonce,
        sign,
        stime,
        version,
        ...headers
      }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }

  if (!access_token_rtr && !access_token_epl && !access_token_rtr && !access_token_epl) {
    options = {
      method: method,
      // by default setting the content-type to be json type
      headers: new Headers({
        'content-type': 'application/json',
        ...headers,
        id_user_guest: id_user_guest,
        nonce,
        sign,
        stime,
        version
      }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }

  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`
  }

  console.log('url', url)

  return fetch(url, options).then(async (res: any) => {
    if (!id_user_guest) {
      const newIdUserGuest = res.headers.get('id_user_guest')
      if (newIdUserGuest) {
        await cookie.set({
          name: 'id_user_guest',
          value: newIdUserGuest,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 365 * 10 //10 năm
        })
      }
    }
    if (res.ok) {
      return res.json() as T //generic
    } else {
      return res.json().then(async function (json: any) {
        return {
          statusCode: res.status,
          message: json?.message ?? '',
          error: json?.error ?? '',
          code: json?.code ?? ''
        } as T
      })
    }
  })
}

export const sendRequestFile = async <T>(props: IRequest) => {
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props

  const options: any = {
    method: method,
    headers: new Headers({ ...headers }),
    body: body ? body : null,
    ...nextOption
  }
  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T //generic
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? '',
          error: json?.error ?? '',
          code: json?.code ?? ''
        } as T
      })
    }
  })
}
