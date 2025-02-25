'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createIngredient, findAllCategories, findAllUnits, updateIngredient } from '../ingredient.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IIngredient } from '../ingredient.interface'
import { ICatIngredient } from '../../cat-ingredients/cat-ingredient.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { IoMdCloudUpload } from 'react-icons/io'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Loader2 } from 'lucide-react'
import { IUnit } from '../../units/unit.interface'

interface Props {
  id: string
  inforIngredient?: IIngredient
}
const FormSchema = z.object({
  igd_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  igd_description: z.string().nonempty({ message: 'Vui lòng nhập mô tả' }),
  cat_igd_id: z.string().nonempty({ message: 'Vui lòng chọn danh mục' }),
  unt_id: z.string().nonempty({ message: 'Vui lòng chọn đơn vị đo' }),
  igd_image: z.string().optional()
})

export default function AddOrEdit({ id, inforIngredient }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [listCategories, setListCategories] = useState<ICatIngredient[]>([])
  const [listUnits, setListUnits] = useState<IUnit[]>([])
  const [file_image, setFile_Image] = useState<File | null>(null)
  const inputRef_Image = useRef<HTMLInputElement | null>(null)
  const previousFileImageRef = useRef<Blob | null>(null)
  const [loading_upload_image, setLoading_upload_image] = useState(false)
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string }>({
    image_cloud: '',
    image_custom: ''
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      igd_name: inforIngredient?.igd_name || '',
      igd_description: inforIngredient?.igd_description || '',
      cat_igd_id: inforIngredient?.cat_igd_id
        ? typeof inforIngredient.cat_igd_id === 'string'
          ? inforIngredient.cat_igd_id
          : ''
        : '',
      unt_id: inforIngredient?.unt_id ? (typeof inforIngredient.unt_id === 'string' ? inforIngredient.unt_id : '') : ''
    }
  })

  useEffect(() => {
    getAllCat()
    getAllUnit()
  }, [])

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforIngredient) {
        if (inforIngredient.igd_image) {
          setImage({
            image_cloud: JSON.parse(inforIngredient.igd_image).image_cloud,
            image_custom: JSON.parse(inforIngredient.igd_image).image_custom
          })
        }
      }
    }
  }, [inforIngredient, id])

  const getAllCat = async () => {
    const res: IBackendRes<ICatIngredient[]> = await findAllCategories()
    if (res.statusCode === 200 && res.data) {
      setListCategories(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
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

  const getAllUnit = async () => {
    const res: IBackendRes<IUnit[]> = await findAllUnits()
    if (res.statusCode === 200 && res.data) {
      setListUnits(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
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
        setImage({
          image_cloud: '',
          image_custom: ''
        })
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
    const uploadImageIngredient = async () => {
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
      uploadImageIngredient()
    }
    if (!file_image && file_image !== previousFileImageRef.current) {
      setImage({
        image_cloud: '',
        image_custom: ''
      })
    }
  }, [file_image])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const payload = {
      igd_name: data.igd_name,
      igd_description: data.igd_description,
      cat_igd_id: data.cat_igd_id,
      unt_id: data.unt_id,
      igd_image: JSON.stringify(image)
    }

    const res = id === 'add' ? await createIngredient(payload) : await updateIngredient({ ...payload, igd_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm nguyên liệu mới thành công' : 'Chỉnh sửa thông tin nguyên liệu thành công',
        variant: 'default'
      })
      router.push('/dashboard/ingredients')
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
            name='igd_image'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Ảnh nguyên liệu</FormLabel>
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
                  form.setValue('igd_image', '')
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

        <FormField
          control={form.control}
          name='igd_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nguyên liệu</FormLabel>
              <FormControl>
                <Input placeholder='Tên nguyên liệu...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='cat_igd_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn danh mục...' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {listCategories.map((category) => (
                    <SelectItem key={category.cat_igd_id} value={category.cat_igd_id}>
                      {category.cat_igd_name}
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
          name='unt_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn đơn vị đo...' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {listUnits.map((unit) => (
                    <SelectItem key={unit.unt_id} value={unit.unt_id}>
                      {unit.unt_name}
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
          name='igd_description'
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

        {/* <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button> */}
        <Button disabled={loading_upload_image} type='submit'>
          {loading_upload_image ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang tải...
            </>
          ) : id === 'add' ? (
            'Thêm mới'
          ) : (
            'Chỉnh sửa'
          )}
        </Button>
      </form>
    </Form>
  )
}
