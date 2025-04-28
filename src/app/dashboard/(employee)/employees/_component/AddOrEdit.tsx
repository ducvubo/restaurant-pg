'use client'
import { PasswordInput } from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { IoMdCloudUpload } from 'react-icons/io'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createEmployee, updateEmployee } from '../employees.api'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IEmployee } from '../employees.interface'
import { isNumericString } from '@/app/utils'

const FormSchema = z.object({
  epl_email: z
    .string()
    .nonempty({ message: 'Vui lòng nhập email' })
    .min(10, {
      message: 'Email không hợp lệ'
    })
    .email({ message: 'Email không hợp lệ' }),
  epl_password: z.string().nonempty({ message: 'Vui lòng nhập password' }).min(8, {
    message: 'Mật khẩu có ít nhất 8 kí tự'
  }),
  epl_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  epl_address: z.string().nonempty({ message: 'Vui lòng nhập địa chỉ' }),
  epl_phone: z.string().nonempty({ message: 'Vui lòng nhập số điện thoại' }).min(10, {
    message: 'Số điện thoại không hợp lệ'
  }),
  epl_gender: z.enum(['Khác', 'Nam', 'Nữ']),
  epl_avatar: z.string().optional()
})

interface Props {
  id: string
  inforEmployee?: IEmployee
}

export default function AddOrEdit({ id, inforEmployee }: Props) {
  const router = useRouter()
  const { setLoading } = useLoading()
  const { toast } = useToast()
  const [file_avatar, setFile_avatar] = useState<File | null>(null)
  const inputRef_avatar = useRef<HTMLInputElement | null>(null)
  const previousFileAvatarRef = useRef<Blob | null>(null)
  const [loading_upload_avatar, setLoading_upload_avatar] = useState(false)
  const [avatar, setAvatar] = useState<{ image_cloud: string; image_custom: string }>({
    image_cloud: '',
    image_custom: ''
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      epl_email: '',
      epl_password: '',
      epl_name: '',
      epl_address: '',
      epl_phone: '',
      epl_gender: 'Khác'
    }
  })

  // let epl_avatar = form.watch('epl_avatar')

  const uploadImage = async (formData: FormData, type: string) => {
    setLoading_upload_avatar(true)
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
        setLoading_upload_avatar(false)

        toast({
          title: 'Thành công',
          description: 'Tải ảnh lên thành công',
          variant: 'default'
        })
        setAvatar({
          image_cloud: res.data.image_cloud,
          image_custom: res.data.image_custom
        })
        return res.mataData
      }
      if (res.statusCode === 422 || res.statusCode === 400) {
        setLoading_upload_avatar(false)
        setFile_avatar(null)
        setAvatar({
          image_cloud: '',
          image_custom: ''
        })

        toast({
          title: 'Thất bại',
          description: 'Chỉ được tải lên ảnh dưới 5 MB và ảnh phải có định dạng jpg, jpeg, png, webp',
          variant: 'destructive'
        })
      } else {
        setLoading_upload_avatar(false)

        toast({
          title: 'Thất bại',
          description: 'Lỗi khi tải ảnh lên, vui lòng thử lại sau ít phút',
          variant: 'default'
        })
      }
    } catch (error) {
      setLoading_upload_avatar(false)
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const uploadAvatar = async () => {
      const formData_avatar = new FormData()
      formData_avatar.append('file', file_avatar as Blob)
      try {
        await uploadImage(formData_avatar, 'avatar')
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    if (file_avatar && file_avatar !== previousFileAvatarRef.current) {
      previousFileAvatarRef.current = file_avatar
      uploadAvatar()
    }
    if (!file_avatar && file_avatar !== previousFileAvatarRef.current) {
      setAvatar({
        image_cloud: '',
        image_custom: ''
      })
    }
  }, [file_avatar])

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforEmployee) {
        form.setValue('epl_email', inforEmployee.epl_email)
        form.setValue('epl_password', 'NoPassword123*')
        form.setValue('epl_name', inforEmployee.epl_name)
        form.setValue('epl_address', inforEmployee.epl_address)
        form.setValue('epl_phone', inforEmployee.epl_phone)
        form.setValue('epl_gender', inforEmployee.epl_gender)
        if (inforEmployee && inforEmployee.epl_avatar) {
          setAvatar(inforEmployee.epl_avatar)
        }
      }
    }
  }, [inforEmployee, id])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (loading_upload_avatar) {
      toast({
        title: 'Thông báo',
        description: 'Đang tải ảnh lên, vui lòng đợi ít phút',
        variant: 'default'
      })
      return
    }

    // if (isNumericString(data.epl_phone)) {
    //   toast({
    //     title: 'Thông báo',
    //     description: 'Số điện thoại không hợp lệ',
    //     variant: 'default'
    //   })
    //   return
    // }

    setLoading(true)
    const payload: any = {
      ...data,
      epl_avatar: avatar
    }

    const res = id === 'add' ? await createEmployee(payload) : await updateEmployee({ ...payload, _id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id == 'add' ? 'Thêm nhân viên mới thành công' : 'Chỉnh sửa thông tin nhân viên thành công',
        variant: 'default'
      })
      router.push('/dashboard/employees')
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
    } else if (res.statusCode === 404) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Nhân viên không tồn tại, vui lòng thử lại sau',
        variant: 'destructive'
      })
    } else if (res.statusCode === 409) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Email đã tồn tại, vui lòng nhập email khác',
        variant: 'destructive'
      })
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
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className='flex gap-5'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 w-full'>
          <div>
            <FormField
              control={form.control}
              name='epl_avatar'
              render={({ field }) => (
                <FormItem className='w-20'>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <>
                      {!file_avatar && !avatar.image_cloud && (
                        <label htmlFor='epl_avatar'>
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
                        id='epl_avatar'
                        disabled={loading_upload_avatar ? true : false}
                        type='file'
                        accept='image/*'
                        ref={inputRef_avatar}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile_avatar(file)
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
            {(file_avatar || avatar.image_cloud) && (
              <div>
                <Image
                  src={file_avatar ? URL.createObjectURL(file_avatar) : (avatar.image_cloud as string)}
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
                    setFile_avatar(null)
                    form.setValue('epl_avatar', '')
                    if (inputRef_avatar.current) {
                      setAvatar({
                        image_cloud: '',
                        image_custom: ''
                      })
                      inputRef_avatar.current.value = ''
                    }
                  }}
                  disabled={loading_upload_avatar}
                >
                  {loading_upload_avatar ? (
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
              name="epl_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email..."
                      type="email"
                      {...field}
                      disabled={inforEmployee ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="epl_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Password..."
                      {...field}
                      disabled={inforEmployee ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="epl_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="epl_gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Khác">Khác</SelectItem>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="epl_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số điện thoại..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="epl_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Địa chỉ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={loading_upload_avatar}>
            {id === 'add' ? 'Thêm nhân viên' : 'Chỉnh sửa'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
