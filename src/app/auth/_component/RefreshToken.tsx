'use client'
import React, { use, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { startAppRestaurant } from '../InforRestaurant.slice'
import { useRouter } from 'next/navigation'
import { getInfor, reFreshTokenNew } from '../auth.api'
import { startAppEmployee } from '../InforEmployee.slice'

export default function RefreshToken() {
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppRestaurant = (inforRestaurant: any) => {
    dispatch(startAppRestaurant(inforRestaurant))
  }

  const runAppEmployee = (inforEmployee: any) => {
    dispatch(startAppEmployee(inforEmployee))
  }

  const refreshToken = async () => {
    const lastRefreshTime = localStorage.getItem('last_refresh_token_time_restaurant_pg')
    const currentTime = Date.now()

    // Kiểm tra nếu lần cuối refresh token dưới 10 phút thì không thực hiện nữa
    if (lastRefreshTime && currentTime - parseInt(lastRefreshTime, 10) < 1000 * 60 * 8) {
      console.log('Token đã được làm mới gần đây, bỏ qua việc làm mới')
      const currentPathname = window.location.pathname

      const res = await getInfor()
      if (res?.code === 0 && res.data) {
        if (res.type === 'restaurant') {
          runAppRestaurant(res.data)
          if (!currentPathname.startsWith('/dashboard')) {
            // router.push('/dashboard')
          }
        } else if (res.type === 'employee') {
          runAppEmployee(res.data)
          if (!currentPathname.startsWith('/dashboard')) {
            // router.push('/dashboard')
          }
        }
      }
    }

    const res = await reFreshTokenNew()
    const currentPathname = window.location.pathname

    if (res?.code === 0 && res.data) {
      localStorage.setItem('last_refresh_token_time_restaurant_pg', currentTime.toString())

      if (res.type === 'restaurant') {
        runAppRestaurant(res.data)
        if (!currentPathname.startsWith('/dashboard')) {
          // router.push('/dashboard')
        }
      } else if (res.type === 'employee') {
        runAppEmployee(res.data)
        if (!currentPathname.startsWith('/dashboard')) {
          // router.push('/dashboard')
        }
      }
    }
  }

  useLayoutEffect(() => {
    refreshToken()

    // Thiết lập interval để gọi API làm mới mỗi 10 phút
    const interval = setInterval(() => {
      refreshToken()
    }, 1000 * 60 * 10)

    return () => clearInterval(interval)
  }, [])

  return <></>
}
