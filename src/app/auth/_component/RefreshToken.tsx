'use client'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { startAppRestaurant } from '../InforRestaurant.slice'
import { useRouter } from 'next/navigation'
import { getInfor, reFreshTokenNew } from '../auth.api'
import { startAppEmployee } from '../InforEmployee.slice'
import { getCookie } from '@/app/actions/action'
import { connectSocket } from '@/socket'
import { toast } from '@/hooks/use-toast'
import { switchStatusOrderVi } from '@/app/utils'
import { addNotification, INotification } from '../notification.slice'

export default function RefreshToken() {
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppRestaurant = (inforRestaurant: any) => {
    dispatch(startAppRestaurant(inforRestaurant))
  }

  const runAppEmployee = (inforEmployee: any) => {
    dispatch(startAppEmployee(inforEmployee))
  }

  const runAddNotification = (notification: INotification) => {
    dispatch(addNotification(notification))
  }

  useEffect(() => {
    let socket: any
    let intervalId: NodeJS.Timeout

    const connectSocketWithCookie = async () => {
      // const access_token = await getCookie('access_token_rtr')
      // const refresh_token = await getCookie('refresh_token_rtr')
      // const refresh_token_epl = await getCookie('refresh_token_epl')
      // const access_token_epl = await getCookie('access_token_epl')
      const [access_token, refresh_token, refresh_token_epl, access_token_epl] = await Promise.all([
        getCookie('access_token_rtr'),
        getCookie('refresh_token_rtr'),
        getCookie('refresh_token_epl'),
        getCookie('access_token_epl')
      ]);


      if (!access_token && !refresh_token && !refresh_token_epl && !access_token_epl) return

      if (socket) {
        socket.disconnect()
      }
      if (access_token && refresh_token) {
        socket = connectSocket(access_token, 'restaurant', refresh_token)
      }

      if (access_token_epl && refresh_token_epl) {
        socket = connectSocket(access_token_epl, 'restaurant', refresh_token_epl)
      }

      function onConnect() {
        socket.on('login_guest_table', loginGuestTable)
        socket.on('order_dish_new', orderDishNew)
        socket.on('order_dish_new_with_restaurant', () => {
          const currentPath = window.location.pathname
          router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
        })
        socket.on('update-status-order-dish', () => {
          const currentPath = window.location.pathname
          router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
        })
        socket.on('order_dish_sumary_new_restaurant', (data: any) => {
          switchStatusOrderVi(data)
          const currentPath = window.location.pathname
          router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
        })
        socket.on('order_dish_sumary_update_status', (data: any) => {
          switchStatusOrderVi(data)
          const currentPath = window.location.pathname
          router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
        })

        socket.on('guest-cancel-order', () => {
          const currentPath = window.location.pathname
          router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
        })

        socket.on('notification_account', (data: INotification) => {
          runAddNotification(data)
        })
      }

      function onDisconnect() {
      }

      function loginGuestTable(data: { guest_name: string; tbl_name: string }) {
        toast({
          title: 'Thông báo',
          description: `Vừa có khách hàng ${data.guest_name} vào ${data.tbl_name}`,
          variant: 'default'
        })
        const currentPath = window.location.pathname
        router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
      }

      function orderDishNew(data: null) {
        toast({
          title: 'Thông báo',
          description: 'Có một order mới',
          variant: 'default'
        })
        const currentPath = window.location.pathname
        router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
      }

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)

      return () => {
        socket.off('connect', onConnect)
        socket.off('disconnect', onDisconnect)
        socket.off('login_guest_table', loginGuestTable)
        socket.off('order_dish_new', orderDishNew)
        socket.disconnect()
      }
    }

    // Hàm làm mới token và kết nối lại socket nếu thành công
    const refreshToken = async () => {
      const res = await getInfor()
      console.log('res', res);
      const currentPathname = window.location.pathname
      if (res?.code === 0 && res.data) {
        await connectSocketWithCookie()
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
      } else {
        router.push('/auth/login')
        if (socket) {
          socket.disconnect()
        }
      }
    }

    refreshToken()

    intervalId = setInterval(() => {
      refreshToken()
    }, 1000 * 60 * 10) // 10 phút

    return () => {
      clearInterval(intervalId)
      if (socket) {
        socket.disconnect()
      }
    }
  }, [dispatch, router])

  return <></>
}
