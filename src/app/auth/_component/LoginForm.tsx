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
import { IEmployee } from '@/app/dashboard/(employee)/employees/employees.interface'
import { endAppEmployee, startAppEmployee } from '../InforEmployee.slice'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react' // Thêm icon loading từ lucide-react
import Image from 'next/image'

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
  const [isLoading, setIsLoading] = useState(false) // Thêm trạng thái loading
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: 'vuducbo@gmail.com',
      password: 'Duc17052003*'
    }
  })

  const [open, setOpen] = useState(false)
  const [restaurantId, setRestaurantId] = useState('')
  const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurantSearch[]>([])

  const handleRestaurantSearch = async (searchTerm: string) => {
    if (!searchTerm) setRestaurantId('')
    try {
      const restaurants: any = await searchRestaurant({ search: searchTerm })
      if (Array.isArray(restaurants)) {
        setFilteredRestaurants(restaurants)
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
    setIsLoading(true) // Bật trạng thái loading
    setLoading(true)

    if (type === 'restaurant') {
      const payload = {
        restaurant_email: data.email,
        restaurant_password: data.password
      }
      const res = await login(payload)
      if (res?.code === 0 && res.data) {
        setLoading(false)
        setIsLoading(false) // Tắt trạng thái loading
        runAppRestaurant(res.data)
        dispatch(endAppEmployee(''))
        toast({
          title: 'Thành công',
          description: 'Đăng nhập thành công'
        })
        router.push(localStorage.getItem('currentUrl') || '/dashboard/account')
      } else if (res?.code === -5) {
        setLoading(false)
        setIsLoading(false) // Tắt trạng thái loading
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
        setIsLoading(false) // Tắt trạng thái loading
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
        epl_restaurant_id: "677aac262fc0d1491a5ca032"
      }
      const res = await loginEmployee(payload)
      if (res?.code === 0 && res.data) {
        setLoading(false)
        setIsLoading(false) // Tắt trạng thái loading
        runAppEmployee(res.data)
        dispatch(endAppRestaurant(''))
        toast({
          title: 'Thành công',
          description: 'Đăng nhập thành công'
        })
        router.push('/dashboard/account')
      } else if (res?.code === -5) {
        setLoading(false)
        setIsLoading(false) // Tắt trạng thái loading
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
        setIsLoading(false) // Tắt trạng thái loading
        toast({
          title: 'Thất bại',
          description: res?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/logo-login.jpg')" }}>
      <Card className='p-2 w-96'>
        <CardContent>
          <Image src={'/images/logo.png'} alt='logo' width={200} height={200} className='mx-auto mb-2' />
          <h1 className='text-center font-bold text-2xl'>Hệ thống quản lý nhà hàng</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
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

              <RadioGroup className='py-3' value={type} onValueChange={(value: 'restaurant' | 'employee') => setType(value)}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='restaurant' id='r2' />
                  <Label htmlFor='r1'>Nhà hàng</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='employee' id='r1' />
                  <Label htmlFor='r2'>Nhân viên</Label>
                </div>
              </RadioGroup>

              <Button type='submit' className='btn-primary w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}