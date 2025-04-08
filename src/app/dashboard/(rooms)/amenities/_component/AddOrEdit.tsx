'use client'
import React, { useEffect, useRef } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createAmenities, updateAmenities } from '../amenities.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IAmenities } from '../amenities.interface'
import { Label } from '@/components/ui/label'
import EditorTiny from '@/components/EditorTiny'

interface Props {
  id: string
  inforAmenities?: IAmenities
}
const FormSchema = z.object({
  ame_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  ame_price: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập giá tiền' }).min(1, { message: 'Số tiền phải dương' })),
  ame_note: z.string().optional(),
  ame_description: z.string().optional()
})

export default function AddOrEdit({ id, inforAmenities }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ame_name: inforAmenities?.ame_name || '',
      ame_price: inforAmenities?.ame_price || 0,
      ame_note: inforAmenities?.ame_note || '',
      ame_description: inforAmenities?.ame_description || ''
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      ame_name: data.ame_name,
      ame_price: data.ame_price,
      ame_note: data.ame_note,
      ame_description: data.ame_description
    }

    const res = id === 'add' ? await createAmenities(payload) : await updateAmenities({ ...payload, ame_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm dịch vụ mới thành công' : 'Chỉnh sửa thông tin dịch vụ thành công',
        variant: 'default'
      })
      router.push('/dashboard/amenities')
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='ame_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên dịch vụ</FormLabel>
              <FormControl>
                <Input placeholder='Tên dịch vụ...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ame_price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá dịch vụ</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Giá dịch vụ...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ame_note'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder='Ghi chú...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ame_description'
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

        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
