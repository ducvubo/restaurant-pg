'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'
import { cn } from '@/lib/utils'
import { addDays, isAfter } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { getListBookTable } from '../book-table.api'
import { debounce } from 'lodash'
import { IBookTable } from '../book-table.interface'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { TableCompnonent } from '@/components/Table'
import { columns } from './Columns'
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
export default function BookTablePage() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const today = new Date()
  const defaultToDate = new Date(today.setHours(0, 0, 0, 0)) // Set to 00:00
  const defaultFromDate = new Date(today.setHours(23, 59, 0, 0)) // Set to 23:59
  const [toDate, setToDate] = useState<Date>(defaultToDate)
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate)
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
  const searchParam = useSearchParams().get('a')
  const [listBookTbale, setListBookTbale] = useState<IBookTable[]>([])

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

  const findListBookTable = async () => {
    const res: IBackendRes<IModelPaginate<IBookTable>> = await getListBookTable({
      current: pageIndex,
      pageSize: pageSize,
      toDate: toDate,
      fromDate: fromDate
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      // setLoading(false)
      setListBookTbale(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setListBookTbale([])
      // setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListBookTbale([])
      // setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListBookTbale([])
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
      findListBookTable()
    }, 300), // 500ms là thời gian delay cho debounce
    [toDate, fromDate, pageIndex, pageSize] // Dependencies của debounce
  )

  useEffect(() => {
    debouncedFindListOrder()

    // Hủy debounce khi component bị unmount để tránh gọi hàm không cần thiết
    return () => {
      debouncedFindListOrder.cancel()
    }
  }, [toDate, fromDate, pageIndex, pageSize, debouncedFindListOrder])

  useEffect(() => {
    debouncedFindListOrder()
    return () => {
      debouncedFindListOrder.cancel()
    }
  }, [searchParam])

  return (
    <section>
      <div className='flex gap-2 mt-2'>
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
                <Calendar mode='single' selected={toDate} onSelect={handleSelectToDate} locale={vi} />
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
                <Calendar mode='single' selected={fromDate} onSelect={handleSelectFromDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* <Button className='w-20' variant={'outline'} onClick={handleReset}>
          Reset
        </Button> */}
      </div>
      <TableCompnonent
        columns={columns}
        data={listBookTbale}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        meta={meta}
        height={547}
      />
    </section>
  )
}
