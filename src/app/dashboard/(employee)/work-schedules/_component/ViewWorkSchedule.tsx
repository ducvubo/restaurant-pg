'use client'
import React, { useEffect, useState } from 'react'
import { ITimeSheet, IWorkSchedule } from '../work-schedule.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { IEmployee } from '../../employees/employees.interface'
import { getAllEmployee, getTimeSheetByWorkSchedule } from '../work-schedule.api'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface ViewWorkScheduleProps {
  inforWorkSchedule: IWorkSchedule
}

export default function ViewWorkSchedule({ inforWorkSchedule }: ViewWorkScheduleProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [timesSheet, setTimeSheet] = useState<ITimeSheet[]>([])

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
      setTimeSheet(res.data)
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
        description: 'Đã có lỗi xảy ra khi lấy danh sách chấm công, vui lòng thử lại sau',
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
      {inforWorkSchedule.ws_status === 'F' && (
        <div className='flex justify-end'>
          <Button onClick={handleEdit} disabled={!hasPermissionKey('work_schedule_list_update')}>Chỉnh sửa</Button>
        </div>
      )}
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày</td>
            <td className='border border-gray-300 dark:border-gray-200 p-2'>
              {inforWorkSchedule.ws_date
                ? format(new Date(inforWorkSchedule.ws_date), 'dd/MM/yyyy', { locale: vi })
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ca làm việc</td>
            <td className='border border-gray-300 dark:border-gray-200 p-2'>{inforWorkSchedule.workingShift.wks_name}
              ({
                inforWorkSchedule.workingShift.wks_start_time} - {inforWorkSchedule.workingShift.wks_end_time
              })
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhãn</td>
            <td className='border border-gray-300 dark:border-gray-200 p-2'>
              <span
                className="text-white text-sm font-medium px-3 py-1 rounded-full inline-block"
                style={{
                  backgroundColor: inforWorkSchedule.label.lb_color
                }}
              >
                {inforWorkSchedule.label.lb_name}
              </span>
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhân viên</td>
            <td className='border border-gray-300 dark:border-gray-200 p-2'>{employeeNames}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-200 p-2'>
              <div
                className='prose dark:prose-invert'
                dangerouslySetInnerHTML={{ __html: inforWorkSchedule.ws_note || 'Chưa có ghi chú' }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Danh sách chấm công</h2>
        {timesSheet.length > 0 ? (
          <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
            <thead>
              <tr className='bg-gray-100 dark:bg-gray-800'>
                <th className='border border-gray-300 dark:border-gray-700 p-2 text-left'>Nhân viên</th>
                <th className='border border-gray-300 dark:border-gray-700 p-2 text-left'>Check-in</th>
                <th className='border border-gray-300 dark:border-gray-700 p-2 text-left'>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {timesSheet.map((ts) => {
                const employee = employees.find(emp => emp._id === ts.tsEmployeeId)
                return (
                  <tr key={ts.tsId}>
                    <td className='border border-gray-300 dark:border-gray-200 p-2'>
                      {employee?.epl_name || 'Không xác định'}
                    </td>
                    <td className='border border-gray-300 dark:border-gray-200 p-2'>
                      {ts.tsCheckIn
                        ? format(new Date(ts.tsCheckIn), 'dd/MM/yyyy HH:mm', { locale: vi })
                        : 'Chưa check-in'}
                    </td>
                    <td className='border border-gray-300 dark:border-gray-200 p-2'>
                      {ts.tsCheckOut
                        ? format(new Date(ts.tsCheckOut), 'dd/MM/yyyy HH:mm', { locale: vi })
                        : 'Chưa check-out'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>Chưa có dữ liệu chấm công</p>
        )}
      </div>
    </div>
  )
}