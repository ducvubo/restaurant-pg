'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createMenuItems, updateMenuItems } from '../menu-items.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IMenuItems } from '../menu-items.interface'
import { ImageUrl } from '@/app/dashboard/(food)/foods/_component/AddOrEdit'
import { Loader2, UploadIcon } from 'lucide-react'
import Image from 'next/image'

interface Props {
  id: string
  inforMenuItems?: IMenuItems
}
const FormSchema = z.object({
  mitems_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  mitems_price: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập giá tiền' }).min(1, { message: 'Số tiền phải dương' })),
  mitems_note: z.string().optional(),
  mitems_description: z.string().optional(),
  mitems_image: z.string().optional()
})

export default function AddOrEdit({ id, inforMenuItems }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mitems_name: inforMenuItems?.mitems_name || '',
      mitems_description: inforMenuItems?.mitems_description || '',
      mitems_price: inforMenuItems?.mitems_price || 0,
      mitems_note: inforMenuItems?.mitems_note || '',
    }
  })

  const [uploadedUrlsItemsImage, setUploadedUrlsItemsImage] = useState<{
    image_cloud: string
    image_custom: string
  }>({
    image_cloud: '',
    image_custom: ''
  })
  const [isUploadingItemsImage, setIsUploadingItemsImage] = useState(false)
  const fileInputItemsImageRef = useRef<HTMLInputElement | null>(null)

  const uploadImage = async (file: File, type: string) => {
    const formData = new FormData()
    formData.append('file', file)

    const res: IBackendRes<ImageUrl> = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`, {
        method: 'POST',
        headers: {
          folder_type: type
        },
        body: formData
      })
    ).json()

    return res
  }

  const handleFileChangeItemsImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingItemsImage(true)

      if (files.length > 1) {
        toast({
          title: 'Thất bại',
          description: 'Chỉ được chọn 1 ảnh!',
          variant: 'destructive'
        })
        setIsUploadingItemsImage(false)
        return
      }
      const res: IBackendRes<ImageUrl> = await uploadImage(files[0], 'items_image')
      if (res.statusCode === 201 && res.data) {
        setIsUploadingItemsImage(false)
        setUploadedUrlsItemsImage(res.data)
      } else {
        setIsUploadingItemsImage(false)
        toast({
          title: 'Thất bại',
          description: 'Upload ảnh thất bại!',
          variant: 'destructive'
        })
      }
    }
  }

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforMenuItems) {
        if (inforMenuItems.mitems_image) {
          setUploadedUrlsItemsImage(JSON.parse(inforMenuItems.mitems_image))
        }
      }
    }
  }, [inforMenuItems, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      mitems_image: JSON.stringify(uploadedUrlsItemsImage),
      mitems_name: data.mitems_name,
      mitems_description: data.mitems_description,
      mitems_price: data.mitems_price,
      mitems_note: data.mitems_note,
    }

    const res = id === 'add' ? await createMenuItems(payload) : await updateMenuItems({ ...payload, mitems_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm thực đơn mới thành công' : 'Chỉnh sửa thông tin thực đơn thành công',
        variant: 'default'
      })
      router.push('/dashboard/menu-items')
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
        <div>
          <h1 className='-mb-3'>Ảnh món ăn</h1>
          <div className='flex gap-2'>
            <div
              onClick={() => {
                if (fileInputItemsImageRef.current) {
                  fileInputItemsImageRef.current.click()
                }
              }}
              className='mt-4 relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 focus-within:outline-2 focus-within:outline-dashed focus-within:outline-gray-500 dark:focus-within:outline-gray-400'
            >
              <div className='text-center'>
                {isUploadingItemsImage ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
                )}
                <Input
                  ref={fileInputItemsImageRef}
                  id='uploadItemsImage'
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleFileChangeItemsImage}
                  disabled={isUploadingItemsImage}
                  className='sr-only'
                />
              </div>
            </div>
            {uploadedUrlsItemsImage?.image_cloud && (
              <div className='relative mt-4 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'>
                <Image
                  src={uploadedUrlsItemsImage.image_cloud}
                  alt='Uploaded Image'
                  fill
                  className='object-cover rounded-md'
                />
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name='mitems_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục thực đơn</FormLabel>
              <FormControl>
                <Input placeholder='Tên danh mục thực đơn...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='mitems_price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá tiền</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Giá tiền...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='mitems_note'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Input placeholder='Ghi chú...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='mitems_description'
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
        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
