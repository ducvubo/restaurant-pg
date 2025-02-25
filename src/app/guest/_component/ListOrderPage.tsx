'use client'
import { RootState } from '@/app/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getListOrder } from '../guest.api'
import { CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IOrderDishGuest, OrDish } from '../guest.interface'
import { calculateFinalPrice, switchStatusOrderVi } from '@/app/utils'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect, deleteCookiesAndRedirectGuest } from '@/app/actions/action'
import { toast } from '@/hooks/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ListOrderPage() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const a = useSearchParams().get('a')
  const inforGuest = useSelector((state: RootState) => state.inforGuest)
  const [orderSummary, setOrderSummary] = useState<IOrderDishGuest>()

  const findListOrder = async () => {
    setLoading(true)
    const res: IBackendRes<IOrderDishGuest> = await getListOrder()
    if (res.statusCode === 200 && res.data) {
      setLoading(false)
      setOrderSummary(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại, hoặc liên hệ nhân viên',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirectGuest()
    }
  }

  useEffect(() => {
    findListOrder()
  }, [a])

  function calculateOrderSummary(orderSummary1: any) {
    let totalQuantity = 0
    let totalPrice = 0

    orderSummary1?.or_dish.forEach((dish: any) => {
      // Kiểm tra điều kiện loại bỏ các món có trạng thái 'refuse'
      if (dish.od_dish_status !== 'refuse') {
        totalQuantity += dish.od_dish_quantity

        // Tính giá sau khi áp dụng giảm giá
        const originalPrice = dish.od_dish_duplicate_id.dish_duplicate_price
        const sale = dish.od_dish_duplicate_id.dish_duplicate_sale

        let finalPrice = originalPrice

        // Áp dụng giảm giá nếu có
        if (sale.sale_type === 'fixed') {
          finalPrice -= sale.sale_value // Giảm giá cố định
        }

        // Cộng dồn giá cho từng món ăn
        totalPrice += finalPrice * dish.od_dish_quantity
      }
    })

    return {
      totalQuantity,
      totalPrice
    }
  }

  const { totalQuantity, totalPrice } = calculateOrderSummary(orderSummary)

  return (
    <div className='flex justify-center items-center'>
      <div className='border-none rounded-none'>
        <CardHeader className='flex justify-center items-center'>
          <CardTitle className='font-bold text-2xl'>
            <span className='mr-2'>🍕</span>Danh sách đơn hàng
          </CardTitle>
        </CardHeader>
        <div className='flex flex-col justify-between gap-3'>
          {orderSummary?.or_dish?.map((item: any, index) => (
            <div key={index} className='flex gap-4'>
              <Image
                src={item.od_dish_duplicate_id.dish_duplicate_image.image_cloud}
                width={100}
                height={100}
                alt='vuducbo'
                className='w-20 h-20 min-w-20 min-h-20 object-cover rounded-lg'
              />
              <div className='flex flex-col justify-start w-full gap-1'>
                <Label className='font-semibold min-h-[10px]'>{item.od_dish_duplicate_id.dish_duplicate_name}</Label>
                <span className=' italic'>
                  Giá:
                  {calculateFinalPrice(
                    item.od_dish_duplicate_id.dish_duplicate_price,
                    item.od_dish_duplicate_id.dish_duplicate_sale
                  ).toLocaleString()}
                  đ x {item.od_dish_quantity}
                </span>

                <span className=' italic'>
                  Tổng:{' '}
                  {(
                    calculateFinalPrice(
                      item.od_dish_duplicate_id.dish_duplicate_price,
                      item.od_dish_duplicate_id.dish_duplicate_sale
                    ) * item.od_dish_quantity
                  ).toLocaleString()}
                </span>
              </div>
              <div className='flex gap-2 items-end justify-end flex-col'>
                <span className='text-sm'>Order: {item.od_dish_guest_id.guest_name}</span>
                <Badge className='cursor-default w-auto whitespace-nowrap' variant={'secondary'}>
                  {switchStatusOrderVi(item.od_dish_status)}
                </Badge>
              </div>
            </div>
          ))}
          <span>
            {orderSummary?.od_dish_smr_status === 'paid' &&
              'Đơn hàng của bạn đã được thanh toán, cảm ơn bạn đã sử dụng dịch vụ của chúng tôi'}
            {orderSummary?.od_dish_smr_status === 'refuse' &&
              'Đơn hàng của bạn bị từ chối order bạn không được order tiếp'}
            {orderSummary?.od_dish_smr_status === 'ordering' && (
              <>
                Đơn của bạn chưa thanh toán: {totalQuantity} món với giá:
                <span className='italic font-bold'>{totalPrice?.toLocaleString()} đ</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
