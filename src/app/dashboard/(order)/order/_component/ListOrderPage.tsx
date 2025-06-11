'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addDays, isAfter } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getListOrderDish, updateStatusOrder } from '../order.api'
import { debounce } from 'lodash'
import { IModelPaginateWithStatusCount, IStatusCount, IOrderRestaurant } from '../order.interface'
import { calculateFinalPrice, calculateTotalPrice, formatDateMongo, switchStatusOrderSummaryVi } from '@/app/utils'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect, getCookie } from '@/app/actions/action'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLoading } from '@/context/LoadingContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Image from 'next/image'
import { Pagination } from '@/components/Pagination'
import { ModalUpdateStatusSummary } from './ModalUpdateSummary'

import { ScrollArea } from '@/components/ui/scroll-area'
import AddOrder from './AddOrderSummary'
import AddOrderDish from './AddOrderDish'
import AddOrderSummary from './AddOrderSummary'
import GennerateQrOrder from './GetQrOrder'
import GetQrOrder from './GetQrOrder'
import ExportBill from './ExportBill'
import GetQrPayment from './GetQrPayment'

const formatVietnameseDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1 // Tháng bắt đầu từ 0
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} - ${hours}:${minutes}`
}

const disableFutureDates = (date: any) => {
  return isAfter(date, new Date())
}
export default function ListOrderPage() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const today = new Date()
  const defaultToDate = new Date(today.setHours(0, 0, 0, 0)) // Set to 00:00
  const defaultFromDate = new Date(today.setHours(23, 59, 0, 0)) // Set to 23:59
  const [toDate, setToDate] = useState<Date>(defaultToDate)
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate)
  const [nameGuest, setNameGuest] = useState('')
  const [tableName, setTableName] = useState('')
  const [status, setStatus] = useState<'ordering' | 'paid' | 'refuse' | 'all'>('all')
  const [listOrder, setlistOrder] = useState<IOrderRestaurant[]>([])
  const [pageIndex, setPageIndex] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [meta, setMeta] = useState<{
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0
  })
  const [countStatus, setcountStatus] = useState<IStatusCount[]>([])

  const searchParam = useSearchParams().get('a')

  const handleReset = () => {
    setToDate(defaultToDate)
    setFromDate(defaultFromDate)
    setNameGuest('')
    setTableName('')
    setStatus('all')
    setlistOrder([])
    setPageIndex(1)
    setPageSize(10)
    setMeta({
      current: 1,
      pageSize: 10,
      totalPage: 1,
      totalItem: 0
    })
  }

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(23) // Đặt giờ là 23
      newDate.setMinutes(59) // Đặt phút là 59
      newDate.setSeconds(0) // Đặt giây là 0
      setFromDate(newDate)
      //gán lên url
      const url = new URL(window.location.href)
      url.searchParams.set('fromDate', newDate.toISOString())
      window.history.pushState({}, '', url)
    }
  }

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(0) // Đặt giờ là 00:00
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      setToDate(newDate)
      //gán lên url
      const url = new URL(window.location.href)
      url.searchParams.set('toDate', newDate.toISOString())
      window.history.pushState({}, '', url)
    }
  }

  const findListOrder = async () => {
    // setLoading(true)
    const res: IBackendRes<IModelPaginateWithStatusCount<IOrderRestaurant>> = await getListOrderDish({
      current: pageIndex,
      pageSize: pageSize,
      toDate,
      fromDate,
      guest_name: nameGuest ? nameGuest : undefined,
      tbl_name: tableName ? tableName : undefined,
      od_dish_smr_status: status
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      // setLoading(false)
      setcountStatus(res.data?.meta.statusCount)
      setlistOrder(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setlistOrder([])
      // setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setlistOrder([])
      // setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setlistOrder([])
      // setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const debouncedFindListOrder = useCallback(
    debounce(() => {
      findListOrder()
    }, 300), // 500ms là thời gian delay cho debounce
    [toDate, fromDate, nameGuest, tableName, status, pageIndex, pageSize] // Dependencies của debounce
  )

  useEffect(() => {
    debouncedFindListOrder()

    // Hủy debounce khi component bị unmount để tránh gọi hàm không cần thiết
    return () => {
      debouncedFindListOrder.cancel()
    }
  }, [toDate, fromDate, nameGuest, tableName, status, pageIndex, pageSize, debouncedFindListOrder])

  useEffect(() => {
    debouncedFindListOrder()
    return () => {
      debouncedFindListOrder.cancel()
    }
  }, [searchParam])

  // Lấy giá trị từ URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const fromDateParam = urlParams.get('fromDate')
    const toDateParam = urlParams.get('toDate')

    if (fromDateParam) {
      const parsedFromDate = new Date(fromDateParam)
      if (!isNaN(parsedFromDate.getTime())) {
        setFromDate(parsedFromDate)
      }
    }

    if (toDateParam) {
      const parsedToDate = new Date(toDateParam)
      if (!isNaN(parsedToDate.getTime())) {
        setToDate(parsedToDate)
      }
    }
  }, [])

  const handleUpdateStatus = async ({
    _id,
    od_dish_status,
    od_dish_summary_id
  }: {
    _id: string
    od_dish_summary_id: string
    od_dish_status: 'processing' | 'pending' | 'delivered' | 'refuse'
  }) => {
    setLoading(true)
    const res = await updateStatusOrder({
      _id,
      od_dish_status,
      od_dish_summary_id
    })
    if (res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái thành công',
        variant: 'default'
      })
      router.push(`/dashboard/order/dish?a=${Math.floor(Math.random() * 100000) + 1}`)
      router.refresh()
    } else if (res.statusCode === 400) {
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
    } else if (res.statusCode === 404) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đơn hàng không tồn tại, vui lòng thử lại sau',
        variant: 'destructive'
      })
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  return (
    <section className='mt-2 h-full'>
      <ScrollArea style={{ height: 'calc(100vh - 6rem)' }} className=' pr-3'>
        <div className='flex gap-2'>
          <div className='flex gap-2'>
            <Label className='mt-2'>Từ</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('w-[180px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {toDate ? formatVietnameseDate(toDate) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='flex w-auto flex-col space-y-2 p-2'>
                <Select onValueChange={(value) => handleSelectToDate(addDays(new Date(), parseInt(value)))}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='0'>Ngày hôm này</SelectItem>
                    <SelectItem value='-1'>Ngày hôm qua</SelectItem>
                    <SelectItem value='-3'>3 ngày trước</SelectItem>
                    <SelectItem value='-7'>7 ngày trước</SelectItem>
                  </SelectContent>
                </Select>
                <div className='rounded-md border'>
                  <Calendar
                    mode='single'
                    selected={toDate}
                    onSelect={handleSelectToDate}
                    locale={vi}
                    disabled={disableFutureDates}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className='flex gap-2'>
            <Label className='mt-2'>Đến</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('w-[180px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {fromDate ? formatVietnameseDate(fromDate) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='flex w-auto flex-col space-y-2 p-2'>
                <Select onValueChange={(value) => handleSelectFromDate(addDays(new Date(), parseInt(value)))}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='0'>Ngày hôm này</SelectItem>
                    <SelectItem value='-1'>Ngày hôm qua</SelectItem>
                    <SelectItem value='-3'>3 ngày trước</SelectItem>
                    <SelectItem value='-7'>7 ngày trước</SelectItem>
                  </SelectContent>
                </Select>
                <div className='rounded-md border'>
                  <Calendar
                    mode='single'
                    selected={fromDate}
                    onSelect={handleSelectFromDate}
                    locale={vi}
                    disabled={disableFutureDates}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button className='w-20' variant={'outline'} onClick={handleReset}>
            Reset
          </Button>
        </div>
        <div className='flex gap-3 w-auto mt-2'>
          <Input placeholder='Tên khách' className='w-32' onChange={(e) => setNameGuest(e.target.value)} />
          <Input placeholder='Tên bàn' className='w-32' onChange={(e) => setTableName(e.target.value)} />

          <Select onValueChange={(value: any) => setStatus(value)} >
            <SelectTrigger className='w-[153px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Chọn trạng thái</SelectLabel>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='paid'>Đã thanh toán</SelectItem>
                <SelectItem value='refuse'>Đã từ chối</SelectItem>
                <SelectItem value='ordering'>Đang phục vụ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <AddOrderSummary />
        </div>

        <div className='flex gap-3 mt-5 justify-between'>
          <div className='flex gap-3'>
            {countStatus.map(
              (item, index) =>
                index !== 3 && (
                  <Badge
                    key={item.status}
                    className='whitespace-nowrap'
                    variant={item.status === 'refuse' ? 'destructive' : 'outline'}
                  >
                    {switchStatusOrderSummaryVi(item.status)}: {item.count}
                  </Badge>
                )
            )}
          </div>
          <span className='mr-1 font-bold italic'>Tổng doanh thu: {countStatus[3]?.count?.toLocaleString()}đ</span>
        </div>

        <div className='flex flex-col gap-3 mt-2 mb-2'>
          {listOrder?.map((order_summary: IOrderRestaurant, index1) => {
            const guestCancel = order_summary.or_dish.filter((item) => item.od_dish_status === 'guest_cancel')
            order_summary.or_dish = order_summary.or_dish.filter((item) => item.od_dish_status !== 'guest_cancel')
            order_summary.or_dish = [...order_summary.or_dish, ...guestCancel]
            return (
              <Card className='w-full' key={index1}>
                <CardHeader>
                  <div className='flex justify-between'>
                    <div>
                      <div className='flex gap-1'>
                        <CardTitle className='mt-[1px]'>{order_summary.od_dish_smr_table_id.tbl_name}: </CardTitle>
                        <CardTitle className='mt-[1px]'>{order_summary.od_dish_smr_guest_id.guest_name}</CardTitle>
                        <CardDescription>({formatDateMongo(order_summary.createdAt)})</CardDescription>
                      </div>
                      <span className='italic'>
                        Tổng hóa đơn: {calculateTotalPrice(order_summary)?.toLocaleString()}đ
                      </span>
                    </div>
                    <div className='flex'>
                      <ExportBill order_summary={order_summary} />
                      <GetQrPayment order_summary={order_summary} />
                      <ModalUpdateStatusSummary order_summary={order_summary} />
                      <AddOrderDish order_summary={order_summary} />
                      <GetQrOrder order_summary={order_summary} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='item-1'>
                      <div className='grid grid-cols-6 -mt-4 mb-2'>
                        <Label className='font-bold -mt-1 col-span-3'>Món ăn</Label>
                        <Label className='font-bold -mt-1'>Tên khách</Label>
                        <Label className='font-bold -mt-1'>Trạng thái</Label>
                        <Label className='font-bold -mt-1'>Tạo/ cập nhật</Label>
                      </div>

                      {order_summary?.or_dish[0] && (
                        <div className='grid grid-cols-6 mb-4'>
                          <div className='flex gap-2 col-span-3'>
                            <Image
                              src={order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_image.image_cloud}
                              width={100}
                              height={100}
                              alt='vuducbo'
                              className='w-[69px] h-[69px] rounded-lg object-cover'
                            />
                            <div className='-mt-1 flex flex-col'>
                              <Label className=''>
                                {order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_name}
                              </Label>
                              <Label className='italic'>
                                Giá:{' '}
                                {Math.floor(calculateFinalPrice(
                                  order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_price,
                                  order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_sale
                                ))?.toLocaleString()}
                                đ x {order_summary?.or_dish[0]?.od_dish_quantity}
                              </Label>
                              <Label className='italic'>
                                Tổng:{' '}
                                {(
                                  Math.floor(calculateFinalPrice(
                                    order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_price,
                                    order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_sale
                                  ) * order_summary?.or_dish[0]?.od_dish_quantity)
                                )?.toLocaleString()}
                                đ
                              </Label>
                            </div>
                          </div>
                          <div className='flex items-center'>
                            <Label className='-mt-1 text-sm'>
                              {order_summary?.or_dish[0]?.od_dish_guest_id.guest_name}
                              {order_summary?.or_dish[0]?.od_dish_guest_id.guest_type === 'member'
                                ? ' (Thành viên)'
                                : ' (Chủ bàn)'}
                            </Label>
                          </div>
                          <div className='flex items-center'>
                            {order_summary?.or_dish[0]?.od_dish_status === 'guest_cancel' ? (
                              <Badge variant='destructive'>Khách hủy</Badge>
                            ) : (
                              <Select
                                value={order_summary?.or_dish[0]?.od_dish_status}
                                onValueChange={(value: 'processing' | 'pending' | 'delivered' | 'refuse') =>
                                  handleUpdateStatus({
                                    _id: order_summary?.or_dish[0]?._id,
                                    od_dish_status: value,
                                    od_dish_summary_id: order_summary._id
                                  })
                                }
                              >
                                <SelectTrigger className='w-[140px]' disabled={order_summary.od_dish_smr_status !== 'ordering'}>
                                  <SelectValue placeholder='Đang nấu' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Chọn trạng thái</SelectLabel>
                                    <SelectItem value='pending'>Chờ xử lý</SelectItem>
                                    <SelectItem value='processing'>Đang nấu</SelectItem>
                                    <SelectItem value='delivered'>Đã phục vụ</SelectItem>
                                    <SelectItem value='refuse'>Từ chối</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          </div>

                          <div className='flex flex-col'>
                            <span>{formatDateMongo(order_summary?.or_dish[0]?.createdAt)}</span>
                            <span>{formatDateMongo(order_summary?.or_dish[0]?.updatedAt)}</span>
                          </div>
                        </div>
                      )}

                      {order_summary.or_dish.slice(1).map((order_dish_item, index2) => {
                        return (
                          <AccordionContent key={index2}>
                            <div className='grid grid-cols-6'>
                              <div className='flex gap-2 col-span-3'>
                                <Image
                                  src={order_dish_item.od_dish_duplicate_id.dish_duplicate_image.image_cloud}
                                  width={100}
                                  height={100}
                                  alt='vuducbo'
                                  className='w-[69px] h-[69px] rounded-lg object-cover'
                                />
                                <div className=' flex flex-col'>
                                  <Label className=''>{order_dish_item.od_dish_duplicate_id.dish_duplicate_name}</Label>
                                  <Label className='italic'>
                                    Giá:{' '}
                                    {Math.floor(calculateFinalPrice(
                                      order_dish_item.od_dish_duplicate_id.dish_duplicate_price,
                                      order_dish_item.od_dish_duplicate_id.dish_duplicate_sale
                                    ))?.toLocaleString()}
                                    đ x {order_dish_item.od_dish_quantity}
                                  </Label>
                                  <Label className='italic'>
                                    Tổng:{' '}
                                    {(
                                      Math.floor(calculateFinalPrice(
                                        order_dish_item.od_dish_duplicate_id.dish_duplicate_price,
                                        order_dish_item.od_dish_duplicate_id.dish_duplicate_sale
                                      ) * order_dish_item.od_dish_quantity
                                      ))?.toLocaleString()}
                                    đ
                                  </Label>
                                </div>
                              </div>
                              <div className='flex items-center'>
                                <Label className=' -mt-1'>
                                  {order_dish_item.od_dish_guest_id.guest_name}{' '}
                                  {order_dish_item.od_dish_guest_id.guest_type === 'member'
                                    ? ' (Thành viên)'
                                    : ' (Chủ bàn)'}
                                </Label>
                              </div>
                              <div className='flex items-center'>
                                {order_dish_item.od_dish_status === 'guest_cancel' ? (
                                  <Badge variant='destructive'>Khách hủy</Badge>
                                ) : (
                                  <Select
                                    value={order_dish_item.od_dish_status}
                                    onValueChange={(value: 'processing' | 'pending' | 'delivered' | 'refuse') =>
                                      handleUpdateStatus({
                                        _id: order_dish_item._id,
                                        od_dish_status: value,
                                        od_dish_summary_id: order_summary._id
                                      })
                                    }
                                  >
                                    <SelectTrigger className='w-[140px]' disabled={order_summary.od_dish_smr_status !== 'ordering'}>
                                      <SelectValue placeholder='Đang nấu' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Chọn trạng thái</SelectLabel>
                                        <SelectItem value='pending'>Chờ xử lý</SelectItem>
                                        <SelectItem value='processing'>Đang nấu</SelectItem>
                                        <SelectItem value='delivered'>Đã phục vụ</SelectItem>
                                        <SelectItem value='refuse'>Từ chối</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                              <div className='flex flex-col'>
                                <span>{formatDateMongo(order_dish_item.createdAt)}</span>
                                <span>{formatDateMongo(order_dish_item.updatedAt)}</span>
                              </div>
                            </div>
                          </AccordionContent>
                        )
                      })}

                      <AccordionTrigger className='-mt-5 -mb-5'>Xem chi tiết</AccordionTrigger>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className='flex justify-end'>
          <Pagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            meta={meta}
          />
        </div>
      </ScrollArea>
    </section>
  )
}
