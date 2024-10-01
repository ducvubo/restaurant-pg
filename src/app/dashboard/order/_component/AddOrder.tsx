import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { use, useActionState, useEffect, useState } from 'react'
import { ITable } from '../../tables/table.interface'
import { getListOrdring, getListTableOrder } from '../order.api'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IDish } from '../../dishes/dishes.interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { lishDishOrder } from '@/app/guest/guest.api'
import { IOrderRestaurant } from '../order.interface'
import { z } from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MdDeleteForever } from 'react-icons/md'
import { IoMdAddCircle } from 'react-icons/io'
const FormSchema = z.object({
  list_dist: z.array(
    z.object({
      od_dish_id: z.string({
        required_error: 'Please select a language.'
      }),
      od_dish_quantity: z.number({ message: 'Please select a quantity' })
    })
  )
})

export default function AddOrder() {
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const [type, setType] = useState<'order' | 'new_order'>('order')
  const [listTable, setListTable] = useState<ITable[]>([])
  const [listDish, setListDish] = useState<Omit<IDish, 'dish_status' | 'isDeleted'>[]>([])
  const [listOrdering, setListOrdering] = useState<IOrderRestaurant[]>([])
  const [openTable, setOpenTable] = useState(false)
  const [tableId, setTableId] = useState('')
  const [openOrdering, setOpenOrdering] = useState(false)
  const [orderId, setOrderId] = useState('')
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      list_dist: [{ od_dish_id: '', od_dish_quantity: 1 }]
    }
  })

  const { reset, watch, control, setValue } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'list_dist'
  })
  const listTableOrder = async () => {
    const res: IBackendRes<ITable[]> = await getListTableOrder()
    if (res.statusCode === 200 && res.data) {
      setListTable(res.data)
    } else if (res.code === -10) {
      setListTable([])
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListTable([])
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListTable([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const getListDish = async () => {
    try {
      const res: IBackendRes<Omit<IDish, 'dish_status' | 'isDeleted'>[]> = await lishDishOrder({
        guest_restaurant_id: inforEmployee.epl_restaurant_id ? inforEmployee.epl_restaurant_id : inforRestaurant._id
      })
      if (res.statusCode === 200 && res.data) {
        setListDish(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const ListOrdering = async () => {
    const res: IBackendRes<IOrderRestaurant[]> = await getListOrdring()
    if (res.statusCode === 200 && res.data) {
      setListOrdering(res.data)
    } else if (res.code === -10) {
      setListOrdering([])
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListOrdering([])
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListOrdering([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    getListDish()
  }, [inforEmployee, inforRestaurant])

  useEffect(() => {
    if (type === 'new_order') {
      setOrderId('')
      listTableOrder()
    }
    if (type === 'order') {
      setTableId('')
      ListOrdering()
    }
  }, [type])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('data::::::', data)
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   )
    // })
  }


  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Gọi món</Button>
        </DialogTrigger>
        <DialogContent className='w-auto'>
          <DialogHeader>
            <DialogTitle>Gọi món</DialogTitle>
            <DialogDescription>Khi bạn gọi món ở đây, tên khách sẽ là tên của bạn</DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={type}
            onValueChange={(value: 'order' | 'new_order') => setType(value)}
            className='flex gap-5'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='order' id='r2' />
              <Label htmlFor='r1'>Thêm món cho bàn hiện tại</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='new_order' id='r1' />
              <Label htmlFor='r2'>Thêm món cho bàn mới</Label>
            </div>
          </RadioGroup>

          {type === 'new_order' ? (
            <Popover open={openTable} onOpenChange={setOpenTable}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={openTable}
                  className='w-[400px] justify-between'
                >
                  {tableId ? listTable.find((table) => table._id === tableId)?.tbl_name : 'Chọn bàn'}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[400px] p-0'>
                <Command>
                  <CommandInput placeholder='Nhập tên bàn' className='h-9' />
                  <CommandList>
                    <CommandEmpty>Không có bàn nào</CommandEmpty>
                    <CommandGroup>
                      {listTable.map((table) => (
                        <CommandItem
                          key={table._id}
                          value={table._id}
                          onSelect={(currentValue) => {
                            setTableId(currentValue === tableId ? '' : currentValue)
                            setOpenTable(false)
                          }}
                        >
                          {table.tbl_name}
                          <CheckIcon
                            className={cn('ml-auto h-4 w-4', tableId === table._id ? 'opacity-100' : 'opacity-0')}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Popover open={openOrdering} onOpenChange={setOpenOrdering}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={openOrdering}
                  className='w-[400px] justify-between'
                >
                  {orderId
                    ? `${listOrdering.find((order) => order._id === orderId)?.od_dish_smr_table_id.tbl_name} : ${
                        listOrdering.find((order) => order._id === orderId)?.od_dish_smr_guest_id.guest_name
                      }`
                    : 'Chọn bàn'}
                  {/* {orderId
                    ? listOrdering.find((order) => order._id === orderId)?.od_dish_smr_table_id.tbl_name
                    : 'Chọn bàn'} */}

                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[400px] p-0'>
                <Command>
                  <CommandInput placeholder='Nhập tên bàn' className='h-9' />
                  <CommandList>
                    <CommandEmpty>Không có order nào</CommandEmpty>
                    <CommandGroup>
                      {listOrdering.map((order) => (
                        <CommandItem
                          key={order._id}
                          value={order._id}
                          onSelect={(currentValue) => {
                            setOrderId(currentValue === orderId ? '' : currentValue)
                            setOpenOrdering(false)
                          }}
                        >
                          {order.od_dish_smr_table_id.tbl_name} : {order.od_dish_smr_guest_id.guest_name}
                          <CheckIcon
                            className={cn('ml-auto h-4 w-4', orderId === order._id ? 'opacity-100' : 'opacity-0')}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='w-full'>
                {fields.map((item, index) => (
                  <div key={index} className='flex gap-4 w-[400px]'>
                    <Controller
                      name={`list_dist.${index}.od_dish_id`}
                      control={control}
                      render={({ field }) => (
                        <FormItem className='flex flex-col mt-3 w-80'>
                          <FormLabel>Món ăn</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                >
                                  {field.value
                                    ? listDish.find((dish) => dish._id === field.value)?.dish_name
                                    : 'Chọn món ăn'}
                                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[280px] p-0'>
                              <Command>
                                <CommandInput placeholder='Tìm kiếm món ăn...' className='h-9' />
                                <CommandList>
                                  <CommandEmpty>Không tìm thấy món ăn.</CommandEmpty>
                                  <CommandGroup>
                                    {listDish.map((dish) => (
                                      <CommandItem
                                        value={dish.dish_name}
                                        key={dish._id}
                                        onSelect={() => {
                                          form.setValue(`list_dist.${index}.od_dish_id`, dish._id)
                                        }}
                                      >
                                        {dish.dish_name}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            dish._id === field.value ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Controller
                      name={`list_dist.${index}.od_dish_quantity`}
                      control={control}
                      render={({ field }) => (
                        <FormItem className='w-20'>
                          <FormLabel>Số lượng</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Số lượng' type='number' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <span onClick={() => remove(index)} className='mt-10 cursor-pointer ml-2'>
                        <MdDeleteForever />
                      </span>
                    )}
                    <span
                      onClick={() => {
                        append({
                          od_dish_id: '',
                          od_dish_quantity: 1
                        })
                      }}
                      className='mt-10 cursor-pointer'
                    >
                      <IoMdAddCircle />
                    </span>
                  </div>
                ))}
              </div>
              <Button type='submit'>Submit</Button>
            </form>
          </Form>

          {/* <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
