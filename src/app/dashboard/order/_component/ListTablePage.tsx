'use client'
import React, { useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addDays, format } from 'date-fns'
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const formatVietnameseDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1 // Tháng bắt đầu từ 0
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} - ${hours}:${minutes}`
}
export default function ListTablePage() {
  const today = new Date()
  const defaultToDate = new Date(today.setHours(0, 0, 0, 0)) // Set to 00:00
  const defaultFromDate = new Date(today.setHours(23, 59, 0, 0)) // Set to 23:59

  const [toDate, setToDate] = useState<Date>(defaultToDate)
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate)

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(23) // Đặt giờ là 23
      newDate.setMinutes(59) // Đặt phút là 59
      newDate.setSeconds(0) // Đặt giây là 0
      setFromDate(newDate)
    }
  }

  // Hàm thiết lập thời gian cho toDate là giờ hiện tại hoặc 00:00 nếu cần
  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(0) // Đặt giờ là 00:00
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      setToDate(newDate)
    }
  }




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

        <Button className='w-20'>Reset</Button>
      </div>
      <div className='flex gap-3 w-auto mt-2'>
        <Input placeholder='Tên khách' className='w-32' />
        <Select>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Số bàn' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn bàn</SelectLabel>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
              <SelectItem value='blueberry'>Blueberry</SelectItem>
              <SelectItem value='grapes'>Grapes</SelectItem>
              <SelectItem value='pineapple'>Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className='w-[153px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
              <SelectItem value='blueberry'>Blueberry</SelectItem>
              <SelectItem value='grapes'>Grapes</SelectItem>
              <SelectItem value='pineapple'>Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button className='w-20'>Tìm</Button>
      </div>

      <div className='mt-2 grid grid-cols-10 gap-3'>
        {Array.from({ length: 50 }).map((_, index) => (
          <Card className='w-20 h-20' key={index}>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
