'use client'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { ILeaveApplication } from '../leave-application.interface'
import { createLeaveApplication, updateLeaveApplication } from '../leave-application.api'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

interface Props {
  id: string
  inforLeaveApplication?: ILeaveApplication
}

const FormSchema = z.object({
  leaveType: z.string().nonempty({ message: 'Vui lòng nhập loại đơn nghỉ' }),
  reason: z.string().nonempty({ message: 'Vui lòng nhập lý do nghỉ' }),
  startDate: z.date({
    required_error: 'Vui lòng nhập ngày bắt đầu',
  }),
  endDate: z.date({
    required_error: 'Vui lòng nhập ngày kết thúc',
  }),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    path: ['endDate'],
  }
);

export default function AddOrEdit({ id, inforLeaveApplication }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      leaveType: inforLeaveApplication?.leaveType || '',
      reason: inforLeaveApplication?.reason || '',
      startDate: inforLeaveApplication?.startDate ? new Date(inforLeaveApplication.startDate) : undefined,
      endDate: inforLeaveApplication?.endDate ? new Date(inforLeaveApplication.endDate) : undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload: Partial<ILeaveApplication> = {
      leaveType: data.leaveType,
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
    }
    const res = id === 'add' ? await createLeaveApplication(payload) : await updateLeaveApplication({ ...payload, leaveAppId: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm đơn xin nghỉ việc mới thành công' : 'Chỉnh sửa thông tin đơn xin nghỉ việc thành công',
        variant: 'default'
      })
      router.push('/dashboard/leave-application')
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại đơn</FormLabel>
              <FormControl>
                <Input placeholder="Loại đơn..." {...field}
                  disabled={inforLeaveApplication?.status !== 'DRAFT' && inforRestaurant?._id ? true : false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do</FormLabel>
              <FormControl>
                <Textarea placeholder="Lý do..." {...field}
                  disabled={inforLeaveApplication?.status !== 'DRAFT' && inforRestaurant?._id ? true : false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy', { locale: vi })
                        ) : (
                          <span>Chọn ngày bắt đầu</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={inforLeaveApplication?.status !== 'DRAFT' && inforRestaurant?._id ? true : false}
                      locale={vi}
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày kết thúc</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy', { locale: vi })
                        ) : (
                          <span>Chọn ngày kết thúc</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={vi}
                      initialFocus
                      disabled={inforLeaveApplication?.status !== 'DRAFT' && inforRestaurant?._id ? true : false}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}