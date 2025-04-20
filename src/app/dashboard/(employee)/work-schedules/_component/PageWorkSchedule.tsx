'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { CalendarIcon, Plus } from 'lucide-react'
import { Tooltip } from 'react-tooltip'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { getListWorkSchedule } from '../work-schedule.api'
import { IWorkSchedule } from '../work-schedule.interface'
import { IWorkingShift } from '../../working-shifts/working-shift.interface'
import { findOneEmployee } from '../../employees/employees.api'
import { RootState } from '@/app/redux/store'
import { useSelector } from 'react-redux'

interface IWorkScheduleMapping {
  date: string
  ws_id: string
  workingShift: (IWorkingShift & {
    employeeData: { id: string; name: string }[]
    label: { lb_name: string; lb_color: string } // Add label to each shift
  })[]
}

export default function PageWorkSchedule() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 50))
  )
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() + 50))
  )
  const [listWorkSchedule, setListWorkSchedule] = useState<IWorkScheduleMapping[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [employeeCache, setEmployeeCache] = useState<Map<string, { id: string; name: string }>>(new Map())

  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)

  const getListWorkScheduleByDate = async () => {
    setIsLoading(true)
    try {
      const res: IBackendRes<IWorkSchedule[]> = await getListWorkSchedule(startDate, endDate)
      if (res.statusCode === 201 || res.statusCode === 200) {
        if (res.data) {
          // Fetch employee details for all unique employee IDs
          const allEmployeeIds = new Set(
            res.data.flatMap((item: IWorkSchedule & { listEmployeeId?: string[] }) =>
              item.listEmployeeId || []
            )
          )
          const employeePromises = Array.from(allEmployeeIds).map(async (id) => {
            if (!employeeCache.has(id)) {
              const employeeRes = await findOneEmployee({ _id: id })
              if (employeeRes.statusCode === 200 && employeeRes.data) {
                return { id, name: employeeRes.data.epl_name }
              }
            }
            return employeeCache.get(id)
          })
          const employeeResults = (await Promise.all(employeePromises)).filter(Boolean)
          const newCache = new Map(employeeCache)
          employeeResults.forEach((emp) => emp && newCache.set(emp.id, emp))
          setEmployeeCache(newCache)

          res.data.forEach((item) => {
            // Add 7 hours to ws_date
            item.ws_date = new Date(new Date(item.ws_date).setHours(new Date(item.ws_date).getHours() + 7))
          })
          const data = mapWorkingShifts(res.data, newCache)
          setListWorkSchedule(data)
        }
      } else if (res.code === -10) {
        toast({
          title: 'Thông báo',
          description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
          variant: 'destructive',
        })
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        toast({
          title: 'Thông báo',
          description:
            'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Thông báo',
          description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu, vui lòng thử lại sau',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const mapWorkingShifts = (
    data: IWorkSchedule[],
    cache: Map<string, { id: string; name: string }>
  ) => {
    const tempResult: any = {}
    data.forEach((item: IWorkSchedule & { listEmployeeId?: string[]; label?: { lb_name: string; lb_color: string } }) => {
      const date = format(new Date(item.ws_date), 'dd/MM/yyyy') // Format adjusted date
      if (!tempResult[date]) {
        tempResult[date] = { ws_id: item.ws_id, workingShifts: [] }
      }
      if (typeof item.workingShift === 'object') {
        const shift: IWorkingShift & { employeeData: { id: string; name: string }[]; label: { lb_name: string; lb_color: string } } = {
          wks_id: item.workingShift.wks_id,
          wks_name: item.workingShift.wks_name,
          wks_description: item.workingShift.wks_description,
          wks_start_time: item.workingShift.wks_start_time,
          wks_end_time: item.workingShift.wks_end_time,
          employeeData: (item.listEmployeeId || []).map((id) => ({
            id,
            name: cache.get(id)?.name || 'Unknown',
          })),
          label: item.label || { lb_name: 'N/A', lb_color: '#e5e7eb' }, // Assign label to shift
        }
        tempResult[date].workingShifts.push(shift)
      }
    })

    const result = Object.keys(tempResult).map((date) => ({
      date,
      workingShift: tempResult[date].workingShifts,
      ws_id: tempResult[date].ws_id,
    }))

    result.sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime())
    return result
  }

  useEffect(() => {
    getListWorkScheduleByDate()
  }, [startDate, endDate])

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-col sm:flex-row gap-3 mb-3 items-center justify-between">
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] justify-start text-left font-normal  backdrop-blur-sm shadow-sm  transition-all',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy') : <span>Chọn ngày bắt đầu</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] justify-start text-left font-normal  backdrop-blur-sm shadow-sm  transition-all',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy') : <span>Chọn ngày kết thúc</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {
          inforRestaurant._id && (
            <Link href="/dashboard/work-schedules/add">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Thêm lịch
              </Button>
            </Link>
          )
        }

      </div>

      <Card className="w-full  backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="w-full" style={{ height: 'calc(100vh - 160px)' }}>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <motion.div
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              </div>
            ) : (
              <div className="flex gap-4 p-6">
                <AnimatePresence>
                  {listWorkSchedule.map((item: IWorkScheduleMapping, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="w-80 bg-gradient-to-b  to-gray-50 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg ">{item.date}</h3>
                          </div>
                          <ScrollArea className="h-[400px] pr-4">
                            <Link href={`/dashboard/work-schedules/${item.ws_id}`}
                              className={cn(
                                'flex flex-col gap-2',
                                inforEmployee._id ? 'pointer-events-none ' : 'pointer-events-auto'
                              )}
                              onClick={(e) => {
                                if (inforEmployee._id) {
                                  e.preventDefault()
                                  toast({
                                    title: 'Thông báo',
                                    description: 'Bạn không có quyền truy cập vào trang này',
                                    variant: 'destructive',
                                  })
                                }
                              }
                              }
                            >
                              <div className="space-y-3">
                                {item.workingShift.length > 0 ? (
                                  item.workingShift.map((shift, shiftIndex: number) => (
                                    <Card
                                      key={shiftIndex}
                                      className="p-3 transition-colors"
                                      data-tooltip-id={`shift-tooltip-${shiftIndex}-${index}`}
                                      data-tooltip-content={shift.wks_description || 'Không có ghi chú'}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-semibold ">{shift.wks_name}</p>
                                          <p className="text-sm ">
                                            {shift.wks_start_time} - {shift.wks_end_time}
                                          </p>
                                          {/* <p
                                            
                                            className='text-sm text-gray-600'
                                            style={{ fontWeight: inforEmployee.epl_name ? 'bold' : 'normal' }}
                                          >
                                            NV:{' '}
                                            {shift.employeeData.length > 0
                                              ? shift.employeeData.map((e) => e.name).join(', ')
                                              : 'N/A'}
                                          </p> */}
                                          {
                                            shift.employeeData.length > 0 ? (
                                              <p className="text-sm text-gray-600">
                                                NV:{' '}
                                                {shift.employeeData.map((e) => (
                                                  <span
                                                    key={e.id}
                                                    className={cn(
                                                      'font-medium',
                                                      inforEmployee.epl_name === e.name ? 'text-blue-700 font-semibold' : ''
                                                    )}
                                                  >
                                                    {e.name},{' '}
                                                  </span>
                                                ))}
                                              </p>
                                            ) : (
                                              <p className="text-sm text-gray-600">NV: N/A</p>
                                            )
                                          }
                                          <span
                                            className="text-sm font-medium px-1 py-1 rounded-full text-white"
                                            style={{ backgroundColor: shift.label.lb_color }}
                                          >
                                            {shift.label.lb_name}
                                          </span>
                                        </div>

                                      </div>
                                      {/* <Tooltip
                                        id={`shift-tooltip-${shiftIndex}-${index}`}
                                        style={{
                                          borderRadius: '8px',
                                          padding: '8px',
                                          maxWidth: '200px',
                                        }}
                                      /> */}
                                    </Card>
                                  ))
                                ) : (
                                  <p className="text-gray-500 italic">Không có ca làm việc</p>
                                )}
                              </div>
                            </Link>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}