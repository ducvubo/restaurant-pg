'use client'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { TableCompnonent } from '@/components/Table'
import { columns } from './Columns'
import { ILeaveApplication } from '../leave-application.interface'
import { getAllLeaveApplication } from '../leave-application.api'
import { toast } from '@/hooks/use-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function BookTablePage() {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('ALL') // Default to 'ALL'
  const [typeSearch, setTypeSearch] = useState<string>('')
  const [meta, setMeta] = useState<{
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  })

  const [listLeaveApplication, setListLeaveApplication] = useState<ILeaveApplication[]>([])
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const searchParam = useSearchParams().get('a')

  const findListLeaveApplication = async () => {
    try {
      const res: IBackendRes<IModelPaginate<ILeaveApplication>> = await getAllLeaveApplication({
        pageIndex: pageIndex,
        pageSize: pageSize,
        type: inforEmployee._id ? 'employee' : 'restaurant',
        status: statusFilter !== 'ALL' ? statusFilter : undefined, // Send undefined for 'ALL'
        leaveType: typeSearch || undefined,
      })

      if (res.statusCode === 200 && res.data && res.data.result) {
        setListLeaveApplication(res.data.result)
        setMeta(res.data.meta)
      } else if (res.code === -10) {
        setListLeaveApplication([])
        toast({
          title: 'Thông báo',
          description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
          variant: 'destructive',
        })
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setListLeaveApplication([])
        toast({
          title: 'Thông báo',
          description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
          variant: 'destructive',
        })
      } else {
        setListLeaveApplication([])
        toast({
          title: 'Thất bại',
          description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setListLeaveApplication([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    findListLeaveApplication()
  }, [pageIndex, pageSize, inforEmployee, inforRestaurant, searchParam, statusFilter, typeSearch])

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'DRAFT', label: 'Nháp' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Đã từ chối' },
    { value: 'CANCELED', label: 'Đã hủy' },
  ]

  return (
    <div className='w-full flex flex-col gap-4 mt-2'>
      <div className='w-full flex flex-wrap gap-4 items-end'>
        <div className='flex gap-4'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Chọn trạng thái' />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Input
            placeholder='Tìm kiếm type...'
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
            className='max-w-sm'
          /> */}
        </div>

        {inforEmployee._id && (
          <div className='ml-auto'>
            <Link href={`/dashboard/leave-application/add`}>
              <Button>Thêm</Button>
            </Link>
          </div>
        )}
      </div>

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