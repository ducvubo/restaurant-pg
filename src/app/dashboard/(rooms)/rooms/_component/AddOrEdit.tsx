'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createRoom, updateRoom } from '../rooms.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IRoom } from '../rooms.interface'
import { ImageUrl } from '@/app/dashboard/(food)/foods/_component/AddOrEdit'
import { Loader2, UploadIcon, X } from 'lucide-react'
import Image from 'next/image'

interface Props {
  id: string
  inforRoom?: IRoom
}
const FormSchema = z.object({
  room_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  room_base_price: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập giá tiền' }).min(1, { message: 'Số tiền phải dương' })),
  room_max_guest: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập số khách tối đa' }).min(1, { message: 'Số khách tối đa phải dương' })),
  room_fix_ame: z.string().optional(),
  room_area: z.string().nonempty({ message: 'Vui lòng nhập diện tích' }),
  room_note: z.string().optional(),
  room_description: z.string().optional(),
  room_images: z.string().optional()
})

export default function AddOrEdit({ id, inforRoom }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      room_name: inforRoom?.room_name || '',
      room_base_price: inforRoom?.room_base_price || 0,
      room_note: inforRoom?.room_note || '',
      room_description: inforRoom?.room_description || '',
      room_max_guest: inforRoom?.room_max_guest || 0,
      room_area: inforRoom?.room_area || '',
      room_fix_ame: inforRoom?.room_fix_ame || ''
    }
  })
  const [uploadedUrlsImageRoom, setUploadedUrlsImageRoom] = useState<
    {
      image_cloud: string
      image_custom: string
    }[]
  >([])
  const [isUploadingImageRoom, setIsUploadingImageRoom] = useState(false)
  const fileInputImageRoomRef = useRef<HTMLInputElement | null>(null)

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
    console.log("🚀 ~ uploadImage ~ res:", res)

    return res
  }

  const handleFileChangeImageRoom = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingImageRoom(true)

      const uploadedImages: {
        image_cloud: string
        image_custom: string
      }[] = []
      for (const file of files) {
        try {
          const url = await uploadImage(file, 'food_restaurant')
          if (url.statusCode === 201 && url.data?.image_cloud) {
            uploadedImages.push(url.data)
          } else {
            toast({
              title: 'Thất bại',
              description: 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút',
              variant: 'destructive'
            })
          }
        } catch (error) {
          console.error('Error uploading file:', file.name, error)
        }
      }

      setUploadedUrlsImageRoom((prev) => [...prev, ...uploadedImages])
      setIsUploadingImageRoom(false)
    }
  }

  const handleDeleteImage = (index: number) => {
    setUploadedUrlsImageRoom((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforRoom) {
        if (inforRoom.room_images) {
          setUploadedUrlsImageRoom(JSON.parse(inforRoom.room_images))
        }
      }
    }
  }, [inforRoom, id])
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      room_name: data.room_name,
      room_base_price: data.room_base_price,
      room_note: data.room_note,
      room_description: data.room_description,
      room_max_guest: data.room_max_guest,
      room_area: data.room_area,
      room_fix_ame: data.room_fix_ame,
      room_images: JSON.stringify(uploadedUrlsImageRoom)
    }

    const res = id === 'add' ? await createRoom(payload) : await updateRoom({ ...payload, room_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm dịch vụ mới thành công' : 'Chỉnh sửa thông tin dịch vụ thành công',
        variant: 'default'
      })
      router.push('/dashboard/rooms')
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
          <h1 className='-mb-3'>Ảnh phòng sảnh</h1>
          <div className='flex gap-2'>
            <div
              onClick={() => {
                if (fileInputImageRoomRef.current) {
                  fileInputImageRoomRef.current.click()
                }
              }}
              className='mt-4 relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 focus-within:outline-2 focus-within:outline-dashed focus-within:outline-gray-500 dark:focus-within:outline-gray-400'
            >
              <div className='text-center'>
                {isUploadingImageRoom ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
                )}
                <Input
                  ref={fileInputImageRoomRef}
                  id='uploadImageRoom'
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleFileChangeImageRoom}
                  disabled={isUploadingImageRoom}
                  className='sr-only'
                />
              </div>
            </div>
            {uploadedUrlsImageRoom.length > 0 && (
              <div className='mt-4'>
                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                  {uploadedUrlsImageRoom.map((url, index) => (
                    <li
                      key={index}
                      className='relative w-full h-24 sm:h-32 md:h-36 aspect-square rounded-md border-2 border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                    >
                      <Image
                        src={url.image_cloud}
                        alt={`Uploaded ${index + 1}`}
                        fill
                        className='object-cover rounded-md'
                      />
                      <button
                        type='button'
                        onClick={() => handleDeleteImage(index)}
                        className='absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name='room_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên dịch vụ</FormLabel>
              <FormControl>
                <Input placeholder='Tên dịch vụ...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='room_base_price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá cơ bản</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Giá cơ bản...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='room_max_guest'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số khách tối đa</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Số khách tối đa...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='room_area'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diện tích</FormLabel>
              <FormControl>
                <Input placeholder='Diện tích...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='room_fix_ame'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dịch vụ đi kèm</FormLabel>
              <FormControl>
                <Input placeholder='Dịch vụ đi kèm...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='room_note'
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
          name='room_description'
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
