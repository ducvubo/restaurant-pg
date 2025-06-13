'use client'
import React from 'react'
import { IDish } from '../dishes.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { usePermission } from '@/app/auth/PermissionContext'

interface ViewDishProps {
  inforDish: IDish
}

export default function ViewDish({ inforDish }: ViewDishProps) {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleEdit = () => {
    router.push(`/dashboard/dishes/edit?id=${inforDish._id}`)
  }

  // Calculate final price if sale is applied
  const finalPrice = inforDish.dish_sale
    ? inforDish.dish_sale.sale_type === 'percentage'
      ? inforDish.dish_price - (inforDish.dish_price * (inforDish.dish_sale.sale_value || 0)) / 100
      : inforDish.dish_price - (inforDish.dish_sale.sale_value || 0)
    : null

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('dish_list_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên món ăn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforDish.dish_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforDish.dish_image?.image_cloud ? (
                <div className='relative w-24 h-24'>
                  <Image
                    src={inforDish.dish_image.image_cloud}
                    alt='Dish Image'
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
              ) : (
                'Chưa có ảnh'
              )}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforDish.dish_price.toLocaleString()} VND</td>
          </tr>
          {inforDish.dish_sale && (
            <>
              <tr>
                <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại khuyến mãi</td>
                <td className='border border-gray-300 dark:border-gray-700 p-2'>
                  {inforDish.dish_sale.sale_type === 'percentage' ? 'Giảm giá theo %' : 'Giảm giá trực tiếp'}
                </td>
              </tr>
              <tr>
                <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá trị khuyến mãi</td>
                <td className='border border-gray-300 dark:border-gray-700 p-2'>
                  {inforDish.dish_sale.sale_value} {inforDish.dish_sale.sale_type === 'percentage' ? '%' : 'VND'}
                </td>
              </tr>
              <tr>
                <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá sau khi giảm</td>
                <td className='border border-gray-300 dark:border-gray-700 p-2'>
                  {finalPrice !== null ? Math.max(finalPrice, 0).toLocaleString() + ' VND' : 'N/A'}
                </td>
              </tr>
            </>
          )}
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả ngắn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforDish.dish_short_description}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div dangerouslySetInnerHTML={{ __html: inforDish.dish_description || 'Chưa có mô tả' }} />
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Điểm ưu tiên</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforDish.dish_priority}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforDish.dish_note || 'Chưa có ghi chú'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}