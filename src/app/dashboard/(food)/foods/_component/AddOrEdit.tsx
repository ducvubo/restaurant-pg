'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { ICategories } from '../../categories/category.interface'
import { createFood, getAllCategories, updateFood } from '../food.api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import EditorTiny from '@/components/EditorTiny'
import { Label } from '@/components/ui/label'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { ReloadIcon } from '@radix-ui/react-icons'
import { IFood } from '../food.interface'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import { FaTrash } from 'react-icons/fa6'
import { IoAddCircleSharp } from 'react-icons/io5'
interface Props {
  id: string
  inforFood?: IFood
}

export interface ImageUrl {
  image_custom: string
  image_cloud: string
}

const FormSchema = z.object({
  food_cat_id: z.string().nonempty('Danh mục không được để trống'),
  food_name: z.string().nonempty('Tên món ăn không được để trống'),
  food_price: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập giá tiền' }).min(1, { message: 'Số tiền phải dương' })),
  food_image: z.string().optional(),
  food_note: z.string().nonempty('Ghi chú không được để trống'),
  food_sort: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập số thứ tự' }).min(1, { message: 'Số thứ tự phải dương' })),
  food_options: z.array(
    z.object({
      fopt_name: z.string().nonempty('Tên món ăn không được để trống'),
      fopt_price: z.preprocess((value) => {
        if (typeof value === 'string' && value.trim() === '') {
          return undefined
        }
        return Number(value)
      }, z.number({ message: 'Vui lòng nhập giá tiền' }).min(1, { message: 'Số tiền phải dương' })),
      fopt_attribute: z.string().nonempty('Thuộc tính không được để trống'),
      fopt_image: z.string().nonempty('Ảnh không được để trống'),
      fopt_note: z.string().nonempty('Ghi chú không được để trống'),
      fopt_status: z.enum(['enable', 'disable']),
      fopt_state: z.enum(['soldOut', 'inStock', 'almostOut'])
    })
  )
})

