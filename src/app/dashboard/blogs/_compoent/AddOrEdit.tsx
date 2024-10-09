'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form, FormDescription } from '@/components/ui/form'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { ReloadIcon } from '@radix-ui/react-icons'
import EditorTiny from '@/components/EditorTiny'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { InputTags } from '@/components/InputTag'
import { createBlog, updateBlog } from '../blog.api'
import { IBlog } from '../blog.interface'

interface Props {
  id: string
  inforBlog?: IBlog
}
const FormSchema = z.object({
  blg_title: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  blg_thumbnail: z.string().optional()
})

export default function AddOrEdit({ id, inforBlog }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [file_image, setFile_Image] = useState<File | null>(null)
  const inputRef_Image = useRef<HTMLInputElement | null>(null)
  const previousFileImageRef = useRef<Blob | null>(null)
  const [loading_upload_image, setLoading_upload_image] = useState(false)
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string }>({
    image_cloud: '',
    image_custom: ''
  })
  const refContent = useRef<any>('')
  const [blg_tag, setBlg_Tag] = useState<string[]>([])
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      blg_title: '',
      blg_thumbnail: ''
    }
  })

  const uploadImage = async (formData: FormData, type: string) => {
    setLoading_upload_image(true)
    try {
      const res = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`, {
          method: 'POST',
          headers: {
            folder_type: 'avatar_employees'
          },
          body: formData
        })
      ).json()

      console.log(res)

      if (res.statusCode === 201) {
        setLoading_upload_image(false)

        toast({
          title: 'Thành công',
          description: 'Tải ảnh lên thành công',
          variant: 'default'
        })
        setImage({
          image_cloud: res.data.image_cloud,
          image_custom: res.data.image_custom
        })
        return res.mataData
      }
      if (res.statusCode === 422 || res.statusCode === 400) {
        setLoading_upload_image(false)

        setImage({
          image_cloud: '',
          image_custom: ''
        })

        toast({
          title: 'Thất bại',
          description: 'Chỉ được tải lên ảnh dưới 5 MB và ảnh phải có định dạng jpg, jpeg, png, webp',
          variant: 'destructive'
        })
      } else {
        setLoading_upload_image(false)
        setFile_Image(null)
        toast({
          title: 'Thất bại',
          description: 'Lỗi khi tải ảnh lên, vui lòng thử lại sau ít phút',
          variant: 'default'
        })
      }
    } catch (error) {
      setLoading_upload_image(false)
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const uploadImageThumbnail = async () => {
      const formData_avatar = new FormData()
      formData_avatar.append('file', file_image as Blob)
      try {
        await uploadImage(formData_avatar, 'avatar')
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    if (file_image && file_image !== previousFileImageRef.current) {
      previousFileImageRef.current = file_image
      uploadImageThumbnail()
    }
    if (!file_image && file_image !== previousFileImageRef.current) {
      setImage({
        image_cloud: '',
        image_custom: ''
      })
    }
  }, [file_image])

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforBlog) {
        form.setValue('blg_title', inforBlog.blg_title)

        if (inforBlog.blg_thumbnail) {
          setImage({
            image_cloud: inforBlog.blg_thumbnail.image_cloud,
            image_custom: inforBlog.blg_thumbnail.image_custom
          })
        }

        if (inforBlog.blg_content) {
          refContent.current = inforBlog.blg_content
        }

        setBlg_Tag(inforBlog.blg_tag.map((tag) => (typeof tag === 'string' ? tag : tag.tag_name)))
      }
    }
  }, [inforBlog, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const payload: Omit<IBlog, 'blg_restaurant_id' | '_id' | 'isDeleted' | 'blg_status' | 'blg_verify'> = {
      blg_title: data.blg_title,
      blg_thumbnail: image,
      blg_content: refContent.current.getContent(),
      blg_tag: blg_tag
    }

    let res: IBackendRes<IBlog>

    res = id === 'add' ? await createBlog(payload) : await updateBlog({ ...payload, _id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm blog mới thành công' : 'Chỉnh sửa thông tin blog thành công',
        variant: 'default'
      })
      router.push('/dashboard/blogs')
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
        <div>
          <FormField
            control={form.control}
            name='blg_thumbnail'
            render={({ field }) => (
              <FormItem className='w-20'>
                <FormLabel>Ảnh</FormLabel>
                <FormControl>
                  <>
                    {!file_image && !image.image_cloud && (
                      <label htmlFor='dish_imagae'>
                        <div className='w-28 h-28 border border-dashed justify-center items-center cursor-pointer flex flex-col rounded-full mt-3'>
                          <span>
                            <IoMdCloudUpload />
                          </span>
                          <span className='text-sm text-gray-500'>Chọn ảnh</span>
                        </div>
                      </label>
                    )}

                    <Input
                      className='hidden'
                      id='dish_imagae'
                      disabled={loading_upload_image ? true : false}
                      type='file'
                      accept='image/*'
                      ref={inputRef_Image}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFile_Image(file)
                          field.onChange(`${process.env.NEXT_PUBLIC_URL_CLIENT}/` + file?.name)
                        }
                      }}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(file_image || image.image_cloud) && (
            <div>
              <Image
                src={file_image ? URL.createObjectURL(file_image) : (image.image_cloud as string)}
                alt='preview'
                className='w-auto h-auto object-cover my-3 rounded-lg'
                width={128}
                height={128}
              />
              <Button
                type='button'
                variant={'destructive'}
                size={'sm'}
                onClick={() => {
                  setFile_Image(null)
                  form.setValue('blg_thumbnail', '')
                  if (inputRef_Image.current) {
                    setImage({
                      image_cloud: '',
                      image_custom: ''
                    })
                    inputRef_Image.current.value = ''
                  }
                }}
                disabled={loading_upload_image}
              >
                {loading_upload_image ? (
                  <>
                    <ReloadIcon className='mr-2 h-4 w-4 animate-spin' /> Đang tải ảnh...
                  </>
                ) : (
                  'Xóa hình ảnh'
                )}
              </Button>
            </div>
          )}
        </div>
        <FormField
          control={form.control}
          name='blg_title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề bài viết</FormLabel>
              <FormControl>
                <Textarea placeholder='Tiêu đề bài viết...' {...field} className='w-full' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col gap-2 pb-10'>
          <Label>Tag</Label>
          <InputTags value={blg_tag} onChange={setBlg_Tag} placeholder='Tag...' className='w-full' />
        </div>
        <div className='flex flex-col gap-2 pb-10'>
          <div className='flex justify-between items-end'>
            <Label>Nội dung bài viết</Label>
            <Button type='submit'>{id === 'add' ? 'Thêm blog mới' : 'Chỉnh sửa'}</Button>
          </div>
          <EditorTiny editorRef={refContent} height='500px' className='mb-48' width='1170px' />
        </div>
      </form>
    </Form>
  )
}
