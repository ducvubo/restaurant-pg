'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/input-password'
import { changePassword, login, loginEmployee, searchRestaurant, sendOtpChangePassword } from '../auth.api'
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
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

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

  const [isOtpLoading, setIsOtpLoading] = useState(false)
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false)
  const [openSendOtp, setOpenSendOtp] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)

  // State for Send OTP dialog
  const [otpEmail, setOtpEmail] = useState('')
  const [otpAccountType, setOtpAccountType] = useState<'restaurant' | 'employee'>('restaurant')
  const [otpEmailError, setOtpEmailError] = useState('')
  const [otpAccountTypeError, setOtpAccountTypeError] = useState('')

  // State for Change Password dialog
  const [changeEmail, setChangeEmail] = useState('')
  const [changeAccountType, setChangeAccountType] = useState<'restaurant' | 'employee'>('restaurant')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changeEmailError, setChangeEmailError] = useState('')
  const [changeAccountTypeError, setChangeAccountTypeError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

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

  async function handleSendOtpClick() {
    // Reset errors
    setOtpEmailError('')
    setOtpAccountTypeError('')

    // Validate inputs
    let hasError = false
    if (!otpEmail) {
      setOtpEmailError('Vui lòng nhập email')
      hasError = true
    } else if (!z.string().email().safeParse(otpEmail).success) {
      setOtpEmailError('Email không hợp lệ')
      hasError = true
    }
    if (!otpAccountType) {
      setOtpAccountTypeError('Vui lòng chọn loại tài khoản')
      hasError = true
    }

    if (hasError) return

    setIsOtpLoading(true)
    try {
      const res = await sendOtpChangePassword(otpEmail, otpAccountType)
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: 'Thành công',
          description: 'Mã OTP đã được gửi đến email của bạn'
        })
        setOtpEmail('')
        setOtpAccountType('restaurant')
        setOpenSendOtp(false)
      } else {
        toast({
          title: 'Thất bại',
          description: res.message || 'Không thể gửi mã OTP, vui lòng thử lại',
          variant: 'destructive'
        })
      }
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description: error.message || 'Không thể gửi mã OTP, vui lòng thử lại',
        variant: 'destructive'
      })
    } finally {
      setIsOtpLoading(false)
    }
  }

  async function handleChangePasswordClick() {
    // Reset errors
    setChangeEmailError('')
    setChangeAccountTypeError('')
    setOtpError('')
    setNewPasswordError('')
    setConfirmPasswordError('')

    // Validate inputs
    let hasError = false
    if (!changeEmail) {
      setChangeEmailError('Vui lòng nhập email')
      hasError = true
    } else if (!z.string().email().safeParse(changeEmail).success) {
      setChangeEmailError('Email không hợp lệ')
      hasError = true
    }
    if (!changeAccountType) {
      setChangeAccountTypeError('Vui lòng chọn loại tài khoản')
      hasError = true
    }
    if (!otp) {
      setOtpError('Vui lòng nhập mã OTP')
      hasError = true
    } else if (otp.length !== 6) {
      setOtpError('Mã OTP phải có 6 chữ số')
      hasError = true
    }
    if (!newPassword) {
      setNewPasswordError('Vui lòng nhập mật khẩu mới')
      hasError = true
    } else if (newPassword.length < 8) {
      setNewPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự')
      hasError = true
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng nhập xác nhận mật khẩu')
      hasError = true
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp')
      hasError = true
    }

    if (hasError) return

    setIsPasswordChangeLoading(true)
    try {
      const res = await changePassword(changeEmail, changeAccountType, otp, newPassword)
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: 'Thành công',
          description: 'Đổi mật khẩu thành công'
        })
        setChangeEmail('')
        setChangeAccountType('restaurant')
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
        setOpenChangePassword(false)
      } else {
        toast({
          title: 'Thất bại',
          description: res.message || 'Không thể đổi mật khẩu, vui lòng thử lại',
          variant: 'destructive'
        })
      }
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description: error.message || 'Không thể đổi mật khẩu, vui lòng thử lại',
        variant: 'destructive'
      })
    } finally {
      setIsPasswordChangeLoading(false)
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

              <div className='flex justify-between'>
                <AlertDialog open={openSendOtp} onOpenChange={setOpenSendOtp}>
                  <AlertDialogTrigger asChild>
                    <Button variant="link" className="text-blue-600 p-0">Gửi mã OTP</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Gửi mã OTP</AlertDialogTitle>
                      <AlertDialogDescription>
                        Nhập email và chọn loại tài khoản để nhận mã OTP.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='otp-email'>Email</Label>
                        <Input
                          id='otp-email'
                          placeholder='Email...'
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                        />
                        {otpEmailError && <p className='text-sm text-red-600 mt-1'>{otpEmailError}</p>}
                      </div>
                      <div>
                        <Label>Loại tài khoản</Label>
                        <RadioGroup
                          value={otpAccountType}
                          onValueChange={(value: 'restaurant' | 'employee') => setOtpAccountType(value)}
                          className='py-3'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='restaurant' id='otp_r1' />
                            <Label htmlFor='otp_r1'>Nhà hàng</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='employee' id='otp_r2' />
                            <Label htmlFor='otp_r2'>Nhân viên</Label>
                          </div>
                        </RadioGroup>
                        {otpAccountTypeError && <p className='text-sm text-red-600 mt-1'>{otpAccountTypeError}</p>}
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          onClick={handleSendOtpClick}
                          disabled={isOtpLoading}
                        >
                          {isOtpLoading ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Đang gửi OTP...
                            </>
                          ) : (
                            'Gửi OTP'
                          )}
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => {
                            setOtpEmail('')
                            setOtpAccountType('restaurant')
                            setOtpEmailError('')
                            setOtpAccountTypeError('')
                            setOpenSendOtp(false)
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={openChangePassword} onOpenChange={setOpenChangePassword}>
                  <AlertDialogTrigger asChild>
                    <Button variant="link" className="text-blue-600 p-0">Đổi mật khẩu</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Đặt lại mật khẩu</AlertDialogTitle>
                      <AlertDialogDescription>
                        Nhập email, mã OTP, mật khẩu mới và xác nhận mật khẩu.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='change-email'>Email</Label>
                        <Input
                          id='change-email'
                          placeholder='Email...'
                          value={changeEmail}
                          onChange={(e) => setChangeEmail(e.target.value)}
                        />
                        {changeEmailError && <p className='text-sm text-red-600 mt-1'>{changeEmailError}</p>}
                      </div>
                      <div>
                        <Label>Loại tài khoản</Label>
                        <RadioGroup
                          value={changeAccountType}
                          onValueChange={(value: 'restaurant' | 'employee') => setChangeAccountType(value)}
                          className='py-3'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='restaurant' id='change_r1' />
                            <Label htmlFor='change_r1'>Nhà hàng</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='employee' id='change_r2' />
                            <Label htmlFor='change_r2'>Nhân viên</Label>
                          </div>
                        </RadioGroup>
                        {changeAccountTypeError && <p className='text-sm text-red-600 mt-1'>{changeAccountTypeError}</p>}
                      </div>
                      <div>
                        <Label htmlFor='otp'>Mã OTP</Label>
                        <Input
                          id='otp'
                          placeholder='Nhập mã OTP...'
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        {otpError && <p className='text-sm text-red-600 mt-1'>{otpError}</p>}
                      </div>
                      <div>
                        <Label htmlFor='new-password'>Mật khẩu mới</Label>
                        <PasswordInput
                          id='new-password'
                          placeholder='Mật khẩu mới...'
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {newPasswordError && <p className='text-sm text-red-600 mt-1'>{newPasswordError}</p>}
                      </div>
                      <div>
                        <Label htmlFor='confirm-password'>Xác nhận mật khẩu</Label>
                        <PasswordInput
                          id='confirm-password'
                          placeholder='Xác nhận mật khẩu...'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordError && <p className='text-sm text-red-600 mt-1'>{confirmPasswordError}</p>}
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          onClick={handleChangePasswordClick}
                          disabled={isPasswordChangeLoading}
                        >
                          {isPasswordChangeLoading ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Đang đổi mật khẩu...
                            </>
                          ) : (
                            'Đổi mật khẩu'
                          )}
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => {
                            setChangeEmail('')
                            setChangeAccountType('restaurant')
                            setOtp('')
                            setNewPassword('')
                            setConfirmPassword('')
                            setChangeEmailError('')
                            setChangeAccountTypeError('')
                            setOtpError('')
                            setNewPasswordError('')
                            setConfirmPasswordError('')
                            setOpenChangePassword(false)
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

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