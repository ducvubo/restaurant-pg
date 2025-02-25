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
import { createFoodCombo, getAllCategories, getListFood, updateFoodCombo } from '../food-combos.api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import EditorTiny from '@/components/EditorTiny'
import { Label } from '@/components/ui/label'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { IFoodComboRes } from '../food-combos.interface'
import { IFood } from '../../foods/food.interface'
import { FaTrash } from 'react-icons/fa6'
import { IoAddCircleSharp } from 'react-icons/io5'
interface Props {
  id: string
  inforFoodCombo?: IFoodComboRes
}
const FormSchema = z.object({
  fcb_name: z.string().nonempty('Tên combo không được để trống'),
  fcb_price: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập giá tiền' }).min(1, { message: 'Số tiền phải dương' })),
  fcb_image: z.string().optional(),
  fcb_note: z.string().nonempty('Ghi chú không được để trống'),
  fcb_sort: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập số thứ tự' }).min(1, { message: 'Số thứ tự phải dương' })),
  food_items: z.array(
    z.object({
      food_id: z.string().nonempty('Vui lòng chọn món ăn'),
      food_quantity: z.preprocess((value) => {
        if (typeof value === 'string' && value.trim() === '') {
          return undefined
        }
        return Number(value)
      }, z.number({ message: 'Vui lòng nhập số lượng' }).min(1, { message: 'Số lượng phải dương' }))
    })
  )
})

