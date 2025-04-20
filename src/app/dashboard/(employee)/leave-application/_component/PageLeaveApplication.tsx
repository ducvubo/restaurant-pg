'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'
import { cn } from '@/lib/utils'
import { addDays, format, isAfter } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { TableCompnonent } from '@/components/Table'
import { columns } from './Columns'
import { ILeaveApplication } from '../leave-application.interface'
import { getAllLeaveApplication } from '../leave-application.api'
import { toast } from '@/hooks/use-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'


export default function BookTablePage() {

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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

  const [listLeaveApplication, setListLeaveApplication] = useState<ILeaveApplication[]>([])
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const searchParam = useSearchParams().get('a')
  const findListLeaveApplication = async () => {
    const res: IBackendRes<IModelPaginate<ILeaveApplication>> = await getAllLeaveApplication({
      pageIndex: pageIndex,
      pageSize: pageSize,
      type: inforEmployee._id ? 'employee' : 'restaurant',
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setListLeaveApplication(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setListLeaveApplication([])
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListLeaveApplication([])
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListLeaveApplication([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    findListLeaveApplication()
  }, [pageIndex, pageSize, inforEmployee, inforRestaurant, searchParam])

  return (
    <div className='w-full flex gap-4 mt-2 flex-wrap'>
      <TableCompnonent
        columns={columns}
        data={listLeaveApplication}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        meta={meta}
      />
    </div>
  )
}
