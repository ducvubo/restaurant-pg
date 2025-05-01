'use client'
import React, { useEffect, useRef } from 'react'
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
import { IOperationManual } from '../operation-manual.interface'
import { createOperationManual, updateOperationManual } from '../operation-manual.api'
import { Label } from '@/components/ui/label'
import EditorTiny from '@/components/EditorTiny'

interface Props {
  id: string
  inforOperationManual?: IOperationManual
}
const FormSchema = z.object({
  opera_manual_title: z.string().nonempty({ message: 'Vui lòng nhâp tiêu đề' }),
  opera_manual_type: z.string().nonempty({ message: 'Vui lòng nhập loại tài liệu' }),
  opera_manual_note: z.string().optional(),

})

export default function AddOrEdit({ id, inforOperationManual }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const refContent = useRef<any>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      opera_manual_title: inforOperationManual?.opera_manual_title || '',
      opera_manual_type: inforOperationManual?.opera_manual_type || '',
      opera_manual_note: inforOperationManual?.opera_manual_note || ''
    }
  })

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforOperationManual) {
        if (inforOperationManual.opera_manual_content) {
          refContent.current = inforOperationManual.opera_manual_content
        }
      }
    }
  }, [inforOperationManual, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("🚀 ~ onSubmit ~ data:", data)
    setLoading(true)

    const payload = {
      opera_manual_title: data.opera_manual_title,
      opera_manual_content: refContent.current.getContent(),
      opera_manual_type: data.opera_manual_type,
      opera_manual_note: data.opera_manual_note,
    }

    const res = id === 'add' ? await createOperationManual(payload) : await updateOperationManual({ ...payload, opera_manual_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm tài liệu vẫn hành mới thành công' : 'Chỉnh sửa thông tin tài liệu vẫn hành thành công',
        variant: 'default'
      })
      router.push('/dashboard/operation-manual')
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
            name='opera_manual_title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề tài liệu vẫn hành</FormLabel>
                <FormControl>
                  <Input placeholder='Tiêu đề tài liệu vẫn hành...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='opera_manual_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại tài liệu</FormLabel>
                <FormControl>
                  <Input placeholder='Loại tài liệu...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='opera_manual_note'
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

          {/* <FormField
            control={form.control}
            name='opera_manual_content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea placeholder='Nội dung...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

        </div>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex justify-between items-end'>
            <Label>Nội dung</Label>
          </div>
          <EditorTiny editorRef={refContent} height='500px' />
        </div>
        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
