'use client'
import React, { useEffect, useState } from 'react'
import { IEmployee } from '../employees.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getPolicyAllName } from '@/app/dashboard/policy/policy.api'
import { IPolicy } from '@/app/dashboard/policy/policy.interface'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface ViewEmployeeProps {
  inforEmployee: IEmployee
}

export default function ViewEmployee({ inforEmployee }: ViewEmployeeProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [policies, setPolicies] = useState<IPolicy[]>([])
  const [policyName, setPolicyName] = useState<string>('')

  const handleEdit = () => {
    router.push(`/dashboard/employees/edit?id=${inforEmployee._id}`)
  }

  const fetchPolicies = async () => {
    const res: IBackendRes<IPolicy[]> = await getPolicyAllName()
    if (res.statusCode === 200 && res.data) {
      setPolicies(res.data)
      const matchedPolicy = res.data.find(policy => policy._id === inforEmployee.epl_policy_id)
      setPolicyName(matchedPolicy ? matchedPolicy.poly_name : 'Không xác định')
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
        description: 'Đã có lỗi xảy ra khi lấy danh sách quyền, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchPolicies()
  }, [])

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermissionKey('employee_list_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Email</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_email}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên nhân viên</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số điện thoại</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_phone}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Địa chỉ</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_address}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giới tính</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_gender}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Quyền chức năng</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{policyName}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Avatar</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEmployee.epl_avatar?.image_cloud ? (
                <div className='relative w-24 h-24'>
                  <Image
                    src={inforEmployee.epl_avatar.image_cloud}
                    alt='Avatar'
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
              ) : (
                'Chưa có avatar'
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}