export default function AddOrEdit({ id, inforFoodCombo }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const refContent = useRef<any>('')
  const [listFood, setListFood] = useState<IFood[]>([])

  const [file_image, setFile_Image] = useState<File | null>(null)
  const inputRef_Image = useRef<HTMLInputElement | null>(null)
  const previousFileImageRef = useRef<Blob | null>(null)
  const [loading_upload_image, setLoading_upload_image] = useState(false)
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string }>({
    image_cloud: '',
    image_custom: ''
  })
  const [fcb_open_time, setFcb_open_time] = useState<{ hour: number; minute: number }>({
    hour: 0,
    minute: 0
  })
  const [fcb_close_time, setFcb_close_time] = useState<{
    hour: number
    minute: number
  }>({
    hour: 0,
    minute: 0
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fcb_name: inforFoodCombo?.fcb_name || '',
      fcb_price: inforFoodCombo?.fcb_price || 0,
      fcb_note: inforFoodCombo?.fcb_note || '',
      fcb_sort: inforFoodCombo?.fcb_sort || 0,
      food_items: inforFoodCombo?.food_items || [{ food_id: '', food_quantity: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'food_items'
  })

  const findListFood = async () => {
    const res: IBackendRes<IFood[]> = await getListFood()

    if (res.statusCode === 200 && res.data) {
      setListFood(res.data)
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

  useEffect(() => {
    findListFood()
  }, [])

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

  const handSelectTime = (type: 'open' | 'close', state: 'hour' | 'minute', value: string) => {
    if (type === 'open') {
      setFcb_open_time((prev) => ({ ...prev, [state]: Number(value) }))
    } else {
      setFcb_close_time((prev) => ({ ...prev, [state]: Number(value) }))
    }
  }

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforFoodCombo) {
        if (inforFoodCombo.fcb_description) {
          refContent.current = inforFoodCombo.fcb_description
        }
        if (inforFoodCombo.fcb_image) {
          setImage({
            image_cloud: JSON.parse(inforFoodCombo.fcb_image).image_cloud,
            image_custom: JSON.parse(inforFoodCombo.fcb_image).image_custom
          })
        }
        if (inforFoodCombo.fcb_open_time) {
          const open_time = inforFoodCombo.fcb_open_time.split(':')
          setFcb_open_time({
            hour: Number(open_time[0]),
            minute: Number(open_time[1])
          })
        }
        if (inforFoodCombo.fcb_close_time) {
          const close_time = inforFoodCombo.fcb_close_time.split(':')
          setFcb_close_time({
            hour: Number(close_time[0]),
            minute: Number(close_time[1])
          })
        }
      }
    }
  }, [inforFoodCombo, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    //kiểm tra giờ mở cửa phải nhỏ hơn giờ đóng cửa
    if (fcb_open_time.hour > fcb_close_time.hour) {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa',
        variant: 'destructive'
      })
      return
    }
    if (fcb_open_time.hour === fcb_close_time.hour && fcb_open_time.minute >= fcb_close_time.minute) {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa',
        variant: 'destructive'
      })
      return
    }

    const payload: Partial<IFoodComboRes> = {
      fcb_name: data.fcb_name,
      fcb_price: data.fcb_price,
      fcb_image: JSON.stringify(image),
      fcb_note: data.fcb_note,
      fcb_sort: data.fcb_sort,
      fcb_description: refContent.current.getContent(),
      fcb_open_time: `${fcb_open_time.hour.toString()}:${fcb_open_time.minute.toString()}:00`,
      fcb_close_time: `${fcb_close_time.hour.toString()}:${fcb_close_time.minute.toString()}:00`,
      food_items: data.food_items
    }

    const res = id === 'add' ? await createFoodCombo(payload) : await updateFoodCombo({ ...payload, fcb_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm combo mới thành công' : 'Chỉnh sửa thông tin combo thành công',
        variant: 'default'
      })
      router.push('/dashboard/food-combos')
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

  console.log('inforFoodCombo', inforFoodCombo)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <div>
          <FormField
            control={form.control}
            name='fcb_image'
            render={({ field }) => (
              <FormItem className='w-20'>
                <FormLabel>Ảnh combo</FormLabel>
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
                  form.setValue('fcb_image', '')
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

        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='fcb_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên combo</FormLabel>
                <FormControl>
                  <Input placeholder='Tên món ăn...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='fcb_price'
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
            name='fcb_sort'
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

          <Popover>
            <PopoverTrigger asChild>
              <div className='flex flex-col mt-2 gap-3'>
                <Label>Giờ mở bán / nghỉ bán</Label>
                <Button type='button' variant={'outline'}>
                  {`${fcb_open_time.hour.toString().padStart(2, '0')}:${fcb_open_time.minute
                    .toString()
                    .padStart(2, '0')} - ${fcb_close_time.hour.toString().padStart(2, '0')}:${fcb_close_time.minute
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
                            variant={fcb_open_time.hour === hour ? 'default' : 'ghost'}
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
                            variant={fcb_open_time.minute === minute ? 'default' : 'ghost'}
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
                            variant={fcb_close_time.hour === hour ? 'default' : 'ghost'}
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
                            variant={fcb_close_time.minute === minute ? 'default' : 'ghost'}
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

          <FormField
            control={form.control}
            name='fcb_note'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Chú thích</FormLabel>
                <FormControl>
                  <Textarea placeholder='Chú thích...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div key={field.id} className='flex items-center gap-4 col-span-2 w-full'>
              <div className='w-3/5'>
                <Label htmlFor={`food_items.${index}.food_id`}>Món ăn</Label>
                <Controller
                  name={`food_items.${index}.food_id`}
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn món ăn' />
                      </SelectTrigger>
                      <SelectContent>
                        {listFood.map((food) => (
                          <SelectItem key={food.food_id} value={food.food_id}>
                            {food.food_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='w-3/5'>
                <Label htmlFor={`food_items.${index}.food_quantity`}>Số lượng</Label>
                <Controller
                  name={`food_items.${index}.food_quantity`}
                  control={form.control}
                  render={({ field }) => <Input type='number' {...field} />}
                />
              </div>
              <div className='flex w-auto justify-center items-center gap-2 mt-6'>
                {fields.length > 1 && (
                  <span onClick={() => remove(index)} className='flex justify-center items-center cursor-pointer'>
                    <FaTrash />
                  </span>
                )}

                <span
                  onClick={() => append({ food_id: '', food_quantity: 0 })}
                  className='flex justify-center items-center cursor-pointer'
                >
                  <IoAddCircleSharp />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <div className='flex justify-between items-end'>
            <Label>Giới thiệu</Label>
          </div>
          <EditorTiny editorRef={refContent} height='500px' />
        </div>

        <Button type='submit'>{id === 'add' ? 'Thêm combo mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
