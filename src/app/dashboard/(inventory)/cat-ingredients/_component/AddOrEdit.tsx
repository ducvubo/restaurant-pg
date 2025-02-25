'use client'
import React from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {  createCatIngredient, updateCatIngredient } from '../cat-ingredient.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { ICatIngredient } from '../cat-ingredient.interface'

interface Props {
  id: string
  inforCatIngredient?: ICatIngredient
}
const FormSchema = z.object({
  cat_igd_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  cat_igd_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
})

export default function AddOrEdit({ id, inforCatIngredient }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cat_igd_name: inforCatIngredient?.cat_igd_name || '',
      cat_igd_description: inforCatIngredient?.cat_igd_description || '',
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      cat_igd_name: data.cat_igd_name,
      cat_igd_description: data.cat_igd_description,
    }

    const res = id === 'add' ? await createCatIngredient(payload) : await updateCatIngredient({ ...payload, cat_igd_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm danh mục nguyên liệu mới thành công' : 'Chỉnh sửa thông tin danh mục nguyên liệu thành công',
        variant: 'default'
      })
      router.push('/dashboard/cat-ingredients')
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
          name='cat_igd_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục nguyên liệu</FormLabel>
              <FormControl>
                <Input placeholder='Tên danh mục nguyên liệu...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='cat_igd_description'
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

        <Button  type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
