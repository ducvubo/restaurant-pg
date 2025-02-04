'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createStockIn, findEmployeeName, findIngredientName, findSupplierName, updateStockIn } from '../stock-in.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IStockIn, IStockInItem } from '../stock-in.interface'
import { ISupplier } from '../../suppliers/supplier.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { IEmployee } from '../../../(employee)/employees/employees.interface'
import { RootState } from '@/app/redux/store'
import { useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { IIngredient } from '../../ingredients/ingredient.interface'
import { InputNoBoder } from '@/components/CustomInputNoBoder'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { Loader2, TrashIcon } from 'lucide-react'

interface Props {
  id: string
  inforStockIn?: IStockIn
}
const FormSchema = z.object({
  stki_code: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  spli_id: z.string().nonempty({ message: 'Vui lòng chọn nhà cung cấp' }),
  stki_delivery_name: z.string().nonempty({ message: 'Vui lòng nhập tên người giao hàng' }),
  stki_delivery_phone: z.string().nonempty({ message: 'Vui lòng nhập số điện thoại người giao hàng' }),
  stki_date: z.date({ message: 'Vui lòng chọn ngày nhập' }),
  stki_note: z.string(),
  stki_payment_method: z.enum(['cash', 'transfer', 'credit_card'], { message: 'Vui lòng chọn phương thức thanh toán' }),
  stki_receiver: z.string().nonempty({ message: 'Vui lòng chọn người nhận' }),
  stki_image: z.string().optional()
})

export default function AddOrEdit({ id, inforStockIn }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const [listSuppliers, setListSuppliers] = useState<ISupplier[]>([])
  const [listEmployees, setListEmployees] = useState<IEmployee[]>([])
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([])
  const [stockInItems, setStockInItems] = useState<IStockInItem[]>([])
  const [selectedIngredient, setSelectedIngredient] = useState<IIngredient | null>(null)
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
      stki_code: inforStockIn?.stki_code || '',
      spli_id: inforStockIn?.spli_id || '',
      stki_delivery_name: inforStockIn?.stki_delivery_name || '',
      stki_delivery_phone: inforStockIn?.stki_delivery_phone || '',
      stki_receiver: inforStockIn?.stki_receiver || '',
      stki_date: inforStockIn?.stki_date ? new Date(inforStockIn.stki_date) : new Date(),
      stki_note: inforStockIn?.stki_note || '',
      stki_payment_method: inforStockIn?.stki_payment_method || 'cash'
    }
  })

  useEffect(() => {
    findAllSuppliers()
    findAllEmployees()
    findAllIngredient()
  }, [])

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforStockIn) {
        if (inforStockIn.items) {
          //tìm tên nguyên liệu và đơn vị đo cho từng item
          inforStockIn.items.forEach((item) => {
            const ingredient = listIngredients.find((ingredient) => ingredient.igd_id === item.igd_id)
            if (ingredient) {
              ;(item.igd_name = ingredient.igd_name),
                (item.unt_name = typeof ingredient.unt_id !== 'string' ? ingredient.unt_id?.unt_name || '' : '')
            }
          })
          setStockInItems(inforStockIn.items)
        }
        if (inforStockIn.stki_image) {
          setImage({
            image_cloud: JSON.parse(inforStockIn.stki_image).image_cloud,
            image_custom: JSON.parse(inforStockIn.stki_image).image_custom
          })
        }
      }
    }
  }, [inforStockIn, id, listIngredients])

  useEffect(() => {
    const infor = inforRestaurant?._id ? inforRestaurant : inforEmployee
    if (infor?.restaurant_id) {
      const listEpl = [...listEmployees]
      listEpl.push({
        _id: infor.restaurant_id,
        restaurant_id: infor.restaurant_id,
        epl_name: 'Chủ nhà hàng',
        epl_address: '',
        epl_email: '',
        epl_gender: 'Khác',
        epl_phone: '',
        epl_restaurant_id: '',
        epl_status: '',
        epl_avatar: {
          image_cloud: '',
          image_custom: ''
        }
      })
      setListEmployees(listEpl)
    }
  }, [inforEmployee, inforRestaurant])

  const findAllSuppliers = async () => {
    const res: IBackendRes<ISupplier[]> = await findSupplierName()
    if (res.statusCode === 200 && res.data) {
      setListSuppliers(res.data)
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

  const findAllEmployees = async () => {
    const res: IBackendRes<IEmployee[]> = await findEmployeeName()
    if (res.statusCode === 200 && res.data) {
      setListEmployees(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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

  const findAllIngredient = async () => {
    const res: IBackendRes<IIngredient[]> = await findIngredientName()
    if (res.statusCode === 200 && res.data) {
      setListIngredients(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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

  const calculateTotal = (items: IStockInItem[]) => {
    return items.reduce((total, item) => {
      return total + item.stki_item_quantity_real * item.stki_item_price
    }, 0)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (stockInItems.length === 0) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng thêm nguyên liệu cho hóa đơn nhập hàng',
        variant: 'destructive'
      })
      return
    }

    const stockInItemsClone = stockInItems.map((item) => {
      const { igd_name, unt_name, ...rest } = item
      return rest
    })

    const infor = inforRestaurant?._id ? inforRestaurant : inforEmployee
    let stki_receiver_type: 'employee' | 'restaurant' = 'employee'
    if (data.stki_receiver === infor.restaurant_id) {
      stki_receiver_type = 'restaurant'
    }
    setLoading(true)
    const payload = {
      stki_code: data.stki_code,
      spli_id: data.spli_id,
      stki_delivery_name: data.stki_delivery_name,
      stki_delivery_phone: data.stki_delivery_phone,
      stki_receiver: data.stki_receiver,
      stki_date: data.stki_date,
      stki_note: data.stki_note,
      stki_receiver_type: stki_receiver_type,
      stki_payment_method: data.stki_payment_method,
      stki_image: JSON.stringify(image),
      stock_in_items: stockInItemsClone
    }
    const res = id === 'add' ? await createStockIn(payload) : await updateStockIn({ ...payload, stki_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description:
          id === 'add' ? 'Thêm hóa đơn nhập hàng mới thành công' : 'Chỉnh sửa thông tin hóa đơn nhập hàng thành công',
        variant: 'default'
      })
      router.push('/dashboard/stock-in')
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
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel defaultSize={75} className='p-4'>
            <Select
              value={selectedIngredient?.igd_id}
              onValueChange={(e) => {
                const stockInItemsClone = [...stockInItems]
                const ingredient = listIngredients.find((item) => item.igd_id === e)
                if (!ingredient) return
                stockInItemsClone.push({
                  igd_id: ingredient.igd_id,
                  igd_name: ingredient.igd_name,
                  unt_name: typeof ingredient.unt_id !== 'string' ? ingredient.unt_id?.unt_name || '' : '',
                  stki_item_quantity: 0,
                  stki_item_quantity_real: 0,
                  stki_item_price: 0
                })
                // const listIngredientsClone = listIngredients.filter((item) => item.igd_id !== e)
                // setListIngredients(listIngredientsClone)
                setStockInItems(stockInItemsClone)
                setSelectedIngredient(null)
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn nguyên liệu...' />
              </SelectTrigger>
              <SelectContent>
                {listIngredients
                  .filter((ingredient) => stockInItems.every((item) => item.igd_id !== ingredient.igd_id))
                  .map((ingredient) => (
                    <SelectItem key={ingredient.igd_id} value={ingredient.igd_id}>
                      {ingredient.igd_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Table>
              <TableCaption>Danh sách nguyên liệu</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nguyên liệu</TableHead>
                  <TableHead>Đơn vị đo</TableHead>
                  <TableHead>Số lượng trên hóa đơn</TableHead>
                  <TableHead>Số lượng thực tế</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockInItems.map((stockInItem, index) => (
                  <TableRow key={index}>
                    <TableCell className='w-2/5'>
                      <div className='flex gap-2'>
                        <span
                          className='cursor-pointer text-red-500'
                          onClick={() => {
                            const updatedItems = [...stockInItems]
                            updatedItems.splice(index, 1)
                            setStockInItems(updatedItems)
                          }}
                        >
                          <TrashIcon size={17} />
                        </span>
                        <span>{stockInItem.igd_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stockInItem.unt_name}</TableCell>
                    <TableCell>
                      <InputNoBoder
                        value={stockInItem.stki_item_quantity}
                        type='number'
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) return
                          const updatedItems = [...stockInItems]
                          updatedItems[index].stki_item_quantity = Number(e.target.value)
                          setStockInItems(updatedItems)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNoBoder
                        value={stockInItem.stki_item_quantity_real}
                        type='number'
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) return
                          const updatedItems = [...stockInItems]
                          updatedItems[index].stki_item_quantity_real = Number(e.target.value)
                          setStockInItems(updatedItems)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNoBoder
                        value={stockInItem.stki_item_price}
                        type='number'
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) return
                          const updatedItems = [...stockInItems]
                          updatedItems[index].stki_item_price = Number(e.target.value)
                          setStockInItems(updatedItems)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {(stockInItem.stki_item_quantity_real * stockInItem.stki_item_price).toLocaleString()}đ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Tổng tiền: </TableCell>
                  <TableCell className='font-bold'>{calculateTotal(stockInItems).toLocaleString()}đ</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} className='p-4'>
            <div>
              <FormField
                control={form.control}
                name='stki_image'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Ảnh hóa đơn</FormLabel>
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
                      form.setValue('stki_image', '')
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
              name='spli_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhà cung cấp</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn nhà cung cấp...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listSuppliers.map((supplier) => (
                        <SelectItem key={supplier.spli_id} value={supplier.spli_id}>
                          {supplier.spli_name}
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
              name='stki_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã phiếu nhập</FormLabel>
                  <FormControl>
                    <Input placeholder='Mã phiếu nhập...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_delivery_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người giao hàng</FormLabel>
                  <FormControl>
                    <Input placeholder='Người giao hàng...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_delivery_phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại người giao hàng</FormLabel>
                  <FormControl>
                    <Input placeholder='Số điện thoại người giao hàng...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_receiver'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người nhận</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn người nhận...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listEmployees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.epl_name}
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
              name='stki_note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập ghi chú</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập ghi chú...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_payment_method'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương thức thanh toán</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn phương thức thanh toán...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='cash'>Tiền mặt</SelectItem>
                      <SelectItem value='transfer'>Chuyển khoản</SelectItem>
                      <SelectItem value='credit_card'>Thẻ tín dụng</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_date'
              render={({ field }) => (
                <FormItem className='flex flex-col mt-2'>
                  <FormLabel>Ngày nhập</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày nhập</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-center mt-3'>
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
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
    </Form>
  )
}
