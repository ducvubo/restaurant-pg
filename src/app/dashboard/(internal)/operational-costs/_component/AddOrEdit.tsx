'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IOperationalCosts } from '../operational-costs.interface'
import { createOperationalCosts, updateOperationalCosts } from '../operational-costs.api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { IEmployee } from '@/app/dashboard/(employee)/employees/employees.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  id: string
  inforInternalProposal?: IOperationalCosts
}
const FormSchema = z.object({
  opera_cost_type: z.string().nonempty({ message: 'Vui lòng nhập loại chi phí' }),
  opera_cost_amount: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập chi phí' }).min(0, { message: 'Chi phí phải lớn hơn hoặc bằng 1' })),
  opera_cost_date: z.date({
    required_error: "Ngày phát sinh chi phí không được để trống",
  }),
  opera_cost_description: z.string().optional(),
})

export default function AddOrEdit({ id, inforInternalProposal }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      opera_cost_type: inforInternalProposal?.opera_cost_type || '',
      opera_cost_amount: inforInternalProposal?.opera_cost_amount || 0,
      opera_cost_date: inforInternalProposal?.opera_cost_date ? new Date(inforInternalProposal.opera_cost_date) : undefined,
      opera_cost_description: inforInternalProposal?.opera_cost_description || '',
    }
  })

  function formatDate(dateStr: string | Date | null): string | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const payload: any = {
      opera_cost_type: data.opera_cost_type,
      opera_cost_amount: data.opera_cost_amount,
      opera_cost_date: formatDate(data.opera_cost_date),
      opera_cost_description: data.opera_cost_description,

    }

    const res = id === 'add' ? await createOperationalCosts(payload) : await updateOperationalCosts({ ...payload, opera_cost_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm chi phí vận hành mới thành công' : 'Chỉnh sửa thông tin chi phí vận hành thành công',
        variant: 'default'
      })
      router.push('/dashboard/operational-costs')
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
            name='opera_cost_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại chi phí</FormLabel>
                <FormControl>
                  <Input placeholder='Loại chi phí...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='opera_cost_amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền</FormLabel>
                <FormControl>
                  <Input placeholder='Số tiền...' type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opera_cost_date"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Ngày phát sinh</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày phát sinh</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='opera_cost_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả chi phí</FormLabel>
                <FormControl>
                  <Textarea placeholder='Mô tả chi phí...' {...field} />
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
