'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { loginGuest } from '../guest.api'
import { startAppGuest } from '../guest.slice'
import { IGuest } from '../guest.interface'
import { useDispatch } from 'react-redux'

const FormSchema = z.object({
  guest_name: z
    .string()
    .min(2, {
      message: 'Vui lòng nhập ít nhất 2 ký tự'
    })
    .max(50, { message: 'Vui lòng nhập tối đa 50 ký tự' }),
  guest_table_id: z.string(),
  guest_restaurant_id: z.string()
})

export function LoginTableForm() {
  const param = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()

  const runAppGuest = (inforGuest: IGuest) => {
    dispatch(startAppGuest(inforGuest))
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guest_name: '',
      guest_restaurant_id: (param.slug as string) || '',
      guest_table_id: (searchParams.get('token') ?? '') as string
    }
  })

  const checkStatusTableByToken = async () => {

  }

  if (param.slug === undefined || searchParams.get('token') === undefined) {
    router.push('https://pato.taphoaictu.id.vn')
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await loginGuest(data)
    if (res.code === 201) {
      toast({
        title: 'Thành công',
        description: 'Đăng nhập thành công',
        variant: 'default'
      })

      runAppGuest({
        guest_name: res.data.guest_name,
        guest_restaurant_id: res.data.guest_restaurant_id,
        guest_table_id: res.data.guest_table_id,
        guest_type: 'owner',
        order_id: res.data.order_id
      })

      router.push('/guest/order')
    } else if (res?.code === 400) {
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
    } else if (res.code === 404) {
      toast({
        title: 'Thông báo',
        description: res.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg-guest.jpg')" }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 backdrop-blur-md p-4 rounded-xl shadow-xl mx-5"
        >
          <FormField
            control={form.control}
            name="guest_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100">Tên</FormLabel>
                <FormControl>
                  <Input
                    className="text-base text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Vui lòng nhập tên của quý khách"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="text-white dark:text-gray-900"
          >
            Vào bàn
          </Button>
        </form>
      </Form>
    </div>
  )
}
