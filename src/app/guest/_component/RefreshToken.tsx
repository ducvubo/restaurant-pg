'use client'
import React, { use, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { getInforGuest, refreshTokenNew } from '../guest.api'
import { startAppGuest } from '../guest.slice'
import { IGuest } from '../guest.interface'

export default function RefreshTokenPage() {
  const router = useRouter()
  const dispatch = useDispatch()

  const runAppGuest = (inforGuest: IGuest) => {
    dispatch(startAppGuest(inforGuest))
  }
  const refreshToken = async () => {
    const res = await getInforGuest()

    if (res?.code === 0 && res.infor) {
      runAppGuest(res.infor)
      if (window.location.pathname.startsWith('/guest/table')) {
        router.push('/guest/order')
      }
      return
    } else if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname

      // Kiểm tra nếu không phải là trang '/guest/table'
      if (res?.code !== 0 && !currentPath.startsWith('/guest/table')) {
        router.push('/')
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
