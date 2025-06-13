'use client'
import React, { useEffect, useState } from 'react'
import { IFoodComboRes } from '../food-combos.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getListFood } from '../food-combos.api'
import { IFood } from '../../foods/food.interface'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface ViewFoodComboProps {
  inforFoodCombo: IFoodComboRes
}

export default function ViewFoodCombo({ inforFoodCombo }: ViewFoodComboProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [foodList, setFoodList] = useState<IFood[]>([])

  const handleEdit = () => {
    router.push(`/dashboard/food-combos/edit?id=${inforFoodCombo.fcb_id}`)
  }

  const fetchFoodList = async () => {
    const res: IBackendRes<IFood[]> = await getListFood()
    if (res.statusCode === 200 && res.data) {
      setFoodList(res.data)
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
        description: 'Đã có lỗi xảy ra khi lấy danh sách món ăn, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchFoodList()
  }, [])

  // Map food IDs to food names
  const foodItemsDisplay = inforFoodCombo.food_items.map((item) => {
    const food = foodList.find((f) => f.food_id === item.food_id)
    return {
      name: food ? food.food_name : 'Món không xác định',
      quantity: item.food_quantity
    }
  })

  // Parse fcb_image if it's a stringified JSON
  const image = inforFoodCombo.fcb_image
    ? typeof inforFoodCombo.fcb_image === 'string'
      ? JSON.parse(inforFoodCombo.fcb_image)
      : inforFoodCombo.fcb_image
    : null

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermissionKey('food_combo_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên combo</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFoodCombo.fcb_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh combo</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {image?.image_cloud ? (
                <div className='relative w-24 h-24'>
                  <Image
                    src={image.image_cloud}
                    alt='Combo Image'
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
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFoodCombo.fcb_price.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Thứ tự</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFoodCombo.fcb_sort}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giờ mở bán</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFoodCombo.fcb_open_time || 'Chưa thiết lập'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giờ nghỉ bán</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFoodCombo.fcb_close_time || 'Chưa thiết lập'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforFoodCombo.fcb_note || 'Chưa có ghi chú'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div dangerouslySetInnerHTML={{ __html: inforFoodCombo.fcb_description || 'Chưa có mô tả' }} />
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Danh sách món ăn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {foodItemsDisplay.length > 0 ? (
                <ul className='list-disc pl-5'>
                  {foodItemsDisplay.map((item, index) => (
                    <li key={index}>
                      {item.name} (Số lượng: {item.quantity})
                    </li>
                  ))}
                </ul>
              ) : (
                'Chưa có món ăn nào'
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}