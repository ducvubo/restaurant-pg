'use client'
import React from 'react'
import { ICategory } from '../category-blog.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewCategoryProps {
  inforCategory: ICategory
}

export default function ViewCategory({ inforCategory }: ViewCategoryProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/category-blog/edit?id=${inforCategory.catId}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên danh mục</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforCategory.catName}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforCategory.catDescription}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số thứ tự</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforCategory.catOrder}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}