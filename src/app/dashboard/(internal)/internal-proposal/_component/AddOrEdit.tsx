'use client'
import React from 'react'
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
import { IInternalProposal } from '../internal-proposal.interface'
import { createInternalProposal, updateInternalProposal } from '../internal-proposal.api'

interface Props {
  id: string
  inforInternalProposal?: IInternalProposal
}
const FormSchema = z.object({
  itn_proposal_title: z.string().nonempty({ message: 'Vui lòng nhâp tiêu đề đề xuất' }),
  itn_proposal_content: z.string().nonempty({ message: 'Vui lòng nhập nội dung' }),
  itn_proposal_type: z.string().nonempty({ message: 'Vui lòng nhập loại đề xuất' }),
})

export default function AddOrEdit({ id, inforInternalProposal }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itn_proposal_title: inforInternalProposal?.itn_proposal_title || '',
      itn_proposal_content: inforInternalProposal?.itn_proposal_content || '',
      itn_proposal_type: inforInternalProposal?.itn_proposal_type || ''
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      itn_proposal_title: data.itn_proposal_title,
      itn_proposal_content: data.itn_proposal_content,
      itn_proposal_type: data.itn_proposal_type
    }

    const res = id === 'add' ? await createInternalProposal(payload) : await updateInternalProposal({ ...payload, itn_proposal_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm đề xuất nội bộ mới thành công' : 'Chỉnh sửa thông tin đề xuất nội bộ thành công',
        variant: 'default'
      })
      router.push('/dashboard/internal-proposal')
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
            name='itn_proposal_title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề đề xuất nội bộ</FormLabel>
                <FormControl>
                  <Input placeholder='Tiêu đề đề xuất nội bộ...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='itn_proposal_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại ghi chú</FormLabel>
                <FormControl>
                  <Input placeholder='Loại ghi chú...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='itn_proposal_content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea placeholder='Nội dung...' {...field} />
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
