'use client'
import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { startAppRestaurant } from '../InforRestaurant.slice'
import { useRouter } from 'next/navigation'
import { IRestaurant } from '../auth.interface'
import { reFreshTokenNew } from '../auth.api'
import { IEmployee } from '@/app/dashboard/employees/employees.interface'
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
    const res = await reFreshTokenNew()
    const currentPathname = window.location.pathname

    if (res?.code === 0 && res.data) {
      if (res.type === 'restaurant') {
        runAppRestaurant(res.data)
        if (!currentPathname.startsWith('/dashboard')) {
          router.push('/dashboard')
        }
      } else if (res.type === 'employee') {
        runAppEmployee(res.data)
        if (!currentPathname.startsWith('/dashboard')) {
          router.push('/dashboard')
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
