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
import { getListOrdring, getListTableOrder, restaurantCreateOrderSummary } from '../order.api'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'
import { useRouter } from 'next/navigation'
const FormSchema = z.object({
  od_dish_smr_table_id: z.string({ message: 'Vui lòng chọn bàn' }).nonempty({ message: 'Vui lòng chọn bàn' })
})

export default function AddOrderSummary() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [listTable, setListTable] = useState<ITable[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      od_dish_smr_table_id: ''
    }
  })

  const listTableOrder = async () => {
    const res: IBackendRes<ITable[]> = await getListTableOrder()
    console.log(res)
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

  useEffect(() => {
    if (isModalOpen) {
      listTableOrder()
    }
  }, [isModalOpen])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const res: IBackendRes<IOrderRestaurant> = await restaurantCreateOrderSummary({
      od_dish_smr_table_id: data.od_dish_smr_table_id
    })
    if (res.statusCode === 201 && res.data) {
      setLoading(false)
      setIsModalOpen(false)
      toast({
        title: 'Thành công',
        description: 'Đã gọi món thành công',
        variant: 'default'
      })
      form.reset({
        od_dish_smr_table_id: ''
      })
      router.push(`/dashboard/order/dish?a=${Math.floor(Math.random() * 100000) + 1}`)
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
      setIsModalOpen(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)
      setIsModalOpen(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  return (
    <div>
      <Dialog onOpenChange={(isOpen) => setIsModalOpen(isOpen)} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>Thêm hóa đơn</Button>
        </DialogTrigger>
        <DialogContent className='w-auto'>
          <DialogHeader>
            <DialogTitle>Thêm hóa đơn</DialogTitle>
            <DialogDescription>Khi bạn gọi món ở đây, tên khách sẽ là "Nhân viên order"</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='od_dish_smr_table_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bàn</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn bàn' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {listTable?.map((item, index) => {
                          return (
                            <SelectItem key={index} value={item._id}>
                              {item.tbl_name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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