// 'use client'
// import React, { useLayoutEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import { startAppRestaurant } from '../auth.slice'
// import { useRouter } from 'next/navigation'
// import { IRestaurant } from '../auth.interface'
// import { reFreshTokenNew } from '../auth.api'

// export default function RefreshToken() {
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const runAppRestaurant = (inforRestaurant: IRestaurant) => {
//     dispatch(startAppRestaurant(inforRestaurant))
//   }

//   const refreshToken = async () => {
//     const res = await reFreshTokenNew()
//     console.log(res)
//     if (res?.code === 0 && res.data) {
//       runAppRestaurant(res.data)
//       router.push('/dashboard')
//     }
//   }

//   useLayoutEffect(() => {
//     refreshToken()
//     const interval = setInterval(() => {
//       refreshToken()
//     }, 1000 * 60 * 10)
//     return () => clearInterval(interval)
//   }, [])
//   return <></>
// }

'use client'
import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { startAppRestaurant } from '../auth.slice'
import { useRouter } from 'next/navigation'
import { IRestaurant } from '../auth.interface'
import { reFreshTokenNew } from '../auth.api'

export default function RefreshToken() {
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppRestaurant = (inforRestaurant: IRestaurant) => {
    dispatch(startAppRestaurant(inforRestaurant))
  }

  const refreshToken = async () => {
    // Kiểm tra thời gian refresh gần nhất từ localStorage
    const lastRefreshTime = localStorage.getItem('last_refresh_token_time_restaurant')
    const currentTime = Date.now()

    // Nếu thời gian lần cuối làm mới dưới 10 phút, không thực hiện refresh nữa
    if (lastRefreshTime && currentTime - parseInt(lastRefreshTime, 10) < 1000 * 60 * 9) {
      // console.log('Token đã được làm mới gần đây, bỏ qua việc làm mới')
      return
    }

    // Gọi API refresh token
    const res = await reFreshTokenNew()
    if (res?.code === 0 && res.data) {
      runAppRestaurant(res.data)
      router.push('/dashboard')
      // Lưu lại thời gian làm mới
      localStorage.setItem('last_refresh_token_time_restaurant', currentTime.toString())
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
