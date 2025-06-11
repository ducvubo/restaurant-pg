'use client'
import React, { useEffect, useState } from 'react'
import { ITimeSheet, IWorkSchedule } from '../work-schedule.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ILabel } from '../../labels/label.interface'
import { IWorkingShift } from '../../working-shifts/working-shift.interface'
import { IEmployee } from '../../employees/employees.interface'
import { getAllLabel, getAllWorkingShift, getAllEmployee, getTimeSheetByWorkSchedule } from '../work-schedule.api'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface ViewWorkScheduleProps {
  inforWorkSchedule: IWorkSchedule
}

export default function ViewWorkSchedule({ inforWorkSchedule }: ViewWorkScheduleProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [timesSheet, setSetTimeSheet] = useState<ITimeSheet[]>([])
  console.log("🚀 ~ ViewWorkSchedule ~ timesSheet:", timesSheet)

  const handleEdit = () => {
    router.push(`/dashboard/work-schedules/edit?id=${inforWorkSchedule.ws_id}`)
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


  const fetchTimeSheetWorkSchedule = async () => {
    const res: IBackendRes<ITimeSheet[]> = await getTimeSheetByWorkSchedule({ ws_id: inforWorkSchedule.ws_id })
    if (res.statusCode === 200 && res.data) {
      setSetTimeSheet(res.data)
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
    fetchTimeSheetWorkSchedule()
  }, [])

  const employeeNames = inforWorkSchedule.listEmployeeId
    ?.map(id => employees.find(emp => emp._id === id)?.epl_name || 'Không xác định')
    .join(', ') || 'Chưa có nhân viên'

  return (
    <div className='space-y-6'>
      {
        inforWorkSchedule.ws_status === 'F' && (
          <div className='flex justify-end'>
            <Button onClick={handleEdit}>Chỉnh sửa</Button>
          </div>)
      }
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforWorkSchedule.ws_date
                ? format(new Date(inforWorkSchedule.ws_date), 'dd/MM/yyyy', { locale: vi })
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ca làm việc</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforWorkSchedule.workingShift.wks_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhãn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforWorkSchedule.label.lb_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhân viên</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{employeeNames}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div
                className='prose dark:prose-invert'
                dangerouslySetInnerHTML={{ __html: inforWorkSchedule.ws_note || 'Chưa có ghi chú' }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div >
  )
}