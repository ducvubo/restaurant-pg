'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createWorkingShift, updateWorkingShift } from '../working-shift.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IWorkingShift } from '../working-shift.interface'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface Props {
  id: string
  inforWorkingShift?: IWorkingShift
}
const FormSchema = z.object({
  wks_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  wks_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' })
})

export default function AddOrEdit({ id, inforWorkingShift }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [wks_start_time, setWks_start_time] = useState<{ hour: number; minute: number }>({
    hour: 0,
    minute: 0
  })
  const [wks_end_time, setWks_end_time] = useState<{
    hour: number
    minute: number
  }>({
    hour: 0,
    minute: 0
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      wks_name: '',
      wks_description: ''
    }
  })

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforWorkingShift) {
        form.setValue('wks_name', inforWorkingShift.wks_name)
        form.setValue('wks_description', inforWorkingShift.wks_description)

        if (inforWorkingShift.wks_start_time) {
          const start_time = inforWorkingShift.wks_start_time.split(':') // Bỏ dấu đóng ngoặc thừa
          setWks_start_time({
            hour: Number(start_time[0]),
            minute: Number(start_time[1])
          })
        }
        if (inforWorkingShift.wks_end_time) {
          const end_time = inforWorkingShift.wks_end_time.split(':') // Bỏ dấu đóng ngoặc thừa
          setWks_end_time({
            hour: Number(end_time[0]),
            minute: Number(end_time[1])
          })
        }
      }
    }
  }, [inforWorkingShift, id])

  const handSelectTime = (type: 'start' | 'close', state: 'hour' | 'minute', value: string) => {
    if (type === 'start') {
      setWks_start_time((prev) => ({ ...prev, [state]: Number(value) }))
    } else {
      setWks_end_time((prev) => ({ ...prev, [state]: Number(value) }))
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    if (wks_start_time.hour > wks_end_time.hour) {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Giờ bắt đầu làm việc phải nhỏ hơn giờ kết thúc làm việc',
        variant: 'destructive'
      })
      return
    }
    if (wks_start_time.hour === wks_end_time.hour && wks_start_time.minute >= wks_end_time.minute) {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Giờ bắt đầu làm việc phải nhỏ hơn giờ kết thúc làm việc',
        variant: 'destructive'
      })
      return
    }

    const payload: Partial<IWorkingShift> = {
      ...data,
      wks_start_time: `${wks_start_time.hour.toString()}:${wks_start_time.minute.toString()}:00`,
      wks_end_time: `${wks_end_time.hour.toString()}:${wks_end_time.minute.toString()}:00`
    }

    const res = id === 'add' ? await createWorkingShift(payload) : await updateWorkingShift({ ...payload, wks_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm ca làm việc mới thành công' : 'Chỉnh sửa thông tin ca làm việc thành công',
        variant: 'default'
      })
      router.push('/dashboard/working-shifts')
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
            name='wks_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên ca làm việc</FormLabel>
                <FormControl>
                  <Input placeholder='Tên ca làm việc...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Popover>
            <PopoverTrigger asChild>
              <div className='flex flex-col mt-2 gap-3'>
                <Label>Giờ bắt đầu / kết thúc</Label>
                <Button type='button' variant={'outline'}>
                  {`${wks_start_time.hour.toString().padStart(2, '0')}:${wks_start_time.minute
                    .toString()
                    .padStart(2, '0')} - ${wks_end_time.hour.toString().padStart(2, '0')}:${wks_end_time.minute
                      .toString()
                      .padStart(2, '0')}`}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className='flex justify-between'>
              <ScrollArea>
                <Label>Giờ bắt đầu</Label>
                <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 24 }, (_, i) => i)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            size='icon'
                            variant={wks_start_time.hour === hour ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('start', 'hour', hour.toString())}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 60 }, (_, i) => i)
                        .reverse()
                        .map((minute) => (
                          <Button
                            key={minute}
                            size='icon'
                            variant={wks_start_time.minute === minute ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('start', 'minute', minute.toString())}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                </div>
              </ScrollArea>
              <ScrollArea>
                <Label>Giờ kết thúc</Label>
                <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 24 }, (_, i) => i)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            size='icon'
                            variant={wks_end_time.hour === hour ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('close', 'hour', hour.toString())}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 60 }, (_, i) => i)
                        .reverse()
                        .map((minute) => (
                          <Button
                            key={minute}
                            size='icon'
                            variant={wks_end_time.minute === minute ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('close', 'minute', minute.toString())}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <FormField
            control={form.control}
            name='wks_description'
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
        <Button type='submit'>{id === 'add' ? 'Thêm ca làm việc mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
