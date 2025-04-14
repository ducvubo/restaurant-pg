'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/input-password'
import { login, loginEmployee, searchRestaurant } from '../auth.api'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { endAppRestaurant, startAppRestaurant } from '../InforRestaurant.slice'
import { IRestaurant } from '../auth.interface'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { IEmployee } from '@/app/dashboard/(employee)/employees/employees.interface'
import { endAppEmployee, startAppEmployee } from '../InforEmployee.slice'
import { Card, CardContent } from '@/components/ui/card'

const FormSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Vui lòng nhập email' })
    .min(10, {
      message: 'Email không hợp lệ'
    })
    .email({ message: 'Email không hợp lệ' }),
  password: z.string().nonempty({ message: 'Vui lòng nhập password' }).min(8, {
    message: 'Mật khẩu có ít nhất 8 kí tự'
  })
})

interface IRestaurantSearch {
  restaurant_name: string
  _id: string
}

export function LoginForm() {
  const { setLoading } = useLoading()
  const { toast } = useToast()
  const dispatch = useDispatch()
  const router = useRouter()
  const [type, setType] = useState<'restaurant' | 'employee'>('restaurant')
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: 'vuducbo@gmail.com',
      password: 'Duc17052003*'
    }
  })

  const [open, setOpen] = useState(false)
  const [restaurantId, setRestaurantId] = useState('')

  const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurantSearch[]>([]) // Mảng tìm kiếm mặc định rỗng

  const handleRestaurantSearch = async (searchTerm: string) => {
    if (!searchTerm) setRestaurantId('')
    try {
      const restaurants: any = await searchRestaurant({ search: searchTerm })
      if (Array.isArray(restaurants)) {
        setFilteredRestaurants(restaurants) // Cập nhật danh sách nhà hàng được tìm kiếm
      } else {
        console.error('API did not return an array of restaurants:', restaurants)
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    }
  }

  const runAppRestaurant = (inforRestaurant: IRestaurant) => {
    dispatch(startAppRestaurant(inforRestaurant))
  }
  const runAppEmployee = (inforEmployee: IEmployee) => {
    dispatch(startAppEmployee(inforEmployee))
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // setLoading(true)
    if (type === 'restaurant') {
      const payload = {
        restaurant_email: data.email,
        restaurant_password: data.password
      }
      const res = await login(payload)
      if (res?.code === 0 && res.data) {
        setLoading(false)
        runAppRestaurant(res.data)
        dispatch(endAppEmployee(''))
        toast({
          title: 'Thành công',
          description: 'Đăng nhập thành công'
        })
        // router.push('/dashboard/order/dish')
        router.push(localStorage.getItem('currentUrl') || '/dashboard')
      } else if (res?.code === -5) {
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
      } else {
        setLoading(false)
        toast({
          title: 'Thất bại',
          description: res?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive'
        })
      }
    } else {
      const payload = {
        epl_email: data.email,
        epl_password: data.password,
        epl_restaurant_id: restaurantId
      }
      const res = await loginEmployee(payload)
      if (res?.code === 0 && res.data) {
        setLoading(false)
        runAppEmployee(res.data)
        dispatch(endAppRestaurant(''))
        toast({
          title: 'Thành công',
          description: 'Đăng nhập thành công'
        })
        router.push('/dashboard/order/dish')
      } else if (res?.code === -5) {
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
      } else {
        setLoading(false)
        toast({
          title: 'Thất bại',
          description: res?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <div className='flex justify-center items-center min-h-screen'>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-lg space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email...' {...field} className='input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='Password...' {...field} className='input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {type === 'employee' && (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
                      {restaurantId
                        ? filteredRestaurants.find((restaurant) => restaurant._id === restaurantId)?.restaurant_name
                        : 'Chọn nhà hàng...'}
                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput
                        placeholder='Tìm nhà hàng...'
                        className='h-9'
                        onInput={(e) => handleRestaurantSearch(e.currentTarget.value)}
                      />
                      <CommandList>
                        <div className='overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'>
                          {filteredRestaurants?.map((restaurant) => {
                            return (
                              <div
                                className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50'
                                onClick={() => {
                                  setRestaurantId(restaurant._id)
                                  setOpen(false)
                                }}
                              >
                                {restaurant.restaurant_name}
                              </div>
                            )
                          })}
                        </div>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}

              <RadioGroup value={type} onValueChange={(value: 'restaurant' | 'employee') => setType(value)}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='restaurant' id='r2' />
                  <Label htmlFor='r1'>Nhà hàng</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='employee' id='r1' />
                  <Label htmlFor='r2'>Nhân viên</Label>
                </div>
              </RadioGroup>
              <Button type='submit' className='btn-primary'>
                Đăng nhập
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
