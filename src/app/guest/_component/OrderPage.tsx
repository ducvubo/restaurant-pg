'use client'
import { IDish } from '@/app/dashboard/dishes/dishes.interface'
import { RootState } from '@/app/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { lishDishOrder, orderDish } from '../guest.api'
import { CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { calculateFinalPrice } from '@/app/utils'
import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirectGuest } from '@/app/actions/action'

export default function OrderPage() {
  const router = useRouter()
  const { setLoading } = useLoading()
  const inforGuest = useSelector((state: RootState) => state.inforGuest)
  const [listDish, setListDish] = useState<Omit<IDish, 'dish_status' | 'isDeleted'>[]>([])
  const [selectedDishes, setSelectedDishes] = useState<{ [key: string]: number }>({})

  const getListDish = async () => {
    setLoading(true)
    try {
      const res: IBackendRes<Omit<IDish, 'dish_status' | 'isDeleted'>[]> = await lishDishOrder({
        guest_restaurant_id: inforGuest.guest_restaurant_id
      })
      setLoading(false)
      if (res.statusCode === 200 && res.data) {
        setListDish(res.data)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (inforGuest.guest_name) {
      getListDish()
    }
  }, [inforGuest])

  const handleQuantityChange = (id: string, change: number) => {
    setSelectedDishes((prev) => {
      const updatedQuantity = (prev[id] || 0) + change
      if (updatedQuantity < 0) return prev
      return { ...prev, [id]: updatedQuantity }
    })
  }

  const totalQuantity = Object.values(selectedDishes).reduce((sum, quantity) => sum + quantity, 0)

  const totalPrice = listDish.reduce((total, dish) => {
    const quantity = selectedDishes[dish._id] || 0
    return total + quantity * calculateFinalPrice(dish.dish_price, dish.dish_sale)
  }, 0)

  const handleOrderDish = async () => {
    setLoading(true)
    const dishOrderArray = Object.entries(selectedDishes)
      .filter(([_, quantity]) => quantity > 0) // Only include dishes with quantity > 0
      .map(([dishId, quantity]) => ({ od_dish_id: dishId, od_dish_quantity: quantity }))

    const res: IBackendRes<any> = await orderDish(dishOrderArray)
    if (res.statusCode === 201) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: 'Đặt hàng thành công',
        variant: 'default'
      })
      router.push('/guest/list-order')
    } else if (res?.code === 400) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
            variant: 'destructive'
          })
        })
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive'
        })
      }
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại, hoặc liên hệ nhân viên',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirectGuest()
    } else {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau ít phút hoặc liên hệ nhân viên',
        variant: 'destructive'
      })
    }
  }

  // useEffect(() => {
  //   const connectSocketWithCookie = async () => {
  //     const cookie = await getCookie('access_token_guest')
  //     if (!cookie) return

  //     let socket = connectSocket(cookie, 'guest')

  //     // Hàm xử lý khi connect thành công
  //     function onConnect() {
  //       socket.on('update-status-order-dish', updateStatus)
  //       console.log('Connected:', socket.id)
  //     }

  //     // Hàm xử lý khi disconnect
  //     function onDisconnect() {
  //       console.log('Disconnected')
  //     }

  //     function updateStatus(data: any) {
  //       console.log('data:::::::::::::::::::', data)
  //     }

  //     // Sử dụng socket.on để lắng nghe sự kiện connect và disconnect
  //     socket.on('connect', onConnect)
  //     socket.on('disconnect', onDisconnect)

  //     // Thiết lập interval để reconnect sau 10 phút (600000ms)
  //     const intervalId = setInterval(() => {
  //       console.log('Reconnecting after 10 minutes...')
  //       socket.disconnect() // Ngắt kết nối socket hiện tại
  //       socket = connectSocket(cookie, 'guest') // Kết nối lại với token từ cookie

  //       // Lắng nghe lại các sự kiện sau khi reconnect
  //       socket.on('connect', onConnect)
  //       socket.on('disconnect', onDisconnect)
  //       socket.on('update-status-order-dish', updateStatus)
  //     }, 600000) // 10 phút

  //     // Cleanup khi component unmount
  //     return () => {
  //       socket.off('connect', onConnect)
  //       socket.off('disconnect', onDisconnect)
  //       clearInterval(intervalId) // Xóa interval khi component unmount
  //       socket.disconnect() // Ngắt kết nối socket khi component unmount
  //     }
  //   }

  //   connectSocketWithCookie() // Gọi hàm async
  // }, [])

  return (
    <div className='flex justify-center items-center mx-1'>
      <div className='border-none rounded-none'>
        <CardHeader className='flex justify-center items-center'>
          <CardTitle className='font-bold text-2xl'>
            <span className='mr-2'>🍕</span>Menu quán
          </CardTitle>
        </CardHeader>
        <div className='flex flex-col justify-between gap-3'>
          {listDish?.map((dish, index) => (
            <div key={index} className='flex gap-2'>
              <Image
                src={dish.dish_image.image_cloud}
                width={100}
                height={100}
                alt={dish.dish_name}
                className='w-20 h-20 object-cover rounded-lg'
              />
              <div className='flex flex-col justify-between gap-1 w-full'>
                <Label className='font-bold text-lg min-h-[10px]'>{dish.dish_name}</Label>
                <span className='min-h-[10px] line-clamp-2 overflow-hidden'>{dish.dish_short_description}</span>
                <span>Giá: {calculateFinalPrice(dish.dish_price, dish.dish_sale).toLocaleString()} đ</span>
              </div>
              <div className='flex flex-col justify-center gap-2'>
                {dish.dish_sale && (
                  <div className='flex'>
                    Giảm:
                    {dish.dish_sale?.sale_type === 'percentage'
                      ? ` ${dish.dish_sale.sale_value}%`
                      : ` ${dish.dish_sale?.sale_value}đ`}
                  </div>
                )}
                <div className='flex gap-2 items-end'>
                  <Button className='h-6 w-6' onClick={() => handleQuantityChange(dish._id, -1)} variant={'secondary'}>
                    -
                  </Button>
                  <Input disabled className='w-11 h-6 text-center' value={selectedDishes[dish._id] || 0} />
                  <Button className='h-6 w-6' onClick={() => handleQuantityChange(dish._id, 1)} variant={'secondary'}>
                    +
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className='w-full sticky bottom-0 z-10 mt-2'>
          <Button className='w-full'>Đặt hàng 5 món với giá 5,000,000 đ</Button>
        </div> */}
        <div className='w-full sticky bottom-0 z-10 mt-2'>
          <Button className='w-full' disabled={totalQuantity === 0} onClick={handleOrderDish}>
            {totalQuantity === 0 && totalPrice === 0
              ? 'Chọn món trước khi đặt hàng'
              : `Đặt hàng ${totalQuantity} món với giá ${totalPrice.toLocaleString()} đ`}
          </Button>
        </div>
      </div>
    </div>
  )
}
