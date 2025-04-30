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
import { IEquipmentMaintenance } from '../equipment-maintenance.interface'
import { createEquipmentMaintenance, updateEquipmentMaintenance } from '../equipment-maintenance.api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { IEmployee } from '@/app/dashboard/(employee)/employees/employees.interface'
import { findEmployeeName } from '@/app/dashboard/(inventory)/stock-in/stock-in.api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  id: string
  inforInternalProposal?: IEquipmentMaintenance
}
const FormSchema = z.object({
  eqp_mtn_name: z.string().nonempty({ message: 'Vui lòng nhập tên thiết bị' }),
  eqp_mtn_cost: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập chi phí' }).min(0, { message: 'Chi phí phải lớn hơn hoặc bằng 1' })),
  eqp_mtn_date_reported: z.date({
    required_error: "Ngày sửa chữa không được để trống",
  }),
  eqp_mtn_date_fixed: z.date().optional(),
  eqp_mtn_issue_description: z.string().optional(),
  eqp_mtn_note: z.string().optional(),
  eqp_mtn_location: z.string().optional(),
  eqp_mtn_reported_by: z.string().nonempty({ message: 'Vui lòng chọn người báo cáo' }),
  eqp_mtn_performed_by: z.string().optional(),
})

export default function AddOrEdit({ id, inforInternalProposal }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [listEmployees, setListEmployees] = useState<IEmployee[]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      eqp_mtn_name: inforInternalProposal?.eqp_mtn_name || '',
      eqp_mtn_cost: inforInternalProposal?.eqp_mtn_cost || 0,
      eqp_mtn_date_fixed: inforInternalProposal?.eqp_mtn_date_fixed ? new Date(inforInternalProposal.eqp_mtn_date_fixed) : undefined,
      eqp_mtn_date_reported: inforInternalProposal?.eqp_mtn_date_reported ? new Date(inforInternalProposal.eqp_mtn_date_reported) : undefined,
      eqp_mtn_issue_description: inforInternalProposal?.eqp_mtn_issue_description || '',
      eqp_mtn_note: inforInternalProposal?.eqp_mtn_note || '',
      eqp_mtn_location: inforInternalProposal?.eqp_mtn_location || '',
      eqp_mtn_reported_by: inforInternalProposal?.eqp_mtn_reported_by || '',
      eqp_mtn_performed_by: inforInternalProposal?.eqp_mtn_performed_by || ''
    }
  })

  useEffect(() => {
    findAllEmployees()
  }, [])
  const findAllEmployees = async () => {
    const res: IBackendRes<IEmployee[]> = await findEmployeeName()
    if (res.statusCode === 200 && res.data) {
      setListEmployees(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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
      eqp_mtn_name: data.eqp_mtn_name,
      eqp_mtn_cost: data.eqp_mtn_cost,
      eqp_mtn_date_fixed: data.eqp_mtn_date_fixed ? formatDate(data.eqp_mtn_date_fixed) : null,
      eqp_mtn_date_reported: formatDate(data.eqp_mtn_date_reported),
      eqp_mtn_issue_description: data.eqp_mtn_issue_description,
      eqp_mtn_note: data.eqp_mtn_note,
      eqp_mtn_location: data.eqp_mtn_location,
      eqp_mtn_reported_by: data.eqp_mtn_reported_by,
      eqp_mtn_performed_by: data.eqp_mtn_performed_by
    }

    const res = id === 'add' ? await createEquipmentMaintenance(payload) : await updateEquipmentMaintenance({ ...payload, eqp_mtn_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm đề xuất nội bộ mới thành công' : 'Chỉnh sửa thông tin đề xuất nội bộ thành công',
        variant: 'default'
      })
      router.push('/dashboard/equipment-maintenance')
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
            name='eqp_mtn_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên thiết bị</FormLabel>
                <FormControl>
                  <Input placeholder='Tên thiết bị...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='eqp_mtn_cost'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi phí sửa chữa</FormLabel>
                <FormControl>
                  <Input placeholder='Chi phí sửa chữa...' type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eqp_mtn_date_reported"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Ngày báo cáo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày báo cáo</span>}
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
            name="eqp_mtn_date_fixed"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Ngày sửa chữa</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày sửa chữa</span>}
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
            name='eqp_mtn_issue_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả sự cố</FormLabel>
                <FormControl>
                  <Textarea placeholder='Mô tả sự cố...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='eqp_mtn_note'
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
            name='eqp_mtn_location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vị trí thiết bị</FormLabel>
                <FormControl>
                  <Input placeholder='Vị trí thiết bị...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eqp_mtn_reported_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người báo cáo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người báo cáo..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listEmployees.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.epl_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='eqp_mtn_performed_by'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người sửa chữa</FormLabel>
                <FormControl>
                  <Input placeholder='Người sửa chữa...' {...field} />
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