export default function AddOrEdit({ id, inforFood }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [categories, setCategories] = useState<ICategories[]>([])
  const refContent = useRef<any>('')

  const [file_image, setFile_Image] = useState<File | null>(null)
  const inputRef_Image = useRef<HTMLInputElement | null>(null)
  const previousFileImageRef = useRef<Blob | null>(null)
  const [loading_upload_image, setLoading_upload_image] = useState(false)
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string }>({
    image_cloud: '',
    image_custom: ''
  })
  const [food_open_time, setFood_open_time] = useState<{ hour: number; minute: number }>({
    hour: 0,
    minute: 0
  })
  const [food_close_time, setFood_close_time] = useState<{
    hour: number
    minute: number
  }>({
    hour: 0,
    minute: 0
  })

  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      food_cat_id: id !== 'add' ? (inforFood?.food_cat_id as ICategories)._id || '' : '',
      food_name: inforFood?.food_name || '',
      food_price: inforFood?.food_price || 0,
      food_note: inforFood?.food_note || '',
      food_sort: inforFood?.food_sort || 0,
      food_options: inforFood?.food_options || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'food_options'
  })

  const getListCategory = async () => {
    const res: IBackendRes<ICategories[]> = await getAllCategories()

    if (res.statusCode === 200 && res.data) {
      setCategories(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết'
      })
    } else {
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút',
        variant: 'destructive'
      })
    }
  }

  const uploadImage = async (formData: FormData, type: string) => {
    setLoading_upload_image(true)
    try {
      const res = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`, {
          method: 'POST',
          headers: {
            folder_type: type
          },
          body: formData
        })
      ).json()

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
        setFile_Image(null)
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

  const uploadImageOption = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res: IBackendRes<ImageUrl> = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`, {
        method: 'POST',
        headers: {
          folder_type: 'food_options'
        },
        body: formData
      })
    ).json()

    return res
  }

  useEffect(() => {
    const uploadIconCategory = async () => {
      const formData_icon = new FormData()
      formData_icon.append('file', file_image as Blob)
      try {
        await uploadImage(formData_icon, 'icon_res_category')
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    if (file_image && file_image !== previousFileImageRef.current) {
      previousFileImageRef.current = file_image
      uploadIconCategory()
    }
    if (!file_image && file_image !== previousFileImageRef.current) {
      setImage({
        image_cloud: '',
        image_custom: ''
      })
    }
  }, [file_image])

  useEffect(() => {
    getListCategory()
  }, [])

  const handSelectTime = (type: 'open' | 'close', state: 'hour' | 'minute', value: string) => {
    if (type === 'open') {
      setFood_open_time((prev) => ({ ...prev, [state]: Number(value) }))
    } else {
      setFood_close_time((prev) => ({ ...prev, [state]: Number(value) }))
    }
  }

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforFood) {
        // form.setValue('food_name', inforFood.food_name)
        // form.setValue(
        //   'food_cat_id',
        //   typeof inforFood.food_cat_id === 'object' && inforFood.food_cat_id !== null ? inforFood.food_cat_id._id : ''
        // )
        // form.setValue('food_price', inforFood.food_price)
        // form.setValue('food_note', inforFood.food_note)
        // form.setValue('food_sort', inforFood.food_sort)
        if (inforFood.food_description) {
          refContent.current = inforFood.food_description
        }
        if (inforFood.food_image) {
          setImage({
            image_cloud: JSON.parse(inforFood.food_image).image_cloud,
            image_custom: JSON.parse(inforFood.food_image).image_custom
          })
        }
        if (inforFood.food_open_time) {
          const open_time = inforFood.food_open_time.split(':')
          setFood_open_time({
            hour: Number(open_time[0]),
            minute: Number(open_time[1])
          })
        }
        if (inforFood.food_close_time) {
          const close_time = inforFood.food_close_time.split(':')
          setFood_close_time({
            hour: Number(close_time[0]),
            minute: Number(close_time[1])
          })
        }
      }
    }
  }, [inforFood, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)

    // setLoading(true)

    //kiểm tra giờ mở cửa phải nhỏ hơn giờ đóng cửa
    if (food_open_time.hour > food_close_time.hour) {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa',
        variant: 'destructive'
      })
      return
    }
    if (food_open_time.hour === food_close_time.hour && food_open_time.minute >= food_close_time.minute) {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa',
        variant: 'destructive'
      })
      return
    }

    const payload: Partial<IFood> = {
      food_cat_id: data.food_cat_id,
      food_name: data.food_name,
      food_price: data.food_price,
      food_image: JSON.stringify(image),
      food_note: data.food_note,
      food_sort: data.food_sort,
      food_description: refContent.current.getContent(),
      food_open_time: `${food_open_time.hour.toString()}:${food_open_time.minute.toString()}:00`,
      food_close_time: `${food_close_time.hour.toString()}:${food_close_time.minute.toString()}:00`,
      food_options: data.food_options ? data.food_options : []
    }

    const res = id === 'add' ? await createFood(payload) : await updateFood({ ...payload, food_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm món ăn mới thành công' : 'Chỉnh sửa thông tin món ăn thành công',
        variant: 'default'
      })
      router.push('/dashboard/foods')
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
          <FormField
            control={form.control}
            name='food_image'
            render={({ field }) => (
              <FormItem className='w-20'>
                <FormLabel>Ảnh món ăn</FormLabel>
                <FormControl>
                  <>
                    {!file_image && !image.image_cloud && (
                      <label htmlFor='dish_imagae'>
                        <div className='w-28 h-28 border border-dashed justify-center items-center cursor-pointer flex flex-col mt-3'>
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
                          field.onChange(`${process.env.NEXT_PUBLIC_URL_CLIENT}/` + file?.name) //set thuoc tinh image
                          // field.onChange(URL.createObjectURL(file))
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
                className='w-28 h-28 object-cover my-3'
                width={128}
                height={128}
              />
              <Button
                type='button'
                variant={'destructive'}
                size={'sm'}
                onClick={() => {
                  setFile_Image(null)
                  form.setValue('food_image', '')
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
                  'Xóa hình hình ảnh'
                )}
              </Button>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='food_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên món ăn</FormLabel>
                <FormControl>
                  <Input placeholder='Tên món ăn...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='food_cat_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên danh mục</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn danh mục...' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.cat_res_name}
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
            name='food_price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá</FormLabel>
                <FormControl>
                  <Input placeholder='Giá...' type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='food_sort'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự</FormLabel>
                <FormControl>
                  <Input placeholder='Thứ tự...' type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='food_note'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chú thích</FormLabel>
                <FormControl>
                  <Input placeholder='Chú thích...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Popover>
            <PopoverTrigger asChild>
              <div className='flex flex-col mt-2 gap-3'>
                <Label>Giờ mở bán / nghỉ bán</Label>
                <Button type='button' variant={'outline'}>
                  {`${food_open_time.hour.toString().padStart(2, '0')}:${food_open_time.minute
                    .toString()
                    .padStart(2, '0')} - ${food_close_time.hour.toString().padStart(2, '0')}:${food_close_time.minute
                    .toString()
                    .padStart(2, '0')}`}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className='flex justify-between'>
              <ScrollArea>
                <Label>Giờ mở cửa</Label>
                <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 24 }, (_, i) => i)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            size='icon'
                            variant={food_open_time.hour === hour ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('open', 'hour', hour.toString())}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 60 }, (_, i) => i)
                        .reverse()
                        .map((minute) => (
                          <Button
                            key={minute}
                            size='icon'
                            variant={food_open_time.minute === minute ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('open', 'minute', minute.toString())}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                </div>
              </ScrollArea>
              <ScrollArea>
                <Label>Giờ đóng cửa</Label>
                <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 24 }, (_, i) => i)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            size='icon'
                            variant={food_close_time.hour === hour ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('close', 'hour', hour.toString())}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                  <ScrollArea className='w-64 sm:w-auto'>
                    <div className='flex sm:flex-col p-2'>
                      {Array.from({ length: 60 }, (_, i) => i)
                        .reverse()
                        .map((minute) => (
                          <Button
                            key={minute}
                            size='icon'
                            variant={food_close_time.minute === minute ? 'default' : 'ghost'}
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handSelectTime('close', 'minute', minute.toString())}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' className='sm:hidden' />
                  </ScrollArea>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        {fields.map((field, index) => (
          <>
            <div key={field.id} className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
              <div className='col-span-1 flex flex-col items-center'>
                <Label htmlFor={`food_options.${index}.fopt_image`}>Ảnh</Label>
                <Controller
                  name={`food_options.${index}.fopt_image`}
                  control={form.control}
                  render={({ field }) => (
                    <div className='relative group w-full h-[calc(2*var(--input-height))]'>
                      <label
                        htmlFor={`file-input-${index}`}
                        className='cursor-pointer flex items-center justify-center w-full h-[120px] border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-100 relative'
                      >
                        {uploadingImages[index] ? (
                          <span>Đang tải...</span>
                        ) : field.value ? (
                          <Image
                            src={JSON.parse(field.value).image_cloud}
                            alt='Preview'
                            className='object-cover w-auto h-[120px] rounded-md'
                            width={96}
                            height={96}
                          />
                        ) : (
                          <span className='text-gray-500'>Tải ảnh</span>
                        )}
                      </label>
                      <Input
                        id={`file-input-${index}`}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const newUploadingImages = [...uploadingImages]
                            newUploadingImages[index] = true
                            setUploadingImages(newUploadingImages)

                            try {
                              const res = await uploadImageOption(file)
                              if (res.statusCode === 201 && res.data) {
                                field.onChange(JSON.stringify(res.data))
                                toast({
                                  title: 'Thành công',
                                  description: 'Tải ảnh lên thành công',
                                  variant: 'default'
                                })
                              } else {
                                toast({
                                  title: 'Thất bại',
                                  description:
                                    'Chỉ được tải lên ảnh dưới 5 MB và ảnh phải có định dạng jpg, jpeg, png, webp',
                                  variant: 'destructive'
                                })
                              }
                            } catch (error) {
                              console.log('🚀 ~ onChange={ ~ error:', error)
                              toast({
                                title: 'Thất bại',
                                description:
                                  'Chỉ được tải lên ảnh dưới 5 MB và ảnh phải có định dạng jpg, jpeg, png, webp',
                                variant: 'destructive'
                              })
                            } finally {
                              const newUploadingImages = [...uploadingImages]
                              newUploadingImages[index] = false
                              setUploadingImages(newUploadingImages)
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                />
              </div>

              <div className='col-span-2 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <Label htmlFor={`food_options.${index}.fopt_name`}>Tên lựa chọn</Label>
                  <Controller
                    name={`food_options.${index}.fopt_name`}
                    control={form.control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor={`food_options.${index}.fopt_attribute`}>Thuộc tính</Label>
                  <Controller
                    name={`food_options.${index}.fopt_attribute`}
                    control={form.control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor={`food_options.${index}.fopt_price`}>Cộng thêm giá</Label>
                  <Controller
                    name={`food_options.${index}.fopt_price`}
                    control={form.control}
                    render={({ field }) => <Input type='number' {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor={`food_options.${index}.fopt_note`}>Ghi chú</Label>
                  <Controller
                    name={`food_options.${index}.fopt_note`}
                    control={form.control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor={`food_options.${index}.fopt_status`}>Trạng thái</Label>
                  <Controller
                    name={`food_options.${index}.fopt_status`}
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn món ăn' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='enable'>Đang bán</SelectItem>
                          <SelectItem value='disable'>Ngưng bán</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor={`food_options.${index}.fopt_state`}>Trạng thái bán</Label>
                  <div className='flex gap-2'>
                    <Controller
                      name={`food_options.${index}.fopt_state`}
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn trạng thái' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='soldOut'>Hết hàng</SelectItem>
                            <SelectItem value='inStock'>Còn hàng</SelectItem>
                            <SelectItem value='almostOut'>Sắp hết hàng</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <span onClick={() => remove(index)} className='cursor-pointer mt-2'>
                      <FaTrash />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-span-full border-t-2 border-dashed border-gray-300 mt-4'></div>{' '}
          </>
        ))}

        <Button
          onClick={() =>
            append({
              fopt_name: '',
              fopt_price: 0,
              fopt_attribute: '',
              fopt_note: '',
              fopt_status: 'enable',
              fopt_state: 'inStock',
              fopt_image: ''
            })
          }
          className='flex mx-auto justify-center items-center cursor-pointer'
        >
          Thêm lựa chọn
        </Button>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex justify-between items-end'>
            <Label>Giới thiệu</Label>
          </div>
          <EditorTiny editorRef={refContent} height='500px' />
        </div>

        <Button disabled={loading_upload_image || uploadingImages.includes(true)} type='submit'>
          {loading_upload_image || uploadingImages.includes(true) ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang tải...
            </>
          ) : id === 'add' ? (
            'Thêm món mới'
          ) : (
            'Chỉnh sửa'
          )}
        </Button>
      </form>
    </Form>
  )
}
