'use client'
import React, { use, useEffect, useState } from 'react'
import AddOrEdit from './AddOrEdit'
import { SerializedEditorState } from 'lexical'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ca } from 'date-fns/locale'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IWorkSchedule } from '../work-schedule.interface'
import { getListWorkSchedule } from '../work-schedule.api'
import { any } from 'zod'
import { IWorkingShift } from '../../working-shifts/working-shift.interface'
import Link from 'next/link'

interface IWorkScheduleMapping {
  date: string
  ws_id: string
  workingShift: IWorkingShift[]
}

export default function PageWorkSchedule() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 50)))
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 50)))
  const [listWorkSchedule, setListWorkSchedule] = useState<IWorkScheduleMapping[]>([])
  console.log('🚀 ~ PageWorkSchedule ~ listWorkSchedule:', listWorkSchedule)

  const getListWorkScheduleByDate = async () => {
    try {
      const res: IBackendRes<IWorkSchedule[]> = await getListWorkSchedule(startDate, endDate)
      if (res.statusCode === 201 || res.statusCode === 200) {
        if (res.data) {
          res.data.forEach((item) => {
            item.ws_date = new Date(new Date(item.ws_date).setDate(new Date(item.ws_date).getDate() + 1))
          })
          const data = mapWorkingShifts(res.data)
          setListWorkSchedule(data)
        }
      } else if (res.code === -10) {
        toast({
          title: 'Thông báo',
          description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
          variant: 'destructive'
        })
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        toast({
          title: 'Thông báo',
          description:
            'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Thông báo',
          description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive'
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const mapWorkingShifts = (data: IWorkSchedule[]) => {
    const tempResult: any = {}

    data.forEach((item: IWorkSchedule) => {
      const date = new Date(item.ws_date).toISOString().split('T')[0]

      if (!tempResult[date]) {
        tempResult[date] = { ws_id: item.ws_id, workingShifts: [] }
      }

      if (typeof item.workingShift === 'object') {
        const shift: IWorkingShift = {
          wks_id: item.workingShift.wks_id,
          wks_name: item.workingShift.wks_name,
          wks_description: item.workingShift.wks_description,
          wks_start_time: item.workingShift.wks_start_time,
          wks_end_time: item.workingShift.wks_end_time
        }
        tempResult[date].workingShifts.push(shift)
      }
    })

    const result = Object.keys(tempResult).map((date) => ({
      date: date,
      workingShift: tempResult[date].workingShifts,
      ws_id: tempResult[date].ws_id
    }))

    //sắp xếp ngày tăng dần
    result.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    return result
  }

  useEffect(() => {
    getListWorkScheduleByDate()
  }, [startDate, endDate])

  return (
    <div className='h-full'>
      <div className='flex gap-3'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn('w-[240px] justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
            >
              <CalendarIcon />
              {startDate ? format(startDate, 'dd/MM/yyyy') : <span>Pick a startDate</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar mode='single' selected={startDate} onSelect={(date) => date && setStartDate(date)} initialFocus />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn('w-[240px] justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
            >
              <CalendarIcon />
              {endDate ? format(endDate, 'dd/MM/yyyy') : <span>Pick a endDate</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar mode='single' selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
          </PopoverContent>
        </Popover>

        <Link href='/dashboard/work-schedules/add'>
          <Button>Thêm</Button>
        </Link>
      </div>

      <Card style={{ height: 'calc(100vh - 140px)' }} className='w-full mt-3 rounded-none'>
        <CardContent>
          <ScrollArea style={{ width: '100%', height: 'calc(100vh - 145px)' }} className='px-2'>
            <div className='flex gap-3 h-full'>
              {listWorkSchedule.map((item: IWorkScheduleMapping, index: number) => (
                <Card key={index} className='w-80 h-full mt-6'>
                  <CardContent className='!p-0'>
                    <span className='flex justify-center font-bold'>{item.date}</span>
                    <ScrollArea style={{ height: 'calc(100vh - 210px)', width: '100%' }} className='pb-2'>
                      <Link href={`/dashboard/work-schedules/${item.ws_id}`} className='flex flex-col gap-2 p-3'>
                        {item.workingShift.length > 0 &&
                          item.workingShift.map((shift: IWorkingShift, index: any) => (
                            <Card key={index} className='flex w-full gap-2 p-3 items-center'>
                              <span>{shift.wks_name}:</span>
                              <span>
                                {shift.wks_start_time} - {shift.wks_end_time}
                              </span>
                            </Card>
                          ))}
                      </Link>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
