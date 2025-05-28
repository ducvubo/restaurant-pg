'use client'
import React, { useEffect, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { getInforGuest, refreshTokenNew } from '../guest.api'
import { startAppGuest } from '../guest.slice'
import { IGuest } from '../guest.interface'
import { getCookie } from '@/app/actions/action'
import { connectSocket } from '@/socket'
import { toast } from '@/hooks/use-toast'
import { switchStatusOrderVi } from '@/app/utils'

export default function RefreshTokenPage() {
  const router = useRouter()
  const dispatch = useDispatch()

  const runAppGuest = (inforGuest: IGuest) => {
    dispatch(startAppGuest(inforGuest))
  }

  useEffect(() => {
    let socket: any
    let intervalId: NodeJS.Timeout

    const connectSocketWithCookie = async () => {
      const cookie = await getCookie('access_token_guest')
      if (!cookie) return

      if (socket) {
        socket.disconnect()
      }

      if (cookie) {
        socket = connectSocket(cookie, 'guest')
      }

      function onConnect() {
        socket.on('update-status-order-dish', updateStatusOrderDish)
        socket.on('update_order_dish_summary', updateStatusOrderDistSumary)
        socket.on('add_member', addMember)
        socket.on('order_dish_new_guest', (data: null) => {
          const currentPath = window.location.pathname
          if (currentPath.startsWith('/guest/list-order')) {
            router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
          }

          toast({
            title: 'Thông báo',
            description: 'Bàn của bạn vừa được gọi món mới',
            variant: 'default'
          })
        })
        socket.on('order_dish_new_restaurant', orderDishNewRestaurant)

      }

      function onDisconnect() { }

      function updateStatusOrderDish(data: {
        dish_duplicate_name: string
        od_dish_status: 'processing' | 'pending' | 'delivered' | 'refuse'
      }) {
        toast({
          title: 'Thông báo',
          description: `Món ${data.dish_duplicate_name} đã thay đổi sang ${switchStatusOrderVi(data.od_dish_status)}`,
          variant: 'default'
        })
        const currentPath = window.location.pathname
        router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
      }

      function updateStatusOrderDistSumary(data: { od_dish_smr_status: 'paid' | 'refuse' }) {
        toast({
          title: 'Thông báo',
          description:
            data.od_dish_smr_status === 'paid'
              ? 'Đơn hành của bạn đã được thanh toán, cảm ơn bạn đã sử dụng dịch vụ của chúng tôi'
              : 'Đơn hàng của bạn đã bị từ chối, vui lòng liên hệ nhân viên để biết thêm chi tiết',
          variant: 'default'
        })
        const currentPath = window.location.pathname
        router.push(`https://pato.taphoaictu.id.vn`)
      }

      function addMember(data: { guest_name: string }) {
        toast({
          title: 'Thông báo',
          description: `Bàn của bạn vừa thành viên mới: ${data.guest_name}`,
          variant: 'default'
        })
      }

      function orderDishNewRestaurant(data: null) {
        const currentPath = window.location.pathname
        router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
        toast({
          title: 'Thông báo',
          description: 'Bàn của bạn vừa được nhân viên đặt món mới',
          variant: 'default'
        })
      }

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)

      return () => {
        socket.off('connect', onConnect)
        socket.off('disconnect', onDisconnect)
        socket.off('update-status-order-dish', updateStatusOrderDish)
        socket.off('update-status-order-dist-summary', updateStatusOrderDistSumary)
        socket.off('add_member', addMember)
        socket.disconnect()
      }
    }

    // Hàm làm mới token và kết nối lại socket nếu thành công
    const refreshToken = async () => {
      const res = await getInforGuest()
      console.log("🚀 ~ refreshToken ~ res:", res)

      if (res?.code === 0 && res.infor) {
        runAppGuest(res.infor)

        await connectSocketWithCookie()
      } else if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname

        if (socket) {
          socket.disconnect()
        }

        // Kiểm tra nếu không phải là trang '/guest/table'
        if (res?.code !== 0 && !currentPath.startsWith('/guest/table')) {
          // router.push('https://pato.taphoaictu.id.vn')
          if (socket) {
            socket.disconnect()
          }
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
