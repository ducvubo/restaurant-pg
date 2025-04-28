'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createTable, updateTable } from '../table.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { ITable } from '../table.interface'

interface Props {
  id: string
  inforTable?: ITable
}
const FormSchema = z.object({
  tbl_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  tbl_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
  tbl_capacity: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập số người' }).min(2, { message: 'Số người phải lớn hơn hoặc bằng 2' }))
})

export default function AddOrEdit({ id, inforTable }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tbl_name: '',
      tbl_description: '',
      tbl_capacity: 2
    }
  })

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforTable) {
        form.setValue('tbl_name', inforTable.tbl_name)
        form.setValue('tbl_description', inforTable.tbl_description)
        form.setValue('tbl_capacity', inforTable.tbl_capacity)
      }
    }
  }, [inforTable, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const res = id === 'add' ? await createTable(data) : await updateTable({ ...data, _id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm bàn mới thành công' : 'Chỉnh sửa thông tin bàn thành công',
        variant: 'default'
      })
      router.push('/dashboard/tables')
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
            name='tbl_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bàn</FormLabel>
                <FormControl>
                  <Input placeholder='Tên bàn...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tbl_capacity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng khách</FormLabel>
                <FormControl>
                  <Input placeholder='Số lượng khách...' type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tbl_description'
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
        <Button type='submit'>{id === 'add' ? 'Thêm bàn mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
