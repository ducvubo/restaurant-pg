'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Loader2, UploadIcon, X } from 'lucide-react'
import { InputTags } from '@/components/InputTag'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import EditorTiny from '@/components/EditorTiny'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/context/LoadingContext'
import { IBank, IResApiAddress, IRestaurant } from '@/app/auth/auth.interface'
import { ImageUrl } from '../../(food)/foods/_component/AddOrEdit'
import { updateInforRestaurant } from '../account.api'

interface IProps {
  inforRestaurant?: IRestaurant
}

export default function AddOrEdit({ inforRestaurant }: IProps) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [mode, setMode] = useState<'view' | 'edit'>('view') // New state for view/edit mode
  const [restaurant_name, setRestaurant_name] = useState(inforRestaurant?.restaurant_name || '')
  const [restaurant_phone, setRestaurant_phone] = useState(inforRestaurant?.restaurant_phone || '')
  const [provinces, setProvinces] = useState<IResApiAddress[]>([])
  const [districts, setDistricts] = useState<IResApiAddress[]>([])
  const [wards, setWards] = useState<IResApiAddress[]>([])
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(
    inforRestaurant?.restaurant_address.address_province || null
  )
  const [selectedDistrict, setSelectedDistrict] = useState<{ id: string; name: string } | null>(
    inforRestaurant?.restaurant_address.address_district || null
  )
  const [selectedWard, setSelectedWard] = useState<{ id: string; name: string } | null>(
    inforRestaurant?.restaurant_address.address_ward || null
  )
  const [address, setAddress] = useState(inforRestaurant?.restaurant_address.address_specific || '')
  const [schedule, setSchedule] = useState<{ day: string; startTime: string; endTime: string }[]>(
    inforRestaurant?.restaurant_hours.map((item) => ({
      day: item.day_of_week,
      startTime: item.open,
      endTime: item.close
    })) || []
  )
  const [price, setPrice] = useState<{
    restaurant_price_option: 'up' | 'down' | 'range'
    restaurant_price_min?: number
    restaurant_price_max?: number
    restaurant_price_amount?: number
  }>(
    inforRestaurant?.restaurant_price || {
      restaurant_price_option: 'up',
      restaurant_price_min: 0,
      restaurant_price_max: 0,
      restaurant_price_amount: 0
    }
  )
  const [uploadedUrlsBanner, setUploadedUrlsBanner] = useState<{
    image_cloud: string
    image_custom: string
  }>(inforRestaurant?.restaurant_banner || { image_cloud: '', image_custom: '' })
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const fileInputBannerRef = useRef<HTMLInputElement | null>(null)
  const [uploadedUrlsImage, setUploadedUrlsImage] = useState<
    { image_cloud: string; image_custom: string }[]
  >(inforRestaurant?.restaurant_image || [])
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputImageRef = useRef<HTMLInputElement | null>(null)
  const refOverview = useRef<any | null>(null)
  const refDescription = useRef<any | null>(null)
  const [listBank, setListBank] = useState<IBank[]>([])
  const [selectedBank, setSelectedBank] = useState<string>(inforRestaurant?.restaurant_bank.bank || '')
  const [stkBank, setStkBank] = useState(inforRestaurant?.restaurant_bank.account_number || '')
  const [nameBank, setNameBank] = useState(inforRestaurant?.restaurant_bank.account_name || '')
  const [amenities, setAmenities] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (inforRestaurant) {
      if (inforRestaurant.restaurant_overview) {
        refOverview.current = inforRestaurant.restaurant_overview
      }
      if (inforRestaurant.restaurant_description) {
        refDescription.current = inforRestaurant.restaurant_description
      }
      if (inforRestaurant.restaurant_metadata) {
        const metaData = JSON.parse(inforRestaurant.restaurant_metadata)
        if (metaData.amenities) {
          setAmenities(metaData.amenities)
        }
        if (metaData.tags) {
          setTags(metaData.tags)
        }
      }
    }
  }, [inforRestaurant, mode])

  useEffect(() => {
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data)
        }
      })
    getListBank()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince.id}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setDistricts(data.data)
            setWards([])
            const district = data.data.find((d: { id: string }) => d.id === selectedDistrict?.id)
            if (district) {
              setSelectedDistrict({ id: district.id, name: district.full_name })
            } else {
              setSelectedDistrict(null)
            }
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
            const ward = data.data.find((w: { id: string }) => w.id === selectedWard?.id)
            if (ward) {
              setSelectedWard({ id: ward.id, name: ward.full_name })
            } else {
              setSelectedWard(null)
            }
          }
        })
    }
  }, [selectedDistrict])

  const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']

  const getListBank = async () => {
    fetch(`https://api.vietqr.io/v2/banks`)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === '00') {
          setListBank(data.data)
        }
      })
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
        headers: { folder_type: type },
        body: formData
      })
    ).json()
    return res
  }

  const handleFileChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingImage(true)
      const uploadedImages: { image_cloud: string; image_custom: string }[] = []
      for (const file of files) {
        try {
          const url = await uploadImage(file, 'restaurant_image')
          if (url.statusCode === 201 && url.data?.image_cloud) {
            uploadedImages.push(url.data)
          }
        } catch (error) {
          console.error('Error uploading file:', file.name, error)
        }
      }
      setUploadedUrlsImage((prev) => [...prev, ...uploadedImages])
      setIsUploadingImage(false)
    }
  }

  const handleFileChangeBanner = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingBanner(true)
      if (files.length > 1) {
        toast({
          title: 'Thất bại',
          description: 'Chỉ được chọn 1 ảnh!',
          variant: 'destructive'
        })
        setIsUploadingBanner(false)
        return
      }
      const res: IBackendRes<ImageUrl> = await uploadImage(files[0], 'restaurant_banner')
      if (res.statusCode === 201 && res.data) {
        setUploadedUrlsBanner(res.data)
        setIsUploadingBanner(false)
      } else {
        toast({
          title: 'Thất bại',
          description: 'Upload ảnh thất bại!',
          variant: 'destructive'
        })
        setIsUploadingBanner(false)
      }
    }
  }

  const removeImage = (index: number) => {
    setUploadedUrlsImage((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async () => {
    const restaurant_hours = schedule.map((item) => ({
      day_of_week: item.day,
      open: item.startTime,
      close: item.endTime
    }))
    const data: Partial<IRestaurant | unknown> = {
      restaurant_name,
      restaurant_phone,
      restaurant_banner: uploadedUrlsBanner,
      restaurant_address: {
        address_province: selectedProvince,
        address_district: selectedDistrict,
        address_ward: selectedWard,
        address_specific: address
      },
      restaurant_price: price,
      restaurant_image: uploadedUrlsImage,
      restaurant_hours,
      restaurant_overview: refOverview.current.getContent(),
      restaurant_description: refDescription.current.getContent(),
      restaurant_bank: {
        bank: selectedBank,
        account_number: stkBank,
        account_name: nameBank
      },
      restaurant_metadata: JSON.stringify({ amenities, tags })
    }
    setLoading(true)
    const res: IBackendRes<IRestaurant> = await updateInforRestaurant(data)
    setLoading(false)
    if (res.statusCode === 201 || res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin nhà hàng thành công!',
        variant: 'default'
      })
      setMode('view') // Switch to view mode after successful update
      window.location.reload()
    } else if (res.statusCode === 400) {
      if (Array.isArray(res.message)) {
        res.message.map((item: string) =>
          toast({ title: 'Thất bại', description: item, variant: 'destructive' })
        )
      } else {
        toast({ title: 'Thất bại', description: res.message, variant: 'destructive' })
      }
    } else if (res.statusCode === 409) {
      toast({ title: 'Thất bại', description: res.message, variant: 'destructive' })
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
        title: 'Thất bại',
        description: 'Cập nhật thông tin nhà hàng thất bại, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const groupHoursByDay = (hours: { close: string; open: string; day_of_week: string }[]) => {
    const grouped: { [key: string]: { open: string; close: string }[] } = {}
    hours.forEach((hour) => {
      if (!grouped[hour.day_of_week]) {
        grouped[hour.day_of_week] = []
      }
      grouped[hour.day_of_week].push({ open: hour.open, close: hour.close })
    })
    return Object.keys(grouped).map((day) => ({
      day_of_week: day,
      times: grouped[day]
    }))
  }

  // Render view mode as a table
  const renderViewMode = () => {
    const bank = listBank.find((b) => b.bin === selectedBank)
    const priceDisplay =
      price.restaurant_price_option === 'range'
        ? `${price.restaurant_price_min} - ${price.restaurant_price_max}`
        : price.restaurant_price_option === 'up'
          ? `Trên ${price.restaurant_price_amount}`
          : `Dưới ${price.restaurant_price_amount}`

    return (
      <div className='space-y-6'>
        <div className='flex justify-end'>
          <Button onClick={() => setMode('edit')}>Chỉnh sửa</Button>
        </div>
        <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
          <tbody>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên nhà hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{restaurant_name}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số điện thoại</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{restaurant_phone}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngân hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{bank?.name || selectedBank}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số tài khoản</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{stkBank}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên tài khoản</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{nameBank}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Địa chỉ</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {`${address}, ${selectedWard?.name || ''}, ${selectedDistrict?.name || ''}, ${selectedProvince?.name || ''}`}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Lịch làm việc</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {schedule.length > 0 ? (
                  <ul className='list-disc ml-4 mt-2'>
                    {inforRestaurant && groupHoursByDay(inforRestaurant?.restaurant_hours).map((item, index) => (
                      <li key={index} className='text-xs md:text-sm font-semibold'>
                        {item.day_of_week}:
                        <span className='font-normal'>
                          {item.times.map((time, idx) => (
                            <span key={idx} className='ml-1'>
                              {time.open} - {time.close}
                              {idx < item.times.length - 1 && ' và '}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Chưa có lịch làm việc'
                )}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Khoảng giá</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{priceDisplay}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tiện ích</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {amenities.length > 0 ? amenities.join(', ') : 'Chưa có tiện ích'}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tag</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {tags.length > 0 ? tags.join(', ') : 'Chưa có tag'}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh nhà hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {uploadedUrlsImage.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {uploadedUrlsImage.map((url, index) => (
                      <div key={index} className='relative w-24 h-24'>
                        <Image
                          src={url.image_cloud}
                          alt={`Image ${index + 1}`}
                          fill
                          className='object-cover rounded-md'
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  'Chưa có ảnh'
                )}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Banner nhà hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {uploadedUrlsBanner.image_cloud ? (
                  <div className='relative w-24 h-24'>
                    <Image
                      src={uploadedUrlsBanner.image_cloud}
                      alt='Banner'
                      fill
                      className='object-cover rounded-md'
                    />
                  </div>
                ) : (
                  'Chưa có banner'
                )}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả nhà hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: inforRestaurant?.restaurant_overview || 'Chưa có mô tả'
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giới thiệu nhà hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: inforRestaurant?.restaurant_description || 'Chưa có giới thiệu'
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // Render edit mode (original form)
  const renderEditMode = () => (
    <div>
      <div className='flex justify-end mb-4 gap-2'>
        <div className=''>
          {isUploadingBanner || isUploadingImage ? (
            <Button className='w-full'>
              <Loader2 className='animate-spin' />
            </Button>
          ) : (
            <Button onClick={onSubmit} className='w-full'>
              Lưu
            </Button>
          )}
        </div>
        <Button onClick={() => setMode('view')}>Xem thông tin</Button>
      </div>
      {/* Original form content */}
      <div>
        <h1 className='-mb-3'>Ảnh nhà hàng</h1>
        <div className='flex gap-2'>
          <div
            onClick={() => fileInputImageRef.current?.click()}
            className='mt-4 relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 focus-within:outline-2 focus-within:outline-dashed focus-within:outline-gray-500 dark:focus-within:outline-gray-400'
          >
            <div className='text-center'>
              {isUploadingImage ? (
                <Loader2 className='animate-spin' />
              ) : (
                <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
              )}
              <Input
                ref={fileInputImageRef}
                id='uploadBanner'
                type='file'
                accept='image/*'
                multiple
                onChange={handleFileChangeImage}
                disabled={isUploadingImage}
                className='sr-only'
              />
            </div>
          </div>
          {uploadedUrlsImage.length > 0 && (
            <div className='mt-4'>
              <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4'>
                {uploadedUrlsImage.map((url, index) => (
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
                      onClick={() => removeImage(index)}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
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

      <div className='mt-4'>
        <h1 className='-mb-3'>Banner nhà hàng</h1>
        <div className='flex gap-2'>
          <div
            onClick={() => fileInputBannerRef.current?.click()}
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
                id='uploadAvatar'
                type='file'
                accept='image/*'
                onChange={handleFileChangeBanner}
                disabled={isUploadingBanner}
                className='sr-only'
              />
            </div>
          </div>
          {uploadedUrlsBanner.image_cloud && (
            <div className='relative h-24 mt-4 sm:h-32 md:h-36 aspect-square rounded-md border-2 border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'>
              <Image src={uploadedUrlsBanner.image_cloud} alt={`vuducbo`} fill className='object-cover rounded-md' />
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
            defaultValue={restaurant_name}
          />
        </div>
        <div className='w-full'>
          <Label>Số điện thoại</Label>
          <Input
            placeholder='Nhập số điện thoại'
            className='w-full'
            onChange={(e) => setRestaurant_phone(e.target.value)}
            defaultValue={restaurant_phone}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <div>
          <Label>Tên ngân hàng</Label>
          <Select
            value={selectedBank || ''}
            onValueChange={(value) => {
              const bank = listBank.find((p) => p.bin === value)
              setSelectedBank(bank ? bank.bin : '')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn ngân hàng...' />
            </SelectTrigger>
            <SelectContent>
              {listBank.map((bank) => (
                <SelectItem key={bank.bin} value={bank.bin}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Số tài khoản</Label>
          <Input
            placeholder='Nhập số tài khoản'
            className='w-full'
            onChange={(e) => setStkBank(e.target.value)}
            defaultValue={stkBank}
          />
        </div>
        <div>
          <Label>Tên Tài khoản</Label>
          <Input
            placeholder='Tên tài khoản'
            className='w-full'
            onChange={(e) => setNameBank(e.target.value)}
            defaultValue={nameBank}
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
          <InputTags
            value={amenities}
            onChange={setAmenities}
            placeholder='Nhập tiện ích (ví dụ: Wifi, Điều hòa, Bãi đỗ xe)'
          />
        </div>
        <div className='w-full'>
          <Label>Tag</Label>
          <InputTags
            value={tags}
            onChange={setTags}
            placeholder='Nhập tag (ví dụ: Ẩm thực, Đồ uống, Món ăn đặc trưng)'
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
  return <div>{mode === 'view' ? renderViewMode() : renderEditMode()}</div>
}