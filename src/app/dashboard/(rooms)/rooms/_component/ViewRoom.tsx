'use client'
import React, { useEffect, useState } from 'react'
import { IRoom } from '../rooms.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'
interface ViewRoomProps {
  inforRoom: IRoom
}

export default function ViewRoom({ inforRoom }: ViewRoomProps) {
  const router = useRouter()
  const [images, setImages] = useState<{ image_cloud: string; image_custom: string }[]>([])

  const handleEdit = () => {
    router.push(`/dashboard/rooms/edit?id=${inforRoom.room_id}`)
  }

  useEffect(() => { 
    if (inforRoom.room_images) {
      try {
        const parsedImages = JSON.parse(inforRoom.room_images)
        if (Array.isArray(parsedImages)) {
          setImages(parsedImages.filter(img => img.image_cloud && img.image_custom))
        }
      } catch (error) {
        console.error('Error parsing room_images:', error)
      }
    }
  }, [inforRoom])

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermissionKey('room_update')}>Chỉnh sửa</Button>
      </div>
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Thông tin phòng/sảnh</h3>
        <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
          <tbody>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên phòng/sảnh</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_name}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá cơ bản</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_base_price?.toLocaleString()} VND</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tiền đặt cọc</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_deposit?.toLocaleString()} VND</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số khách tối đa</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_max_guest}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Diện tích</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_area}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Dịch vụ đi kèm</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_fix_ame || 'Chưa có dịch vụ'}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_note || 'Chưa có ghi chú'}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforRoom.room_description || 'Chưa có mô tả'}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh phòng/sảnh</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {images.length > 0 ? (
                  <div className='flex flex-wrap gap-4'>
                    {images.map((img, index) => (
                      <div key={index} className='relative w-28 h-28'>
                        <Image
                          src={img.image_cloud}
                          alt={`Room Image ${index + 1}`}
                          fill
                          className='object-cover rounded-md'
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  'Chưa có ảnh'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}