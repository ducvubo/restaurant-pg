'use client'
import React from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {  createSupplier, updateSupplier } from '../supplier.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISupplier } from '../supplier.interface'

interface Props {
  id: string
  inforSupplier?: ISupplier
}
const FormSchema = z.object({
  spli_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  spli_email: z.string().nonempty({ message: 'Vui lòng nhập email' }).email({ message: 'Email không hợp lệ' }),
  spli_phone: z.string().nonempty({ message: 'Vui lòng nhập số điện thoại' }),
  spli_address: z.string().nonempty({ message: 'Vui lòng nhập địa chỉ' }),
  spli_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
  spli_type: z.enum(['supplier', 'customer'], {
    required_error: 'Vui lòng chọn loại',
  })
})

export default function AddOrEdit({ id, inforSupplier }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spli_name: inforSupplier?.spli_name || '',
      spli_email: inforSupplier?.spli_email || '',
      spli_phone: inforSupplier?.spli_phone || '',
      spli_address: inforSupplier?.spli_address || '',
      spli_description: inforSupplier?.spli_description || '',
      spli_type: inforSupplier?.spli_type || 'supplier'
    }
  })

  const { control, resetField, watch } = form


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      spli_name: data.spli_name,
      spli_email: data.spli_email,
      spli_phone: data.spli_phone,
      spli_address: data.spli_address,
      spli_description: data.spli_description,
      spli_type: data.spli_type
    }

    const res = id === 'add' ? await createSupplier(payload) : await updateSupplier({ ...payload, spli_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm nhà cung cấp mới thành công' : 'Chỉnh sửa thông tin nhà cung cấp thành công',
        variant: 'default'
      })
      router.push('/dashboard/suppliers')
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
          name='spli_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhà cung cấp</FormLabel>
              <FormControl>
                <Input placeholder='Tên nhà cung cấp...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='spli_email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='spli_phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder='Số điện thoại...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='spli_address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input placeholder='Địa chỉ...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='spli_description'
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
          name="spli_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại...." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="supplier">Nhà cung cấp</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button  type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
