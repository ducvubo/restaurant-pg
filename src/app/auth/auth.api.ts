'use server'

import { sendRequest } from '@/lib/api'
import { IToken, IRestaurant } from './auth.interface'
import { cookies } from 'next/headers'
import { IEmployee } from '../dashboard/(employee)/employees/employees.interface'

export const getInforRestaurant = async ({ access_token_rtr, refresh_token_rtr }: IToken) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/infor`,
    method: 'GET',
    headers: {
      'x-at-rtr': `Bearer ${access_token_rtr}`,
      'x-rf-rtr': `Bearer ${refresh_token_rtr}`
    }
  })
  return res
}

export const login = async (payload: { restaurant_email: string; restaurant_password: string }) => {
  const res: IBackendRes<IToken> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/login`,
    method: 'POST',
    body: payload
  })
  console.log("🚀 ~ login ~ res:", res)

  if (res.statusCode === 201 && res.data) {
    const data = await Promise.all([
      await cookies().set({
        name: 'access_token_rtr',
        value: res.data.access_token_rtr,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.MAX_AGE_ACCESS_TOKEN)
      }),
      await cookies().set({
        name: 'refresh_token_rtr',
        value: res.data.refresh_token_rtr,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.MAX_AGE_REFRESH_TOKEN)
      }),
      await getInforRestaurant(res.data)
    ])
    const resProfile: IBackendRes<IRestaurant> = data[2]
    if (resProfile.statusCode === 200 && resProfile.data) {
      return {
        data: resProfile.data,
        message: 'Đăng nhập thành công',
        code: 0
      }
    } else if (resProfile.statusCode === 401) {
      return {
        message: 'Email hoặc mật khẩu không đúng',
        code: -1
      }
    } else {
      return {
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        code: -4
      }
    }
  } else if (res.statusCode === 401) {
    if (res.code === -1) {
      return {
        message: 'Email hoặc mật khẩu không đúng',
        code: -1
      }
    }
    if (res.code === -2) {
      return {
        message: 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt lại',
        code: -2
      }
    }
    if (res.code === -3) {
      return {
        message: 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt rồi thử lại sau',
        code: -3
      }
    }
  } else if (res.statusCode === 400) {
    return {
      message: res.message,
      code: -5
    }
  } else {
    return {
      message: res.message,
      code: -4
    }
  }
}

