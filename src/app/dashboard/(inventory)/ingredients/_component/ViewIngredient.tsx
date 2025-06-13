'use client'
import React, { useEffect, useState } from 'react'
import { IIngredient } from '../ingredient.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ICatIngredient } from '../../cat-ingredients/cat-ingredient.interface'
import { IUnit } from '../../units/unit.interface'
import { findAllCategories, findAllUnits } from '../ingredient.api'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'
interface ViewIngredientProps {
  inforIngredient: IIngredient
}

export default function ViewIngredient({ inforIngredient }: ViewIngredientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<ICatIngredient[]>([])
  const [units, setUnits] = useState<IUnit[]>([])
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string } | null>(null)

  const handleEdit = () => {
    router.push(`/dashboard/ingredients/edit?id=${inforIngredient.igd_id}`)
  }

  const fetchCategories = async () => {
    const res: IBackendRes<ICatIngredient[]> = await findAllCategories()
    if (res.statusCode === 200 && res.data) {
      setCategories(res.data)
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
        description: 'Đã có lỗi xảy ra khi lấy danh sách danh mục, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const fetchUnits = async () => {
    const res: IBackendRes<IUnit[]> = await findAllUnits()
    if (res.statusCode === 200 && res.data) {
      setUnits(res.data)
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
        description: 'Đã có lỗi xảy ra khi lấy danh sách đơn vị, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchUnits()
    if (inforIngredient.igd_image) {
      try {
        const parsedImage = JSON.parse(inforIngredient.igd_image)
        if (parsedImage && parsedImage.image_cloud && parsedImage.image_custom) {
          setImage(parsedImage)
        }
      } catch (error) {
        console.error('Error parsing igd_image:', error)
      }
    }
  }, [inforIngredient])

  // Get category and unit names
  const categoryName = categories.find(cat => cat.cat_igd_id === inforIngredient.cat_igd_id)?.cat_igd_name || 'Không xác định'
  const unitName = units.find(unit => unit.unt_id === inforIngredient.unt_id)?.unt_name || 'Không xác định'

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermissionKey('ingredient_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên nguyên liệu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforIngredient.igd_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Danh mục</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{categoryName}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Đơn vị đo</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{unitName}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforIngredient.igd_description}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh nguyên liệu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {image && image.image_cloud ? (
                <div className='relative w-28 h-28'>
                  <Image
                    src={image.image_cloud}
                    alt='Ingredient Image'
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