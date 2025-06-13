'use client'
import React from 'react'
import { ICatIngredient } from '../cat-ingredient.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'
interface ViewCatIngredientProps {
  inforCatIngredient: ICatIngredient
}

export default function ViewCatIngredient({ inforCatIngredient }: ViewCatIngredientProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/cat-ingredients/edit?id=${inforCatIngredient.cat_igd_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermissionKey('cat_ingredient_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên danh mục nguyên liệu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforCatIngredient.cat_igd_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforCatIngredient.cat_igd_description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}