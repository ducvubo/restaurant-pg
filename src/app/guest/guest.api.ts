'use server'

import { sendRequest } from '@/lib/api'
import { cookies } from 'next/headers'
import { IGuest, IOrderDishGuest } from './guest.interface'
import { IDish } from '../dashboard/(food)/dishes/dishes.interface'

export const loginGuest = async (payload: {
  guest_name: string
  guest_restaurant_id: string
  guest_table_id: string
}) => {
  const res: IBackendRes<{ access_token_guest: string; refresh_token_guest: string }> = await sendRequest({
    url: `${process.env.URL_SERVER}/guest-restaurant/login`,
    method: 'POST',
    body: payload
  })

  if (res.statusCode === 201 && res.data) {
    await cookies().set({
      name: 'access_token_guest',
      value: res.data.access_token_guest,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_ACCESSTOKEN_GUEST_RESTAURANT_EXPIRE)
    }),
      await cookies().set({
        name: 'refresh_token_guest',
        value: res.data.refresh_token_guest,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.JWT_REFRESHTOKEN_GUEST_RESTAURANT_EXPIRE)
      })

    const infor = await getInforGuest()
    return {
      data: infor.infor,
      code: res.statusCode,
      message: res.message
    }
  }
  return {
    code: res.statusCode,
    message: res.message
  }
}

export const refreshTokenNew = async () => {
  const refreshToken = cookies().get('refresh_token_guest')?.value

  if (!refreshToken) {
    return {
      code: -1,
      message: 'Không tìm thấy refresh token'
    }
  }
  const res: IBackendRes<{ access_token_guest: string; refresh_token_guest: string; infor: any }> = await sendRequest({
    url: `${process.env.URL_SERVER}/guest-restaurant/refresh-token`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${refreshToken}`
    }
  })

  if (res.statusCode === 201 && res.data) {
    await cookies().set({
      name: 'access_token_guest',
      value: res.data.access_token_guest,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_ACCESSTOKEN_GUEST_RESTAURANT_EXPIRE)
    })
    // await cookies().set({
    //   name: 'refresh_token_guest',
    //   value: res.data.refresh_token_guest,
    //   path: '/',
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'lax',
    //   maxAge: Number(process.env.JWT_REFRESHTOKEN_GUEST_RESTAURANT_EXPIRE)
    // })

    return {
      infor: res.data.infor,
      code: 0,
      message: 'Refresh token thành công'
    }
  } else {
    await cookies().delete('access_token_guest')
    await cookies().delete('refresh_token_guest')
    return {
      code: res.statusCode,
      message: res.message
    }
  }
}

export const getInforGuest = async () => {
  const access_token = cookies().get('access_token_guest')?.value
  const refresh_token = cookies().get('refresh_token_guest')?.value

  if (!access_token && !refresh_token) {
    return {
      code: -1,
      message: 'Access token và refresh token không tồn tại'
    }
  }

  if (!access_token && refresh_token) {
    return await refreshTokenNew()
  }

  const res: IBackendRes<IGuest> = await sendRequest({
    url: `${process.env.URL_SERVER}/guest-restaurant/infor`,
    method: 'GET',
    headers: {
      'x-at-guest': `Bearer ${cookies().get('access_token_guest')?.value}`,
      'x-rf-guest': `Bearer ${cookies().get('refresh_token_guest')?.value}`
    }
  })

  if (res.statusCode === 200) {
    return {
      code: 0,
      message: res.message,
      infor: res.data
    }
  } else {
    await cookies().delete('access_token_guest')
    await cookies().delete('refresh_token_guest')
    return {
      code: res.statusCode,
      message: res.message
    }
  }
}

export const lishDishOrder = async ({ guest_restaurant_id }: { guest_restaurant_id: string }) => {
  const res: IBackendRes<Omit<IDish, 'dish_status' | 'isDeleted'>[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/dishes/list-dish-order/${guest_restaurant_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })

  return res
}

export const orderDish = async (payload: { od_dish_id: string; od_dish_quantity: number }[]) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish`,
    method: 'POST',
    headers: {
      'x-at-guest': `Bearer ${cookies().get('access_token_guest')?.value}`,
      'x-rf-guest': `Bearer ${cookies().get('refresh_token_guest')?.value}`
    },
    body: payload
  })

  return res
}

export const getListOrder = async () => {
  const res: IBackendRes<IOrderDishGuest> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish/list-order-guest`,
    method: 'GET',
    headers: {
      'x-at-guest': `Bearer ${cookies().get('access_token_guest')?.value}`,
      'x-rf-guest': `Bearer ${cookies().get('refresh_token_guest')?.value}`
    }
  })

  return res
}

export const generateTokenAddMember = async () => {
  const res: IBackendRes<string> = await sendRequest({
    url: `${process.env.URL_SERVER}/guest-restaurant/generate-token-add-member`,
    method: 'POST',
    headers: {
      'x-at-guest': `Bearer ${cookies().get('access_token_guest')?.value}`,
      'x-rf-guest': `Bearer ${cookies().get('refresh_token_guest')?.value}`
    }
  })

  return res
}

export const addMember = async (payload: { token: string; guest_name: string }) => {
  const res: IBackendRes<{
    access_token_guest: string
    refresh_token_guest: string
  }> = await sendRequest({
    url: `${process.env.URL_SERVER}/guest-restaurant/add-member`,
    method: 'POST',
    body: payload
  })

  if (res.statusCode === 201 && res.data) {
    await cookies().set({
      name: 'access_token_guest',
      value: res.data.access_token_guest,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_ACCESSTOKEN_GUEST_RESTAURANT_EXPIRE)
    }),
      await cookies().set({
        name: 'refresh_token_guest',
        value: res.data.refresh_token_guest,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.JWT_REFRESHTOKEN_GUEST_RESTAURANT_EXPIRE)
      })

    const infor = await getInforGuest()

    return {
      data: infor.infor,
      code: res.statusCode,
      message: res.message
    }
  }

  return {
    code: res.statusCode,
    message: res.message
  }
}

export const setCookieRefreshTokenGuest = async (refreshToken: string) => {
  await cookies().set({
    name: 'refresh_token_guest',
    value: refreshToken,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: Number(process.env.JWT_REFRESHTOKEN_GUEST_RESTAURANT_EXPIRE)
  })

  return
}
