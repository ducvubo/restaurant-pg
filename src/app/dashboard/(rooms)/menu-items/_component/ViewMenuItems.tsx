'use client'
import React, { useEffect, useState } from 'react'
import { IMenuItems } from '../menu-items.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { usePermission } from '@/app/auth/PermissionContext'
interface ViewMenuItemsProps {
  inforMenuItems: IMenuItems
}

export default function ViewMenuItems({ inforMenuItems }: ViewMenuItemsProps) {
  const { hasPermission } = usePermission()
  const router = useRouter()
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string } | null>(null)

  const handleEdit = () => {
    router.push(`/dashboard/menu-items/edit?id=${inforMenuItems.mitems_id}`)
  }

  useEffect(() => {
    if (inforMenuItems.mitems_image) {
      try {
        const parsedImage = JSON.parse(inforMenuItems.mitems_image)
        if (parsedImage && parsedImage.image_cloud && parsedImage.image_custom) {
          setImage(parsedImage)
        }
      } catch (error) {
        console.error('Error parsing mitems_image:', error)
      }
    }
  }, [inforMenuItems])

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('menu_items_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên danh mục thực đơn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforMenuItems.mitems_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá tiền</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforMenuItems.mitems_price?.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforMenuItems.mitems_note || 'Chưa có ghi chú'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforMenuItems.mitems_description || 'Chưa có mô tả'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh món ăn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {image && image.image_cloud ? (
                <div className='relative w-28 h-28'>
                  <Image
                    src={image.image_cloud}
                    alt='Menu Item Image'
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
              ) : (
                'Chưa có ảnh'
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}