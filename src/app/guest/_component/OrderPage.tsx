'use client'
import { IDish } from '@/app/dashboard/dishes/dishes.interface'
import { RootState } from '@/app/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { lishDishOrder, orderDish } from '../guest.api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'

export default function OrderPage() {
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

  const calculateFinalPrice = (price: number, sale: { sale_type: string; sale_value: number } | undefined) => {
    if (!sale) return price // Nếu không có khuyến mãi, trả về giá gốc
    if (sale.sale_type === 'fixed') {
      return Math.max(0, price - sale.sale_value) // Khuyến mãi cố định
    }
    if (sale.sale_type === 'percentage') {
      return Math.max(0, price - (price * sale.sale_value) / 100) // Khuyến mãi phần trăm
    }
    return price
  }

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
    console.log(dishOrderArray)

    const res: IBackendRes<any> = await orderDish(dishOrderArray)
    if (res.statusCode === 201) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: 'Đặt hàng thành công',
        variant: 'default'
      })
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
    } else {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau ít phút',
        variant: 'destructive'
      })
    }
  }

  // console.log(dishOrderArray)

  return (
    <div className='flex justify-center items-center'>
      <div className='border-none rounded-none'>
        <CardHeader className='flex justify-center items-center'>
          <CardTitle className='font-bold text-2xl'>
            <span className='mr-2'>🍕</span>Menu quán
          </CardTitle>
        </CardHeader>
        <div className='flex flex-col justify-between gap-3'>
          {listDish?.map((dish, index) => (
            <div key={index} className='flex gap-4'>
              <Image
                src={dish.dish_image.image_cloud}
                width={100}
                height={100}
                alt={dish.dish_name}
                className='w-20 h-20 object-cover rounded-lg'
              />
              <div className='flex flex-col justify-between gap-1 w-full'>
                <Label className='font-semibold min-h-[10px]'>{dish.dish_name}</Label>
                <span className='min-h-[10px] line-clamp-2 overflow-hidden'>{dish.dish_short_description}</span>
                <span>Giá: {calculateFinalPrice(dish.dish_price, dish.dish_sale).toLocaleString()} đ</span>
              </div>
              <div className='flex flex-col'>
                <span>akjfknjakjsnkj</span>
                {/* <div className='flex gap-2 items-end'>
                  <Button className='h-6 w-6'>-</Button>
                  <Input disabled className='w-9 h-6 text-center' value={0} />
                  <Button className='h-6 w-6'>+</Button>
                </div> */}
                <div className='flex gap-2 items-end'>
                  <Button className='h-6 w-6' onClick={() => handleQuantityChange(dish._id, -1)}>
                    -
                  </Button>
                  <Input disabled className='w-11 h-6 text-center' value={selectedDishes[dish._id] || 0} />
                  <Button className='h-6 w-6' onClick={() => handleQuantityChange(dish._id, 1)}>
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
            {`Đặt hàng ${totalQuantity} món với giá ${totalPrice.toLocaleString()} đ`}
          </Button>
        </div>
      </div>
    </div>
  )
}
