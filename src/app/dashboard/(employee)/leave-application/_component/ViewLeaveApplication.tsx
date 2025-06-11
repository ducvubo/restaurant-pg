'use client'
import React, { useEffect, useState } from 'react'
import { ILeaveApplication } from '../leave-application.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { IEmployee } from '../../employees/employees.interface'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getAllEmployee } from '../../work-schedules/work-schedule.api'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

interface ViewLeaveApplicationProps {
  inforLeaveApplication: ILeaveApplication
}

export default function ViewLeaveApplication({ inforLeaveApplication }: ViewLeaveApplicationProps) {
  console.log('inforLeaveApplication', inforLeaveApplication)
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);

  const handleEdit = () => {
    router.push(`/dashboard/leave-application/edit?id=${inforLeaveApplication.leaveAppId}`)
  }

  const fetchEmployees = async () => {
    const res: IBackendRes<IEmployee[]> = await getAllEmployee()
    if (res.statusCode === 200 && res.data) {
      setEmployees(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else {
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra khi lấy danh sách nhân viên, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const employeeName = employees.find(emp => emp._id === inforLeaveApplication.employeeId)?.epl_name || 'Không xác định'
  const statusDisplay = inforLeaveApplication.status ? {
    DRAFT: 'Nháp',
    PENDING: 'Đang chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Đã từ chối',
    CANCELED: 'Đã hủy'
  }[inforLeaveApplication.status] : 'Không xác định'

  return (
    <div className='space-y-6'>
      {
        inforEmployee._id && (
          <div className='flex justify-end'>
            <Button onClick={handleEdit}>Chỉnh sửa</Button>
          </div>
        )
      }
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại đơn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforLeaveApplication.leaveType}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày bắt đầu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforLeaveApplication.startDate
                ? format(new Date(inforLeaveApplication.startDate), 'dd/MM/yyyy', { locale: vi })
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày kết thúc</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforLeaveApplication.endDate
                ? format(new Date(inforLeaveApplication.endDate), 'dd/MM/yyyy', { locale: vi })
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Lý do</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforLeaveApplication.reason}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Trạng thái</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{statusDisplay}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhân viên</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{employeeName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}