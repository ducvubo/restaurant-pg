'use client'
import React, { useEffect, useRef } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createSpecialOffer, updateSpecialOffer } from '../special-offer.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { ISpecialOffer } from '../special-offer.interface'
import { Label } from '@/components/ui/label'
import EditorTiny from '@/components/EditorTiny'

interface Props {
  id: string
  inforSpecialOffer?: ISpecialOffer
}
const FormSchema = z.object({
  spo_title: z.string().nonempty({ message: 'Vui lòng nhập tiêu đề' })
})

export default function AddOrEdit({ id, inforSpecialOffer }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const refContent = useRef<any>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spo_title: inforSpecialOffer?.spo_title || ''
    }
  })

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforSpecialOffer) {
        refContent.current = inforSpecialOffer.spo_description
      }
    }
  }, [inforSpecialOffer, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      spo_title: data.spo_title,
      spo_description: refContent.current.getContent()
    }

    const res = id === 'add' ? await createSpecialOffer(payload) : await updateSpecialOffer({ ...payload, spo_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm ưu đãi mới thành công' : 'Chỉnh sửa thông tin ưu đãi thành công',
        variant: 'default'
      })
      router.push('/dashboard/special-offers')
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
        <FormField
          control={form.control}
          name='spo_title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên ưu đãi</FormLabel>
              <FormControl>
                <Input placeholder='Tên ưu đãi...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex justify-between items-end'>
            <Label>Giới thiệu</Label>
          </div>
          <EditorTiny editorRef={refContent} height='500px' />
        </div>

        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
