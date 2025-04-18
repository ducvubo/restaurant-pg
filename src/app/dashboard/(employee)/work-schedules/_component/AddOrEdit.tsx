'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IWorkSchedule } from '../work-schedule.interface'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { ILabel } from '../../labels/label.interface'
import { IWorkingShift } from '../../working-shifts/working-shift.interface'
import { createWorkSchedule, getAllEmployee, getAllLabel, getAllWorkingShift, updateWorkSchedule } from '../work-schedule.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { SerializedEditorState } from 'lexical'
// import { Editor } from '@/components/blocks/editor-x/editor'
import { useRouter } from 'next/navigation'
import { MultiSelect } from '@/components/Multipleselect'
import { IEmployee } from '../../employees/employees.interface'
import EditorTiny from '@/components/EditorTiny'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
interface IProps {
  id: string
  inforWorkSchedule?: IWorkSchedule
}

const FormSchema = z.object({
  lb_id: z.string().nonempty({ message: 'Vui lòng chọn nhãn' }),
  wks_id: z.string().nonempty({ message: 'Vui lòng chọn ca làm việc' }),
  ws_date: z.date({
    required_error: 'Vui lòng chọn ngày'
  })
})

export default function AddOrEdit({ id, inforWorkSchedule }: IProps) {
  console.log('🚀 ~ AddOrEdit ~ inforWorkSchedule:', inforWorkSchedule)
  const { setLoading } = useLoading()
  const router = useRouter()
  const [listLabel, setListLabel] = React.useState<ILabel[]>([])
  const [listWorkingShift, setListWorkingShift] = React.useState<IWorkingShift[]>([])
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const refNote = React.useRef<any>('')
  const [listEmployee, setListEmployee] = useState<
    {
      value: string
      label: string
    }[]
  >([])
  const [selectedEmployee, setSelectedEmployee] = useState<string[]>(inforWorkSchedule?.listEmployeeId || [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lb_id: inforWorkSchedule?.label.lb_id
        ? typeof inforWorkSchedule.label.lb_id === 'string'
          ? inforWorkSchedule.label.lb_id
          : ''
        : '',
      wks_id: inforWorkSchedule?.workingShift.wks_id
        ? typeof inforWorkSchedule.workingShift.wks_id === 'string'
          ? inforWorkSchedule.workingShift.wks_id
          : ''
        : '',
      ws_date: inforWorkSchedule?.ws_date || new Date()
    }
  })

  useEffect(() => {
    findListLabel()
    findListWorkingShift()
    findListEmployee()
  }, [])

  useEffect(() => {
    if (inforEmployee._id) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ chủ nhà hàng để biết thêm chi tiết',
        variant: 'destructive'
      })
      router.push('/dashboard/work-schedules')
    }
  }, [inforRestaurant, inforEmployee])

  const findListLabel = async () => {
    const res: IBackendRes<ILabel[]> = await getAllLabel()
    if (res.statusCode === 200 && res.data) {
      setListLabel(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
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

  const findListWorkingShift = async () => {
    const res: IBackendRes<IWorkingShift[]> = await getAllWorkingShift()
    if (res.statusCode === 200 && res.data) {
      setListWorkingShift(res.data)
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

  const findListEmployee = async () => {
    const res: IBackendRes<IEmployee[]> = await getAllEmployee()
    if (res.statusCode === 200 && res.data) {
      const data = res.data.map((item) => ({
        value: item._id,
        label: item.epl_name
      }))
      setListEmployee(data)
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

  useEffect(() => {
    if (inforWorkSchedule?.ws_note) {
      refNote.current = inforWorkSchedule.ws_note
    }
  }, [inforWorkSchedule, id])

  async function onSubmit(data: z.infer<typeof FormSchema>, event: React.FormEvent) {
    event.preventDefault()

    setLoading(true)
    const wsDate = new Date(data.ws_date)
    wsDate.setDate(wsDate.getDate() + 1)

    const payload: Partial<IWorkSchedule> = {
      lb_id: data.lb_id,
      wks_id: data.wks_id,
      ws_date: wsDate,
      ws_note: refNote.current.getContent(),
      listEmployeeId: selectedEmployee
    }

    const res = id === 'add' ? await createWorkSchedule(payload) : await updateWorkSchedule({ ...payload, ws_id: id })
    // const res = await createWorkSchedule(payload)
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description:
          id === 'add' ? 'Thêm lịch làm việc mới thành công' : 'Chỉnh sửa thông tin lịch làm việc thành công',
        variant: 'default'
      })
      router.push('/dashboard/work-schedules')
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
      <form
        onSubmit={(event) => {
          onSubmit(form.getValues(), event)
        }}
        className='w-full space-y-6'
      >
        <FormField
          control={form.control}
          name='wks_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ca làm việc</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn ca làm việc...' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {listWorkingShift.map((workingShift) => (
                    <SelectItem key={workingShift.wks_id} value={workingShift.wks_id}>
                      <Label>{workingShift.wks_name}</Label>
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
          name='lb_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhãn</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn nhãn...' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {listLabel.map((label) => (
                    <SelectItem key={label.lb_id} value={label.lb_id}>
                      <Label>{label.lb_name}</Label>
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
          name='ws_date'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Ngày</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='w-full'>
          <Label>Loại hình nhà hàng</Label>
          <MultiSelect
            options={listEmployee}
            onValueChange={setSelectedEmployee}
            defaultValue={selectedEmployee}
            placeholder='Chọn nhân viên'
            variant='inverted'
            animation={2}
            maxCount={5}
          />
        </div>

        <div className='h-[390px]'>
          <EditorTiny editorRef={refNote} height='390px' />
        </div>

        <Button type='submit' className='!mt-5'>
          {id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}
        </Button>
      </form>
    </Form>
  )
}
