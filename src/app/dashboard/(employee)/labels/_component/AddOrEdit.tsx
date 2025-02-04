'use client'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createLabel, updateLabel } from '../label.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { ILabel } from '../label.interface'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'
import { Label } from '@/components/ui/label'

interface Props {
  id: string
  inforLabel?: ILabel
}
const FormSchema = z.object({
  lb_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' })
})

export default function AddOrEdit({ id, inforLabel }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [color, setColor] = useState(inforLabel?.lb_color || '#ccc')
  const [name, setName] = useState(inforLabel?.lb_name || '')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lb_description: inforLabel?.lb_description || ''
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    //check trống name và color
    if (!name) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng nhập tên nhãn',
        variant: 'destructive'
      })
      return
    }
    if (!color) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng chọn màu cho nhãn',
        variant: 'destructive'
      })
      return
    }
    setLoading(true)

    const payload = {
      lb_description: data.lb_description,
      lb_color: color,
      lb_name: name
    }

    const res = id === 'add' ? await createLabel(payload) : await updateLabel({ ...payload, lb_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm nhãn mới thành công' : 'Chỉnh sửa thông tin nhãn thành công',
        variant: 'default'
      })
      router.push('/dashboard/labels')
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <div className='w-full'>
          <Label>Tên nhãn</Label>
          <Input
            placeholder='Tên nhãn...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            name='lb_name'
            className='!w-full'
            required
          />
        </div>
        <FormField
          control={form.control}
          name='lb_description'
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
        <div
          className='w-20  h-6 rounded-md text-sm flex justify-center items-center'
          style={{ backgroundColor: color }}
        >
          <span>{name}</span>
        </div>
        <div className='w-full'>
          <Label>Chọn màu</Label>
          <HexColorPicker className='!w-full' color={color} onChange={setColor} />
        </div>

        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
