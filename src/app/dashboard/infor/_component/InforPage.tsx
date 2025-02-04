'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useEffect, useRef, useState } from 'react'
import { IAmentities, IResApiAddress, IRestaurantTypes } from '../infor.interface'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { ImageUrl } from '../../(food)/foods/_component/AddOrEdit'
import Image from 'next/image'
import { Cat, Dog, Fish, Loader2, Rabbit, Turtle, UploadIcon } from 'lucide-react'
import { MultiSelect } from '@/components/Multipleselect'
import { getAmentities, getRestaurantTypes } from '../infor.api'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import EditorTiny from '@/components/EditorTiny'

const frameworksList = [
  { value: 'react', label: 'React', icon: Turtle },
  { value: 'angular', label: 'Angular', icon: Cat },
  { value: 'vue', label: 'Vue', icon: Dog },
  { value: 'svelte', label: 'Svelte', icon: Rabbit },
  { value: 'ember', label: 'Ember', icon: Fish }
]
export default function InforPage() {
  const [restaurant_name, setRestaurant_name] = useState('')
  const [restaurant_phone, setRestaurant_phone] = useState('')
  const [provinces, setProvinces] = useState<IResApiAddress[]>([])
  const [districts, setDistricts] = useState<IResApiAddress[]>([])
  const [wards, setWards] = useState<IResApiAddress[]>([])
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<{ id: string; name: string } | null>(null)
  const [selectedWard, setSelectedWard] = useState<{ id: string; name: string } | null>(null)
  const [address, setAddress] = useState('')
  const [schedule, setSchedule] = useState<{ day: string; startTime: string; endTime: string }[]>([])
  const [price, setPrice] = useState<{
    restaurant_price_option: 'up' | 'down' | 'range'
    restaurant_price_min?: number
    restaurant_price_max?: number
    restaurant_price_amount?: number
  }>({
    restaurant_price_option: 'up',
    restaurant_price_min: undefined,
    restaurant_price_max: undefined,
    restaurant_price_amount: undefined
  })
  const [uploadedUrlsBanner, setUploadedUrlsBanner] = useState<
    {
      image_cloud: string
      image_custom: string
    }[]
  >([])
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const fileInputBannerRef = useRef<HTMLInputElement | null>(null)

  const [uploadedUrlsAvatar, setUploadedUrlsAvatar] = useState<{
    image_cloud: string
    image_custom: string
  }>({
    image_cloud: '',
    image_custom: ''
  })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputAvatarRef = useRef<HTMLInputElement | null>(null)
  const [listAmenity, setListAmenity] = useState<
    {
      value: string
      label: string
    }[]
  >([])
  const [selectedAmenity, setSelectedAmenity] = useState<string[]>([])

  const [listRestaurantTypes, setListRestaurantTypes] = useState<
    {
      value: string
      label: string
    }[]
  >([])
  const [selectedRestaurantType, setSelectedRestaurantType] = useState<string[]>([])
  const refOverview = useRef<HTMLTextAreaElement | null>(null)
  const refDescription = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data)
        }
      }),
      getListAmennities(),
      getListRestaurantType()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince.id}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setDistricts(data.data)
            setWards([])
            setSelectedDistrict(null)
          }
        })
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict.id}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setWards(data.data)
            setSelectedWard(null)
          }
        })
    }
  }, [selectedDistrict])

  const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']

  const getListAmennities = async () => {
    const res: IBackendRes<IAmentities[]> = await getAmentities()
    if (res.statusCode === 200 && res.data) {
      setListAmenity(res.data.map((item) => ({ value: item._id, label: item.amenity_name })))
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

  const getListRestaurantType = async () => {
    const res: IBackendRes<IRestaurantTypes[]> = await getRestaurantTypes()
    if (res.statusCode === 200 && res.data) {
      setListRestaurantTypes(res.data.map((item) => ({ value: item._id, label: item.restaurant_type_name })))
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

  const addSchedule = () => {
    setSchedule([...schedule, { day: '', startTime: '', endTime: '' }])
  }

  const updateSchedule = (
    index: number,
    field: keyof { day: string; startTime: string; endTime: string },
    value: string
  ) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[index][field] = value

    const { day, startTime, endTime } = updatedSchedule[index]
    if (field === 'startTime' || field === 'endTime') {
      if (startTime && endTime) {
        const startMinutes = timeToMinutes(startTime)
        const endMinutes = timeToMinutes(endTime)

        if (endMinutes <= startMinutes) {
          toast({
            title: 'Thất bại',
            description: 'Giờ đóng cửa phải sau giờ mở cửa!',
            variant: 'destructive'
          })
          return
        }

        const isOverlapping = updatedSchedule.some((scheduleItem, i) => {
          if (i === index || scheduleItem.day !== day) return false

          const itemStartMinutes = timeToMinutes(scheduleItem.startTime)
          const itemEndMinutes = timeToMinutes(scheduleItem.endTime)

          return startMinutes < itemEndMinutes && endMinutes > itemStartMinutes
        })

        if (isOverlapping) {
          toast({
            title: 'Thất bại',
            description: 'Không thể thêm lịch làm việc trùng nhau!',
            variant: 'destructive'
          })
          return
        }
      }
    }
    setSchedule(updatedSchedule)
  }

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

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

  const handleFileChangeBanner = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingBanner(true)

      const uploadedImages: {
        image_cloud: string
        image_custom: string
      }[] = []
      for (const file of files) {
        try {
          const url = await uploadImage(file, 'restaurant_banner')
          if (url.statusCode === 201 && url.data?.image_cloud) {
            uploadedImages.push(url.data)
          }
        } catch (error) {
          console.error('Error uploading file:', file.name, error)
        }
      }

      setUploadedUrlsBanner((prev) => [...prev, ...uploadedImages])
      setIsUploadingBanner(false)
    }
  }

  const handleFileChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingAvatar(true)

      if (files.length > 1) {
        toast({
          title: 'Thất bại',
          description: 'Chỉ được chọn 1 ảnh!',
          variant: 'destructive'
        })
        setIsUploadingAvatar(false)
        return
      }
      const res: IBackendRes<ImageUrl> = await uploadImage(files[0], 'restaurant_avatar')
      if (res.statusCode === 201 && res.data) {
        setIsUploadingAvatar(false)
        setUploadedUrlsAvatar(res.data)
      } else {
        setIsUploadingAvatar(false)
        toast({
          title: 'Thất bại',
          description: 'Upload ảnh thất bại!',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <div>
      <div>
        <h1 className='-mb-3'>Ảnh nhà hàng</h1>
        <div className='flex gap-2'>
          <div
            onClick={() => {
              if (fileInputBannerRef.current) {
                fileInputBannerRef.current.click()
              }
            }}
            className='mt-4 relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 focus-within:outline-2 focus-within:outline-dashed focus-within:outline-gray-500 dark:focus-within:outline-gray-400'
          >
            <div className='text-center'>
              {isUploadingBanner ? (
                <Loader2 className='animate-spin' />
              ) : (
                <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
              )}
              <Input
                ref={fileInputBannerRef}
                id='uploadBanner'
                type='file'
                accept='image/*'
                multiple
                onChange={handleFileChangeBanner}
                disabled={isUploadingBanner}
                className='sr-only'
              />
            </div>
          </div>
          {uploadedUrlsBanner.length > 0 && (
            <div className='mt-4'>
              <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {uploadedUrlsBanner.map((url, index) => (
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className='mt-4'>
        <h1 className='-mb-3'>Ảnh đại diện nhà hàng</h1>
        <div className='flex gap-2'>
          <div
            onClick={() => {
              if (fileInputAvatarRef.current) {
                fileInputAvatarRef.current.click()
              }
            }}
            className='mt-4 relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 focus-within:outline-2 focus-within:outline-dashed focus-within:outline-gray-500 dark:focus-within:outline-gray-400'
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
          {uploadedUrlsAvatar.image_cloud && (
            <div className='relative h-24 mt-4 sm:h-32 md:h-36 aspect-square rounded-md border-2 border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'>
              <Image src={uploadedUrlsAvatar.image_cloud} alt={`vuducbo`} fill className='object-cover rounded-md' />
            </div>
          )}
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='w-full'>
          <Label>Tên nhà hàng</Label>
          <Input
            placeholder='Nhập tên nhà hàng'
            className='w-full'
            onChange={(e) => setRestaurant_name(e.target.value)}
          />
        </div>
        <div className='w-full'>
          <Label>Số điện thoại</Label>
          <Input
            placeholder='Nhập số điện thoại'
            className='w-full'
            onChange={(e) => setRestaurant_phone(e.target.value)}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div>
          <Label>Tỉnh</Label>
          <Select
            value={selectedProvince?.id || ''}
            onValueChange={(value) => {
              const province = provinces.find((p) => p.id === value)
              setSelectedProvince(province ? { id: province.id, name: province.full_name } : null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn tỉnh...' />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Huyện</Label>
          <Select
            value={selectedDistrict?.id || ''}
            onValueChange={(value) => {
              const district = districts.find((d) => d.id === value)
              setSelectedDistrict(district ? { id: district.id, name: district.full_name } : null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn huyện...' />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Xã</Label>
          <Select
            value={selectedWard?.id || ''}
            onValueChange={(value) => {
              const ward = wards.find((w) => w.id === value)
              setSelectedWard(ward ? { id: ward.id, name: ward.full_name } : null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn xã...' />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Địa chỉ cụ thể</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Nhập địa chỉ'
            className='w-full'
          />
        </div>
      </div>

      <div>
        <div className='space-y-4 mt-3'>
          {schedule.map((item, index) => (
            <div className='flex gap-4' key={index}>
              <div className='w-full flex flex-col sm:w-1/3'>
                <Label>Ngày</Label>
                <Select value={item.day} onValueChange={(value) => updateSchedule(index, 'day', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn ngày...' />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day, i) => (
                      <SelectItem key={i} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='w-full flex flex-col sm:w-1/3'>
                <Label>Giờ mở cửa</Label>
                <DatePicker
                  selected={item.startTime ? new Date(`1970-01-01T${item.startTime}:00`) : null}
                  onChange={(date) =>
                    updateSchedule(
                      index,
                      'startTime',
                      date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                    )
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption='Chọn giờ bắt đầu'
                  dateFormat='HH:mm'
                  timeFormat='HH:mm'
                  customInput={<Input />}
                />
              </div>
              <div className='w-full flex flex-col sm:w-1/3'>
                <Label>Giờ đóng cửa</Label>
                <DatePicker
                  selected={item.endTime ? new Date(`1970-01-01T${item.endTime}:00`) : null}
                  onChange={(date) =>
                    updateSchedule(
                      index,
                      'endTime',
                      date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                    )
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption='Chọn giờ kết thúc'
                  dateFormat='HH:mm'
                  timeFormat='HH:mm'
                  customInput={<Input />}
                />
              </div>
              <Button
                className='sm:w-auto w-full mt-[14px]'
                onClick={() => setSchedule(schedule.filter((_, i) => i !== index))}
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
        <Button className='mt-4' onClick={addSchedule}>
          Thêm lịch làm việc
        </Button>
      </div>

      <div className='flex gap-4'>
        <div className='w-full'>
          <Label>Khoảng giá</Label>
          <Select
            value={price.restaurant_price_option}
            onValueChange={(value: 'up' | 'down' | 'range') => setPrice({ ...price, restaurant_price_option: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn giá...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='up'>Trên</SelectItem>
              <SelectItem value='down'>Dưới</SelectItem>
              <SelectItem value='range'>Khoảng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {price.restaurant_price_option === 'up' && (
          <div className='w-full'>
            <Label>Giá trên</Label>
            <Input
              type='number'
              placeholder='Nhập giá trên'
              value={price.restaurant_price_amount}
              onChange={(e) => setPrice({ ...price, restaurant_price_amount: Number(e.target.value) })}
            />
          </div>
        )}
        {price.restaurant_price_option === 'down' && (
          <div className='w-full'>
            <Label>Giá dưới</Label>
            <Input
              type='number'
              placeholder='Nhập giá dưới'
              value={price.restaurant_price_amount}
              onChange={(e) => setPrice({ ...price, restaurant_price_amount: Number(e.target.value) })}
            />
          </div>
        )}
        {price.restaurant_price_option === 'range' && (
          <div className='flex gap-4 w-full'>
            <div className='w-full'>
              <Label>Từ</Label>
              <Input
                type='number'
                placeholder='Từ'
                value={price.restaurant_price_min}
                onChange={(e) => setPrice({ ...price, restaurant_price_min: Number(e.target.value) })}
              />
            </div>
            <div className='w-full'>
              <Label>Đến</Label>
              <Input
                type='number'
                placeholder='Đến'
                value={price.restaurant_price_max}
                onChange={(e) => setPrice({ ...price, restaurant_price_max: Number(e.target.value) })}
              />
            </div>
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <div className='w-full'>
          <Label>Tiện ích</Label>
          <MultiSelect
            options={listAmenity}
            onValueChange={setSelectedAmenity}
            defaultValue={selectedAmenity}
            placeholder='Chọn tiện ích'
            variant='inverted'
            animation={2}
            maxCount={5}
          />
        </div>
        <div className='w-full'>
          <Label>Loại hình nhà hàng</Label>
          <MultiSelect
            options={listRestaurantTypes}
            onValueChange={setSelectedRestaurantType}
            defaultValue={selectedRestaurantType}
            placeholder='Chọn loại hình nhà hàng'
            variant='inverted'
            animation={2}
            maxCount={5}
          />
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='flex flex-col gap-2 w-full mt-3'>
          <div className='flex justify-between items-end'>
            <Label>Mô tả nhà hàng</Label>
          </div>
          <EditorTiny editorRef={refOverview} height='500px' />
        </div>
        <div className='flex flex-col gap-2 w-full mt-3'>
          <div className='flex justify-between items-end'>
            <Label>Giới thiệu nhà hàng</Label>
          </div>
          <EditorTiny editorRef={refDescription} height='500px' />
        </div>
      </div>
    </div>
  )
}
