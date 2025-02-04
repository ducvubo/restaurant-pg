'use client'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
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
import { getAllLabel, getAllWorkingShift } from '../work-schedule.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { SerializedEditorState } from 'lexical'
import { Editor } from '@/components/blocks/editor-00/editor'
interface IProps {
  id: string
  inforWorkSchedule?: IWorkSchedule
}

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Hello World 🚀',
            type: 'text',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1
      }
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1
  }
} as unknown as SerializedEditorState

const FormSchema = z.object({
  lb_id: z.string().nonempty({ message: 'Vui lòng chọn nhãn' }),
  wks_id: z.string().nonempty({ message: 'Vui lòng chọn ca làm việc' }),
  ws_date: z.date({
    required_error: 'Vui lòng chọn ngày'
  }),
  ws_note: z.string().nonempty({ message: 'Vui lòng nhập ghi chú' })
})

export default function AddOrEdit({ id, inforWorkSchedule }: IProps) {
  const { setLoading } = useLoading()
  const [listLabel, setListLabel] = React.useState<ILabel[]>([])
  const [listWorkingShift, setListWorkingShift] = React.useState<IWorkingShift[]>([])
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lb_id: inforWorkSchedule?.lb_id
        ? typeof inforWorkSchedule.lb_id === 'string'
          ? inforWorkSchedule.lb_id
          : ''
        : '',
      wks_id: inforWorkSchedule?.wks_id
        ? typeof inforWorkSchedule.wks_id === 'string'
          ? inforWorkSchedule.wks_id
          : ''
        : '',
      ws_date: inforWorkSchedule?.ws_date || new Date(),
      ws_note: inforWorkSchedule?.ws_note || ''
    }
  })

  useEffect(() => {
    findListLabel()
    findListWorkingShift()
  }, [])

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Thêm</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Thêm lịch làm việc</DialogTitle>
          {/* <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
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

            <Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />

            <Button type='submit'>Thêm</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
