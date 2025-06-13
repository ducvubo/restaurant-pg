'use client'
import React from 'react'
import { IPolicy } from '../policy.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { permissions } from '../policy'
import { usePermission } from '@/app/auth/PermissionContext'

interface ViewPolicyProps {
  inforPolicy: IPolicy
}

export default function ViewPolicy({ inforPolicy }: ViewPolicyProps) {
  const { hasPermission } = usePermission()
    const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/policy/edit?id=${inforPolicy._id}`)
  }

  // Map selected permissions for quick lookup
  const selectedKeys = new Set(inforPolicy.poly_key || [])

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('policy_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên quyền chức năng</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforPolicy.poly_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforPolicy.poly_description || 'Chưa có mô tả'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Quyền hạn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div className='space-y-2'>
                {permissions.map((module) => {
                  const moduleHasPermissions = module.functions.some((func) =>
                    func.actions.some((action) => selectedKeys.has(`${func.key}_${action.key}`))
                  )
                  if (!moduleHasPermissions) return null
                  return (
                    <div key={module.key} className='mb-4'>
                      <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200'>{module.name}</h3>
                      <div className='ml-4 space-y-2'>
                        {module.functions.map((func) => {
                          const funcHasPermissions = func.actions.some((action) =>
                            selectedKeys.has(`${func.key}_${action.key}`)
                          )
                          if (!funcHasPermissions) return null
                          return (
                            <div key={func.key} className='ml-4'>
                              <h4 className='font-medium text-gray-700 dark:text-gray-300'>{func.name}</h4>
                              <ul className='ml-6 list-disc'>
                                {func.actions
                                  .filter((action) => selectedKeys.has(`${func.key}_${action.key}`))
                                  .map((action) => (
                                    <li
                                      key={`${func.key}_${action.key}`}
                                      className='text-sm text-gray-600 dark:text-gray-300'
                                    >
                                      {action.method}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {inforPolicy.poly_key?.length === 0 && <p>Chưa có quyền hạn nào được chọn</p>}
              </div>
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Đường dẫn được phép</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforPolicy.poly_path?.length ? (
                <ul className='list-disc pl-5'>
                  {inforPolicy.poly_path.map((path, index) => (
                    <li key={index} className='text-sm text-gray-600 dark:text-gray-300'>
                      {path}
                    </li>
                  ))}
                </ul>
              ) : (
                'Chưa có đường dẫn nào được phép'
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}