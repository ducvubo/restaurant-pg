'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { addMember, loginGuest } from '../guest.api'
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
  token: z.string()
})

export function MemberLogin() {
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
      token: (searchParams.get('token') ?? '') as string
    }
  })

  if (param.slug === undefined || searchParams.get('token') === undefined) {
    router.push('/')
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res: any = await addMember(data)
    if (res.code === 201 && res.data) {
      toast({
        title: 'Thành công',
        description: 'Đăng nhập thành công',
        variant: 'default'
      })
      runAppGuest({
        guest_name: res.data.guest_name,
        guest_restaurant_id: res.data.guest_restaurant_id,
        guest_table_id: res.data.guest_table_id,
        guest_type: 'member',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='guest_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder='Tên....' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
