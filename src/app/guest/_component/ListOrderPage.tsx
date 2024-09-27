'use client'
import { RootState } from '@/app/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getListOrder } from '../guest.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IOrderDish } from '../guest.interface'
import { calculateFinalPrice, switchStatusOrderVi } from '@/app/utils'

export default function ListOrderPage() {
  const inforGuest = useSelector((state: RootState) => state.inforGuest)
  const [listOrder, setlistOrder] = useState<IOrderDish[]>()

  const findListOrder = async () => {
    const res: IBackendRes<IOrderDish[]> = await getListOrder()
    if (res.statusCode === 200) {
      setlistOrder(res.data)
    }
  }

  useEffect(() => {
    findListOrder()
  }, [])

  const filteredDishes = listOrder?.filter((dish) => dish.od_dish_status !== 'paid')
  const totalQuantity = filteredDishes?.reduce((total, dish) => total + dish.od_dish_quantity, 0)
  const totalPrice = filteredDishes?.reduce(
    (total, dish) =>
      total +
      dish.od_dish_quantity *
        calculateFinalPrice(
          dish.od_dish_duplicate_id.dish_duplicate_price,
          dish.od_dish_duplicate_id.dish_duplicate_sale
        ),
    0
  )

  return (
    <div className='flex justify-center items-center'>
      <div className='border-none rounded-none'>
        <CardHeader className='flex justify-center items-center'>
          <CardTitle className='font-bold text-2xl'>
            <span className='mr-2'>🍕</span>Danh sách đơn hàng
          </CardTitle>
        </CardHeader>
        <div className='flex flex-col justify-between gap-3'>
          {listOrder?.map((item, index) => (
            <div key={index} className='flex gap-4'>
              <Image
                src={item.od_dish_duplicate_id.dish_duplicate_image.image_cloud}
                width={100}
                height={100}
                alt='vuducbo'
                className='w-20 h-20 object-cover rounded-lg'
              />
              <div className='flex flex-col justify-start gap-1 w-full'>
                <Label className='font-semibold min-h-[10px]'>{item.od_dish_duplicate_id.dish_duplicate_name}</Label>
                <span>
                  Giá:
                  {calculateFinalPrice(
                    item.od_dish_duplicate_id.dish_duplicate_price,
                    item.od_dish_duplicate_id.dish_duplicate_sale
                  ).toLocaleString()}
                  đ x {item.od_dish_quantity}
                </span>

                <span>
                  Tổng:{' '}
                  {(
                    calculateFinalPrice(
                      item.od_dish_duplicate_id.dish_duplicate_price,
                      item.od_dish_duplicate_id.dish_duplicate_sale
                    ) * item.od_dish_quantity
                  ).toLocaleString()}
                </span>
              </div>
              <div className='flex gap-2 items-end justify-end'>
                <Badge className='cursor-default w-auto whitespace-nowrap' variant={'secondary'}>
                  {switchStatusOrderVi(item.od_dish_status)}
                </Badge>
              </div>
            </div>
          ))}
          <span>
            Đơn chưa thanh toán {totalQuantity} món * {totalPrice?.toLocaleString()} đ
          </span>
        </div>
      </div>
    </div>
  )
}
