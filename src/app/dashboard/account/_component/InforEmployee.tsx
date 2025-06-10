'use client'
import React, { useRef, useState } from 'react'
import { IEmployee } from '../../(employee)/employees/employees.interface'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Loader2, UploadIcon, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { updateInforEmployee } from '../account.api'

interface InforEmployeeProps {
  inforEmployee: IEmployee
}

interface ImageUrl {
  image_cloud: string
  image_custom: string
}

export default function InforEmployee({ inforEmployee }: InforEmployeeProps) {
  const { setLoading } = useLoading()
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [epl_name, setEpl_name] = useState(inforEmployee?.epl_name || '')
  const [epl_phone, setEpl_phone] = useState(inforEmployee?.epl_phone || '')
  const [epl_address, setEpl_address] = useState(inforEmployee?.epl_address || '')
  const [epl_gender, setEpl_gender] = useState<'Khác' | 'Nam' | 'Nữ' | ''>(
    inforEmployee?.epl_gender || ''
  )
  const [epl_avatar, setEpl_avatar] = useState<{
    image_cloud: string
    image_custom: string
  }>(inforEmployee?.epl_avatar || { image_cloud: '', image_custom: '' })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputAvatarRef = useRef<HTMLInputElement | null>(null)

  const validateForm = () => {
    if (!epl_name.trim()) {
      toast({ title: 'Thất bại', description: 'Tên nhân viên không được để trống', variant: 'destructive' })
      return false
    }
    if (!epl_phone.match(/^[0-9]{10}$/)) {
      toast({ title: 'Thất bại', description: 'Số điện thoại phải có 10 chữ số', variant: 'destructive' })
      return false
    }
    if (!epl_address.trim()) {
      toast({ title: 'Thất bại', description: 'Địa chỉ không được để trống', variant: 'destructive' })
      return false
    }
    if (!epl_gender) {
      toast({ title: 'Thất bại', description: 'Vui lòng chọn giới tính', variant: 'destructive' })
      return false
    }
    return true
  }

  const uploadImage = async (file: File): Promise<IBackendRes<ImageUrl>> => {
    const formData = new FormData()
    formData.append('file', file)
    return await (
      await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`, {
        method: 'POST',
        headers: { folder_type: 'employee_avatar' },
        body: formData
      })
    ).json()
  }

  const handleFileChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingAvatar(true)
      if (files.length > 1) {
        toast({ title: 'Thất bại', description: 'Chỉ được chọn 1 ảnh!', variant: 'destructive' })
        setIsUploadingAvatar(false)
        return
      }
      try {
        const res: IBackendRes<ImageUrl> = await uploadImage(files[0])
        if (res.statusCode === 201 && res.data) {
          setEpl_avatar(res.data)
        } else {
          toast({ title: 'Thất bại', description: 'Upload ảnh thất bại!', variant: 'destructive' })
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
        toast({ title: 'Thất bại', description: 'Upload ảnh thất bại!', variant: 'destructive' })
      }
      setIsUploadingAvatar(false)
    }
  }

  const removeAvatar = () => {
    setEpl_avatar({ image_cloud: '', image_custom: '' })
  }


  const onSubmit = async () => {
    if (!validateForm()) return
    const data: Partial<any> = {
      epl_name,
      epl_phone,
      epl_address,
      epl_gender,
      epl_avatar
    }
    setLoading(true)
    const res: IBackendRes<IEmployee> = await updateInforEmployee(data)
    setLoading(false)
    if (res.statusCode === 200 || res.statusCode === 201) {
      toast({ title: 'Thành công', description: 'Cập nhật thông tin nhân viên thành công!', variant: 'default' })
      setMode('view')
      window.location.reload()
    } else if (res.statusCode === 400) {
      const messages = Array.isArray(res.message) ? res.message : [res.message]
      messages.forEach((msg: string) =>
        toast({ title: 'Thất bại', description: msg, variant: 'destructive' })
      )
    } else if (res.statusCode === 401) {
      toast({
        title: 'Thất bại',
        description: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Thất bại',
        description: 'Cập nhật thông tin nhân viên thất bại, vui lòng thử lại',
        variant: 'destructive'
      })
    }
  }

  const renderViewMode = () => (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={() => setMode('edit')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Email</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_email}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên nhân viên</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số điện thoại</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_phone}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Địa chỉ</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_address}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giới tính</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_gender}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Avatar</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforEmployee.epl_avatar.image_cloud ? (
                <div className='relative w-24 h-24'>
                  <Image
                    src={inforEmployee.epl_avatar.image_cloud}
                    alt='Avatar'
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
              ) : (
                'Chưa có avatar'
              )}
            </td>
          </tr>

          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Face ID</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforEmployee.epl_face_id ? 'Có' : 'Không'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  const renderEditMode = () => (
    <div className='space-y-6'>
      <div className='flex justify-end gap-2'>
        <Button onClick={onSubmit} disabled={isUploadingAvatar}>
          {isUploadingAvatar ? <Loader2 className='animate-spin' /> : 'Lưu'}
        </Button>
        <Button onClick={() => setMode('view')}>Xem thông tin</Button>
      </div>
      <div>
        <h1 className='mb-2'>Avatar nhân viên</h1>
        <div className='flex gap-2'>
          <div
            onClick={() => fileInputAvatarRef.current?.click()}
            className='relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
          >
            <div className='text-center'>
              {isUploadingAvatar ? (
                <Loader2 className='animate-spin' />
              ) : (
                <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
              )}
              <Input
                ref={fileInputAvatarRef}
                id='uploadAvatar'
                type='file'
                accept='image/*'
                onChange={handleFileChangeAvatar}
                disabled={isUploadingAvatar}
                className='sr-only'
              />
            </div>
          </div>
          {epl_avatar.image_cloud && (
            <div className='relative w-36 h-36  aspect-square rounded-md border-2 border-gray-300'>
              <Image src={epl_avatar.image_cloud} alt='Avatar' fill className='object-cover rounded-md' />
              <button
                onClick={removeAvatar}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>
          <Label>Tên nhân viên</Label>
          <Input
            placeholder='Nhập tên nhân viên'
            value={epl_name}
            onChange={(e) => setEpl_name(e.target.value)}
          />
        </div>
        <div>
          <Label>Số điện thoại</Label>
          <Input
            placeholder='Nhập số điện thoại'
            value={epl_phone}
            onChange={(e) => setEpl_phone(e.target.value)}
          />
        </div>
        <div>
          <Label>Địa chỉ</Label>
          <Input
            placeholder='Nhập địa chỉ'
            value={epl_address}
            onChange={(e) => setEpl_address(e.target.value)}
          />
        </div>
        <div>
          <Label>Giới tính</Label>
          <Select value={epl_gender} onValueChange={(value: 'Khác' | 'Nam' | 'Nữ') => setEpl_gender(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn giới tính...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Nam'>Nam</SelectItem>
              <SelectItem value='Nữ'>Nữ</SelectItem>
              <SelectItem value='Khác'>Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>
  )

  return <div>{mode === 'view' ? renderViewMode() : renderEditMode()}</div>
}