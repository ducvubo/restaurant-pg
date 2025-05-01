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
import { IDish } from '../dishes.interface'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { ReloadIcon } from '@radix-ui/react-icons'
import EditorTiny from '@/components/EditorTiny'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createDish, updateDish } from '../dishes.api'

interface Props {
  id: string
  inforDish?: IDish
}
const FormSchema = z.object({
  dish_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  dish_image: z.string().optional(),
  dish_price: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập giá' }).min(1, { message: 'Giá lớn hơn hoặc bằng 1' })),
  dish_short_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả ngắn' }),
  dish_sale: z
    .object({
      sale_type: z
        .enum(['percentage', 'fixed'], {
          errorMap: () => ({ message: 'Loại khuyến mãi không hợp lệ' })
        })
        .optional(),
      sale_value: z.preprocess((value) => {
        // Kiểm tra nếu value là chuỗi rỗng thì trả về undefined để xử lý là optional
        if (typeof value === 'string' && value.trim() === '') {
          return undefined
        }
        // Chuyển đổi giá trị thành số
        return Number(value)
      }, z.number({ message: 'Giá trị sale phải là số' }).min(0, { message: 'Giá trị sale phải lớn hơn hoặc bằng 1' }).optional())
    })
    .optional(),

  //sự ưu tiên
  dish_priority: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined
    }
    return Number(value)
  }, z.number({ message: 'Vui lòng nhập sự ưu tiên' })),

  // dish_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),

  //ghi chú
  dish_note: z.string().optional()
})

export default function AddOrEdit({ id, inforDish }: Props) {
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
  const [isSaleEnabled, setIsSaleEnabled] = useState(false)
  const refDescription = useRef<any>('')
  const [finalPrice, setFinalPrice] = useState<any>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dish_name: '',
      dish_image: '',
      dish_price: 0,
      dish_sale: {
        sale_type: 'percentage',
        sale_value: 0
      },
      dish_short_description: '',
      // dish_description: '',
      dish_priority: 0,
      dish_note: ''
    }
  })

  const { control, resetField, watch } = form

  const dishPrice = watch('dish_price')
  const saleType = watch('dish_sale.sale_type')
  const saleValue = watch('dish_sale.sale_value')

  useEffect(() => {
    if (dishPrice && saleValue) {
      let calculatedPrice = dishPrice

      if (saleType === 'percentage') {
        calculatedPrice = dishPrice - (dishPrice * saleValue) / 100
      } else if (saleType === 'fixed') {
        calculatedPrice = dishPrice - saleValue
      }

      // Đảm bảo giá sau khi giảm không âm
      setFinalPrice(Math.max(calculatedPrice, 0))
    } else {
      setFinalPrice(null) // Nếu không có giá trị nào hợp lệ, bỏ qua việc tính toán
    }
  }, [dishPrice, saleType, saleValue])

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
    const uploadImageDish = async () => {
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
      uploadImageDish()
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
      if (inforDish) {
        if (inforDish.dish_sale) {
          setIsSaleEnabled(true)
        }

        form.setValue('dish_name', inforDish.dish_name)
        form.setValue('dish_price', inforDish.dish_price)
        form.setValue('dish_short_description', inforDish.dish_short_description)
        form.setValue('dish_priority', inforDish.dish_priority)
        form.setValue('dish_note', inforDish.dish_note)
        form.setValue('dish_sale', inforDish.dish_sale ? inforDish.dish_sale : undefined)

        if (inforDish.dish_image) {
          setImage({
            image_cloud: inforDish.dish_image.image_cloud,
            image_custom: inforDish.dish_image.image_custom
          })
        }

        if (inforDish.dish_description) {
          // setDescription(inforDish.dish_description)
          refDescription.current = inforDish.dish_description
        }
      }
    }
  }, [inforDish, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const payload: any = {
      dish_name: data.dish_name,
      dish_image: image,
      dish_price: data.dish_price,
      dish_sale: data.dish_sale,
      dish_priority: data.dish_priority,
      dish_note: data.dish_note,
      dish_short_description: data.dish_short_description,
      dish_description: refDescription.current.getContent()
    }
    if (!isSaleEnabled) {
      delete payload.dish_sale
    }

    const res = id === 'add' ? await createDish(payload) : await updateDish({ ...payload, _id: id })

    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm món ăn mới thành công' : 'Chỉnh sửa thông tin món ăn thành công',
        variant: 'default'
      })
      router.push('/dashboard/dishes')
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
            name='dish_image'
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
                className='w-28 h-28 object-cover rounded-full my-3'
                width={128}
                height={128}
              />
              <Button
                type='button'
                variant={'destructive'}
                size={'sm'}
                onClick={() => {
                  setFile_Image(null)
                  form.setValue('dish_image', '')
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name='dish_name'
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
            name='dish_price'
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
            name='dish_short_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả ngắn</FormLabel>
                <FormControl>
                  <Textarea placeholder='Mô tả ngắn...' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='dish_note'
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
            name='dish_priority'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm ưu tiên</FormLabel>
                <FormControl>
                  <Input placeholder='Điểm ưu tiên...' type='number' {...field} />
                </FormControl>
                <FormDescription>
                  Điểm ưu tiên càng cao thì món ăn sẽ hiển thị lên trước, mặc định sẽ là 0
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-8'>
            <label className='flex items-center'>
              <span>Áp dụng giảm giá</span>
              <Switch checked={isSaleEnabled} onCheckedChange={setIsSaleEnabled} className='ml-2' />
            </label>
          </div>
          {isSaleEnabled && (
            <>
              <div className='mt-4'>
                <Controller
                  name='dish_sale.sale_type'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn loại khuyến mãi' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='percentage'>Giảm giá theo %</SelectItem>
                        <SelectItem value='fixed'>Giảm giá trực tiếp</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='mt-4'>
                <Controller
                  name='dish_sale.sale_value'
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input {...field} placeholder='Giá trị sale' type='number' />
                      {finalPrice !== null && (
                        <p className='mt-2 text-sm text-gray-600'>Giá sau khi giảm: {finalPrice.toLocaleString()} VND</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </>
          )}


        </div>
        <EditorTiny editorRef={refDescription} />
        <Button type='submit'>{id === 'add' ? 'Thêm món ăn mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
