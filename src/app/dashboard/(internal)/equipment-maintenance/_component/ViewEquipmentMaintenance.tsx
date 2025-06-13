'use client'
import React, { useEffect, useState } from 'react'
import { IEquipmentMaintenance } from '../equipment-maintenance.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { IEmployee } from '@/app/dashboard/(employee)/employees/employees.interface'
import { findEmployeeName } from '@/app/dashboard/(inventory)/stock-in/stock-in.api'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { usePermission } from '@/app/auth/PermissionContext'

interface ViewEquipmentMaintenanceProps {
  inforEquipmentMaintenance: IEquipmentMaintenance
}

export default function ViewEquipmentMaintenance({ inforEquipmentMaintenance }: ViewEquipmentMaintenanceProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const { hasPermission } = usePermission()
  const handleEdit = () => {
    router.push(`/dashboard/equipment-maintenance/edit?id=${inforEquipmentMaintenance.eqp_mtn_id}`)
  }

  const fetchEmployees = async () => {
    const res: IBackendRes<IEmployee[]> = await findEmployeeName()
    if (res.statusCode === 200 && res.data) {
      setEmployees(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
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

  // Get employee name for reported_by
  const reportedByName = employees.find(emp => emp._id === inforEquipmentMaintenance.eqp_mtn_reported_by)?.epl_name || 'Không xác định'

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('equipment_maintenance_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên thiết bị</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEquipmentMaintenance.eqp_mtn_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Chi phí sửa chữa</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEquipmentMaintenance.eqp_mtn_cost.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày báo cáo</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEquipmentMaintenance.eqp_mtn_date_reported
                ? new Date(inforEquipmentMaintenance.eqp_mtn_date_reported).toLocaleDateString('vi-VN')
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày sửa chữa</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEquipmentMaintenance.eqp_mtn_date_fixed
                ? new Date(inforEquipmentMaintenance.eqp_mtn_date_fixed).toLocaleDateString('vi-VN')
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả sự cố</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEquipmentMaintenance.eqp_mtn_issue_description || 'Chưa có mô tả'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEquipmentMaintenance.eqp_mtn_note || 'Chưa có ghi chú'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Vị trí thiết bị</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEquipmentMaintenance.eqp_mtn_location || 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Người báo cáo</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{reportedByName}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Người sửa chữa</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEquipmentMaintenance.eqp_mtn_performed_by || 'Chưa thiết lập'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}