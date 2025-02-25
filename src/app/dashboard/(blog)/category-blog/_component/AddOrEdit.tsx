'use client'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createCategory, updateCategory } from '../category-blog.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import {  ICategory } from '../category-blog.interface'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'
import { Label } from '@/components/ui/label'

interface Props {
  id: string
  inforCategory?: ICategory
}
const FormSchema = z.object({
  catName: z.string().nonempty({ message: 'Vui lòng nhập tên danh mục' }),
  catDescription: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
  catOrder:  z.preprocess((value) => {
      if (typeof value === 'string' && value.trim() === '') {
        return undefined
      }
      return Number(value)
    }, z.number({ message: 'Vui lòng nhập số thứ tự' }).min(1, { message: 'Số thứ tự phải dương' })),
})

export default function AddOrEdit({ id, inforCategory }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      catDescription: inforCategory?.catDescription || '',
      catName: inforCategory?.catName || '',
      catOrder: inforCategory?.catOrder || 0
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      catDescription: data.catDescription,
      catName: data.catName,
      catOrder: data.catOrder
    }

    const res = id === 'add' ? await createCategory(payload) : await updateCategory({ ...payload, catId: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm danh mục mới thành công' : 'Chỉnh sửa thông tin danh mục thành công',
        variant: 'default'
      })
      router.push('/dashboard/category-blog')
      router.refresh()
    } else if (res.statusCode === 400) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
            variant: 'destructive'
          })
        })
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive'
        })
      }
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)

      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
    
      <FormField
          control={form.control}
          name='catName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input placeholder='Tên danh mục...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='catDescription'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder='Mô tả...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    

        <FormField
          control={form.control}
          name='catOrder'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số thứ tự</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Số thứ tự...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
   

        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