export const getInforEmployee = async ({
  access_token_epl,
  refresh_token_epl
}: {
  access_token_epl: string
  refresh_token_epl: string
}) => {
  const res: IBackendRes<IEmployee> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/infor`,
    method: 'GET',
    headers: {
      'x-at-rtr': `Bearer ${access_token_epl}`,
      'x-rf-rtr': `Bearer ${refresh_token_epl}`
    }
  })

  return res
}

export const reFreshTokenNew = async () => {
  const refresh_token_rtr = cookies().get('refresh_token_rtr')?.value
  const refresh_token_epl = cookies().get('refresh_token_epl')?.value

  if (!refresh_token_rtr && !refresh_token_epl) {
    return {
      code: -1,
      message: 'Refresh token không tồn tại'
    }
  }
  const type = refresh_token_rtr ? 'restaurant' : 'employee'

  const url =
    type === 'restaurant'
      ? `${process.env.URL_SERVER}/restaurants/refresh-token`
      : `${process.env.URL_SERVER}/employees/refresh-token`

  const token = type === 'employee' ? refresh_token_epl : refresh_token_rtr

  const res: IBackendRes<any> = await sendRequest({
    url: url,
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  if (res.statusCode === 201 && res.data) {
    const data = await Promise.all([
      await cookies().set({
        name: type === 'restaurant' ? 'access_token_rtr' : 'access_token_epl',
        value: type === 'restaurant' ? res.data.access_token_rtr : res.data.access_token_epl,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.MAX_AGE_ACCESS_TOKEN)
      }),
      await cookies().set({
        name: type === 'restaurant' ? 'refresh_token_rtr' : 'refresh_token_epl',
        value: type === 'restaurant' ? res.data.refresh_token_rtr : res.data.refresh_token_epl,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.MAX_AGE_REFRESH_TOKEN)
      }),
      type === 'restaurant' ? await getInforRestaurant(res.data) : await getInforEmployee(res.data)
    ])
    const resProfile: IBackendRes<IRestaurant | IEmployee> = data[2]
    if (resProfile.statusCode === 200 && resProfile.data) {
      return {
        type,
        data: resProfile.data,
        message: 'Lấy thông tin thành công',
        code: 0
      }
    } else {
      return {
        message: 'Đã có lỗi xảy ra, vui lòng đăng nhập lại',
        code: -2
      }
    }
  }
  if (res.statusCode === 401 && res.code === -10) {
    cookies().delete('refresh_token_rtr')
    cookies().delete('access_token_rtr')
  }
}

export const searchRestaurant = async ({ search }: { search: string }) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/search-login-employee`,
    method: 'GET',
    queryParams: {
      search
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  if (res.statusCode === 200) {
    return res.data
  } else {
    throw new Error(res.message || 'Có lỗi xảy ra khi tìm kiếm nhà hàng')
  }
}

export const loginEmployee = async (payload: {
  epl_email: string
  epl_password: string
  epl_restaurant_id: string
}) => {
  const res: IBackendRes<{ access_token_epl: string; refresh_token_epl: string }> = await sendRequest({
    url: `${process.env.URL_SERVER}/employees/login`,
    method: 'POST',
    body: payload
  })
  if (res.statusCode === 201 && res.data) {
    const data = await Promise.all([
      await cookies().set({
        name: 'access_token_epl',
        value: res.data.access_token_epl,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.MAX_AGE_ACCESS_TOKEN)
      }),
      await cookies().set({
        name: 'refresh_token_epl',
        value: res.data.refresh_token_epl,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: Number(process.env.MAX_AGE_REFRESH_TOKEN)
      }),
      await getInforEmployee(res.data)
    ])
    const resProfile: IBackendRes<IEmployee> = data[2]
    if (resProfile.statusCode === 200 && resProfile.data) {
      return {
        data: resProfile.data,
        message: 'Đăng nhập thành công',
        code: 0
      }
    } else if (resProfile.statusCode === 401) {
      return {
        message: 'Email hoặc mật khẩu không đúng',
        code: -1
      }
    } else {
      return {
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        code: -4
      }
    }
  } else if (res.statusCode === 401) {
    if (res.code === -1) {
      return {
        message: 'Email hoặc mật khẩu không đúng',
        code: -1
      }
    }
    if (res.code === -2) {
      return {
        message: 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt lại',
        code: -2
      }
    }
    if (res.code === -3) {
      return {
        message: 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt rồi thử lại sau',
        code: -3
      }
    }
  } else if (res.statusCode === 400) {
    return {
      message: res.message,
      code: -5
    }
  }
}

export const getInfor = async () => {
  const refresh_token_rtr = cookies().get('refresh_token_rtr')?.value
  const access_token_rtr = cookies().get('access_token_rtr')?.value

  const refresh_token_epl = cookies().get('refresh_token_epl')?.value
  const access_token_epl = cookies().get('access_token_epl')?.value

  if (!refresh_token_rtr && !access_token_rtr && !refresh_token_epl && !access_token_epl) {
    return {
      message: 'Vui lòng đăng nhập để lấy thông tin',
      code: -1
    }
  }

  if (access_token_epl || access_token_rtr) {
    const type = refresh_token_rtr && access_token_rtr ? 'restaurant' : 'employee'
    const url =
      type === 'restaurant'
        ? `${process.env.URL_SERVER}/restaurants/infor`
        : `${process.env.URL_SERVER}/employees/infor`
    const res: IBackendRes<IRestaurant | IEmployee> = await sendRequest({
      url,
      method: 'GET'
    })
    return {
      type,
      data: res.data,
      message: 'Lấy thông tin thành công',
      code: 0
    }
  }

  if (refresh_token_epl || refresh_token_rtr) {
    return await reFreshTokenNew()
  }
}
