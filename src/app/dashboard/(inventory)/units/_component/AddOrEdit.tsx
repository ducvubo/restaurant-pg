'use client'
import React from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createUnit, updateUnit } from '../unit.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IUnit } from '../unit.interface'

interface Props {
  id: string
  inforUnit?: IUnit
}
const FormSchema = z.object({
  unt_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  unt_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
  unt_symbol: z.string().nonempty({ message: 'Vui lòng nhập ký hiệu' })
})

export default function AddOrEdit({ id, inforUnit }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      unt_name: inforUnit?.unt_name || '',
      unt_description: inforUnit?.unt_description || '',
      unt_symbol: inforUnit?.unt_symbol || ''
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      unt_name: data.unt_name,
      unt_description: data.unt_description,
      unt_symbol: data.unt_symbol
    }

    const res = id === 'add' ? await createUnit(payload) : await updateUnit({ ...payload, unt_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm đơn vị đo mới thành công' : 'Chỉnh sửa thông tin đơn vị đo thành công',
        variant: 'default'
      })
      router.push('/dashboard/units')
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name='unt_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đơn vị đo</FormLabel>
                <FormControl>
                  <Input placeholder='Tên đơn vị đo...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='unt_symbol'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ký hiệu</FormLabel>
                <FormControl>
                  <Input placeholder='Ký hiệu...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='unt_description'
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
        </div>
        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
