'use client'
import React from 'react'
import { IFood } from '../food.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ViewFoodProps {
  inforFood: IFood
}

export default function ViewFood({ inforFood }: ViewFoodProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/foods/edit?id=${inforFood.food_id}`)
  }

  // Parse food_image if it's a stringified JSON
  const images = inforFood.food_image
    ? typeof inforFood.food_image === 'string'
      ? JSON.parse(inforFood.food_image)
      : inforFood.food_image
    : []

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên món ăn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFood.food_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh món ăn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {images.length > 0 ? (
                <div className='flex flex-wrap gap-4'>
                  {images.map((image: { image_cloud: string }, index: number) => (
                    <div key={index} className='relative w-24 h-24'>
                      <Image
                        src={image.image_cloud}
                        alt={`Food Image ${index + 1}`}
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
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFood.food_price.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Thứ tự</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFood.food_sort}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giờ mở bán</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFood.food_open_time || 'Chưa thiết lập'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giờ nghỉ bán</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFood.food_close_time || 'Chưa thiết lập'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFood.food_note || 'Chưa có ghi chú'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div dangerouslySetInnerHTML={{ __html: inforFood.food_description || 'Chưa có mô tả' }} />
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Lựa chọn món ăn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforFood.food_options && inforFood.food_options.length > 0 ? (
                <ul className='list-disc pl-5'>
                  {inforFood.food_options.map((option, index) => (
                    <li key={index} className='mb-2'>
                      <div className='flex items-center gap-4'>
                        {option.fopt_image && (
                          <div className='relative w-16 h-16'>
                            <Image
                              src={JSON.parse(option.fopt_image).image_cloud}
                              alt={`Option Image ${index + 1}`}
                              fill
                              className='object-cover rounded-md'
                            />
                          </div>
                        )}
                        <div>
                          <strong>Tên:</strong> {option.fopt_name} <br />
                          <strong>Thuộc tính:</strong> {option.fopt_attribute} <br />
                          <strong>Giá thêm:</strong> {option.fopt_price.toLocaleString()} VND <br />
                          <strong>Ghi chú:</strong> {option.fopt_note} <br />
                          <strong>Trạng thái:</strong> {option.fopt_status === 'enable' ? 'Đang bán' : 'Ngưng bán'} <br />
                          <strong>Trạng thái bán:</strong>{' '}
                          {option.fopt_state === 'inStock'
                            ? 'Còn hàng'
                            : option.fopt_state === 'soldOut'
                              ? 'Hết hàng'
                              : 'Sắp hết hàng'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                'Chưa có lựa chọn nào'
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}