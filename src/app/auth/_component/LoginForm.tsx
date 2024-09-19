'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/input-password'
import { login } from '../auth.api'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { startAppRestaurant } from '../auth.slice'
import { IRestaurant } from '../auth.interface'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/use-toast'
const FormSchema = z.object({
  restaurant_email: z
    .string()
    .nonempty({ message: 'Vui lòng nhập email' })
    .min(10, {
      message: 'Email không hợp lệ'
    })
    .email({ message: 'Email không hợp lệ' }),
  restaurant_password: z.string().nonempty({ message: 'Vui lòng nhập password' }).min(8, {
    message: 'Mật khẩu có ít nhất 8 kí tự'
  })
})

export function LoginForm() {
  const { setLoading } = useLoading()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      restaurant_email: 'Tressie12@hotmail.com',
      restaurant_password: 'Duc17052003*'
    }
  })
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppRestaurant = (inforRestaurant: IRestaurant) => {
    dispatch(startAppRestaurant(inforRestaurant))
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const res = await login(data)
    if (res?.code === 0 && res.data) {
      setLoading(false)
      runAppRestaurant(res.data)
      toast({
        title: 'Thành công',
        description: 'Đăng nhập thành công'
      })
      router.push('/dashboard')
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='restaurant_email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='restaurant_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                {/* <Input placeholder='Password...' {...field} /> */}
                <PasswordInput placeholder='Password...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Đăng nhập</Button>
      </form>
    </Form>
  )
}
