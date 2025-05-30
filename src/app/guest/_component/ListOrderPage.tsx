'use client'
import { RootState } from '@/app/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { cancelOrder, getListOrder, GetRestaurantById } from '../guest.api'
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
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export default function ListOrderPage() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const a = useSearchParams().get('a')
  const inforGuest = useSelector((state: RootState) => state.inforGuest)
  const [orderSummary, setOrderSummary] = useState<IOrderDishGuest>()
  const [restaurant, setRestaurant] = useState<any>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  console.log("🚀 ~ ListOrderPage ~ restaurant:", restaurant)
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

  const getInforRestaurant = async () => {
    const res: IBackendRes<any> = await GetRestaurantById('677aac262fc0d1491a5ca032')
    if (res.statusCode === 200 && res.data) {
      setLoading(false)
      setRestaurant(res.data)
    }
  }

  useEffect(() => {
    findListOrder()
    getInforRestaurant()
  }, [a])

  function calculateOrderSummary(orderSummary1: any) {
    let totalQuantity = 0
    let totalPrice = 0

    orderSummary1?.or_dish
      // .filter((item: any) => item.od_dish_status !== 'guest_cancel')
      .forEach((dish: any) => {
        if (dish.od_dish_status === 'delivered') {
          totalQuantity += dish.od_dish_quantity
          const originalPrice = dish.od_dish_duplicate_id.dish_duplicate_price
          const sale = dish.od_dish_duplicate_id.dish_duplicate_sale

          let finalPrice = originalPrice

          if (sale && sale.sale_type && sale.sale_type === 'fixed') {
            finalPrice -= sale.sale_value
          }

          totalPrice += finalPrice * dish.od_dish_quantity
        }
      })
    return {
      totalQuantity,
      totalPrice
    }
  }

  const gusetCancelOrder = async (od_dish_id: string) => {
    console.log('🚀 ~ gusetCancelOrder ~ od_dish_id:', od_dish_id)
    const res: IBackendRes<any> = await cancelOrder({ od_dish_id: od_dish_id })
    if (res.statusCode === 200) {
      toast({
        title: 'Thông báo',
        description: `Đơn hàng đã được hủy thành công`,
        variant: 'default'
      })
      findListOrder()
    } else {
      toast({
        title: 'Thông báo',
        description: `Đơn hàng không thể hủy, vui lòng liên hệ nhân viên`,
        variant: 'destructive'
      })
    }
  }

  const { totalQuantity, totalPrice } = calculateOrderSummary(orderSummary)

  return (
    <div className='flex justify-center items-center'>
      <div className='border-none rounded-none'>
        <CardHeader className='flex justify-center items-center !p-0 mb-2'>
          <CardTitle className='font-bold text-2xl'>
            <span className='mr-2'>🍕</span>Danh sách đơn hàng
          </CardTitle>
        </CardHeader>
        <div className='flex flex-col justify-between gap-3 m-3'>
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
                <div className='flex gap-2'>
                  {item.od_dish_status === 'pending' && (
                    <Badge
                      onClick={() => gusetCancelOrder(item._id)}
                      className='cursor-default w-auto whitespace-nowrap'
                      variant={'destructive'}
                    >
                      Hủy
                    </Badge>
                  )}
                  <Badge className='cursor-default w-auto whitespace-nowrap' variant={'secondary'}>
                    {switchStatusOrderVi(item.od_dish_status)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          <span>
            {orderSummary?.od_dish_smr_status === 'paid' &&
              'Đơn hàng của bạn đã được thanh toán, cảm ơn bạn đã sử dụng dịch vụ của chúng tôi'}
            {orderSummary?.od_dish_smr_status === 'refuse' &&
              'Đơn hàng của bạn bị từ chối order bạn không được order tiếp'}
            {orderSummary?.od_dish_smr_status === 'ordering' && (
              <div className='flex flex-col p-2'>
                <div>
                  Đơn của bạn chưa thanh toán: {totalQuantity} món với giá:
                  <span className='italic font-bold'>{totalPrice?.toLocaleString()} đ</span>
                </div>

                <Button onClick={() => setIsDialogOpen(true)}>Thanh toán</Button>
              </div>
            )}
          </span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">Xác nhận thanh toán</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <Image
                src={`https://qr.sepay.vn/img?acc=${restaurant?.restaurant_bank.account_number}&bank=${restaurant?.restaurant_bank.bank}&amount=${totalPrice}&des=ORDERDISH ${orderSummary?._id}`}
                width={150}
                height={150}
                alt="QR Code Thanh toán"
                className="object-contain"
              />
              <p className="text-center text-sm">
                Bạn đang thanh toán cho đơn hàng gồm <span className="font-bold">{totalQuantity}</span> món với tổng giá trị{' '}
                <span className="font-bold">{totalPrice?.toLocaleString()} đ</span>.
                Vui lòng quét mã QR để hoàn tất thanh toán (Lưu ý: Không sửa nội dung giao dịch).
              </p>
              <p>
                <p>Tên tài khoản: {restaurant?.restaurant_bank.account_name} </p>
                <p>Số tài khoản: {restaurant?.restaurant_bank.account_number}</p>
                <p> Nội dung giao dịch: <span className="font-bold">ORDERDISH {orderSummary?._id}</span></p>

              </p>
            </div>
            <DialogFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
