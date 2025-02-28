'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createCategory, updateCategory } from '../category.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { ICategories } from '../category.interface'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { ReloadIcon } from '@radix-ui/react-icons'

interface Props {
  id: string
  inforCategory?: ICategories
}
const FormSchema = z.object({
  cat_res_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  cat_res_short_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
  cat_res_icon: z.string().optional()
})

export default function AddOrEdit({ id, inforCategory }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [selectedEmoji, setSelectedEmoji] = useState<string>(inforCategory?.cat_res_icon || '')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cat_res_name: '',
      cat_res_short_description: '',
      cat_res_icon: ''
    }
  })

  const { control, resetField, watch } = form

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforCategory) {
        form.setValue('cat_res_name', inforCategory.cat_res_name)
        form.setValue('cat_res_short_description', inforCategory.cat_res_short_description)
      }
    }
  }, [inforCategory, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      cat_res_name: data.cat_res_name,
      cat_res_short_description: data.cat_res_short_description,
      cat_res_icon: selectedEmoji
    }

    const res = id === 'add' ? await createCategory(payload) : await updateCategory({ ...payload, _id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm danh mục mới thành công' : 'Chỉnh sửa thông tin danh mục thành công',
        variant: 'default'
      })
      router.push('/dashboard/categories')
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

  const iconList = [
    '🍟',
    '🌭',
    '🍕',
    '🥪',
    '🌮',
    '🌯',
    '🥙',
    '🍝',
    '🍜',
    '🍲',
    '🍛',
    '🥘',
    '🍣',
    '🍤',
    '🥟',
    '🍢',
    '🍥',
    '🥗',
    '🍗',
    '🍖',
    '🥓',
    '🥩',
    '🧁',
    '🍰',
    '🎂',
    '🍩',
    '🍪',
    '🍫',
    '🍬',
    '🍭',
    '🍮',
    '🍯',
    '🍎',
    '🍏',
    '🍐',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🍒',
    '🥭',
    '🍍',
    '🥥',
    '🥔',
    '🥕',
    '🌽',
    '🥦',
    '🥒',
    '🥬',
    '🥑',
    '🥤',
    '☕',
    '🍵',
    '🍶',
    '🍼',
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🥃',
    '🍹',
    '🍸',
    '🍡',
    '🍘',
    '🍙',
    '🥯',
    '🧈',
    '🍳',
    '🫓',
    '🫔',
    '🫕',
    '🧆',
    '🫛',
    '🧄',
    '🧅',
    '🫒',
    '🫚',
    '🥜',
    '🫘',
    '🫙',
    '🫗',
    '🧊',
    '🧃',
    '🧋',
    '🧌',
    '🫖',
    '🥢',
    '🍴',
    '🥄',
    '🥠',
    '🍞',
    '🧇',
    '🍦',
    '🥡',
    '🧉',
    '🍨',
    '🥧',
    '🍧',
    '🍱',
    '🧀',
    '🥮',
    '🍔',
    '🥖',
    '🥐',
    '🍚',
    '🍠',
    '🦪',
    '🍂',
    '🍽️',
    '🫑'
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <div className='flex gap-4'>
          <div>
            <FormLabel>Chọn emoji cho danh mục</FormLabel>
            <div
              className='grid grid-cols-6 gap-4 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow'
              style={{ height: '200px', width: '100%', maxWidth: '400px' }}
            >
              {iconList.map((emoji, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedEmoji(emoji)}
                  className='flex items-center cursor-pointer justify-center text-2xl p-2 rounded hover:bg-gray-200 focus:ring-2 focus:ring-blue-400'
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
          <span className='text-9xl'>{selectedEmoji}</span>
        </div>

        <FormField
          control={form.control}
          name='cat_res_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input placeholder='Tên danh mục...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='cat_res_short_description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu ngắn</FormLabel>
              <FormControl>
                <Textarea placeholder='Giới thiệu ngắn...' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{id === 'add' ? 'Thêm danh mục mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
