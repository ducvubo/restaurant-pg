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
import { getListOrderDish } from '../order.api'
import { TableOrder } from './Table'
import { columns } from './Columns'
import { debounce } from 'lodash'
import { IModelPaginateWithStatusCount, IStatusCount, OrderRestaurant } from '../order.interface'
import { switchStatusOrderVi } from '@/app/utils'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useSearchParams } from 'next/navigation'
import { useLoading } from '@/context/LoadingContext'

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
  const today = new Date()
  const defaultToDate = new Date(today.setHours(0, 0, 0, 0)) // Set to 00:00
  const defaultFromDate = new Date(today.setHours(23, 59, 0, 0)) // Set to 23:59
  const [toDate, setToDate] = useState<Date>(defaultToDate)
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate)
  const [nameGuest, setNameGuest] = useState('')
  const [tableName, setTableName] = useState('')
  const [status, setStatus] = useState<'processing' | 'pending' | 'paid' | 'delivered' | 'refuse' | 'all'>('all')
  const [listOrder, setlistOrder] = useState<OrderRestaurant[]>([])
  const [pageIndex, setPageIndex] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [meta, setMeta] = useState<{
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    current: 1,
    pageSize: 6,
    totalPage: 1,
    totalItem: 0
  })

  const searchParam = useSearchParams().get('a')

  const handleReset = () => {
    setToDate(defaultToDate)
    setFromDate(defaultFromDate)
    setNameGuest('')
    setTableName('')
    setStatus('all')
    setlistOrder([])
    setPageIndex(1)
    setPageSize(6)
    setMeta({
      current: 1,
      pageSize: 6,
      totalPage: 1,
      totalItem: 0
    })
  }

  const [countStatus, setcountStatus] = useState<IStatusCount[]>([])

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(23) // Đặt giờ là 23
      newDate.setMinutes(59) // Đặt phút là 59
      newDate.setSeconds(0) // Đặt giây là 0
      setFromDate(newDate)
    }
  }

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(0) // Đặt giờ là 00:00
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      setToDate(newDate)
    }
  }

  const findListOrder = async () => {
    setLoading(true)
    const res: IBackendRes<IModelPaginateWithStatusCount<OrderRestaurant>> = await getListOrderDish({
      current: pageIndex,
      pageSize: pageSize,
      toDate,
      fromDate,
      guest_name: nameGuest ? nameGuest : undefined,
      tbl_name: tableName ? tableName : undefined,
      od_dish_status: status
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setLoading(false)
      setcountStatus(res.data?.meta.statusCount)
      setlistOrder(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setlistOrder([])
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setlistOrder([])
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setlistOrder([])
      setLoading(false)
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

  // console.log(listOrder)

  return (
    <section className='mt-2'>
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

        <Select onValueChange={(value: any) => setStatus(value)}>
          <SelectTrigger className='w-[153px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='pending'>Chờ xử lý</SelectItem>
              <SelectItem value='processing'>Đang nấu</SelectItem>
              <SelectItem value='delivered'>Đã phục vụ</SelectItem>
              <SelectItem value='paid'>Đã thanh toán</SelectItem>
              <SelectItem value='refuse'>Từ chối</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='flex gap-3 mt-5'>
        {countStatus.map((item) => (
          <Badge
            key={item.status}
            className='whitespace-nowrap'
            variant={item.status === 'refuse' ? 'destructive' : 'secondary'}
          >
            {switchStatusOrderVi(item.status)}: {item.count}
          </Badge>
        ))}
      </div>
      <TableOrder
        columns={columns}
        data={listOrder}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        meta={meta}
      />
    </section>
  )
}
