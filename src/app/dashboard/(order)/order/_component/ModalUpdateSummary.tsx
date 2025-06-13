'use client'
import { AlertDialogDescription } from '@/components/ui/alert-dialog'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState } from 'react'
import { IOrderRestaurant } from '../order.interface'
import { switchStatusOrderSummaryVi } from '@/app/utils'
import { updateStatusSummary } from '../order.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { handleClientScriptLoad } from 'next/script'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface Props {
  order_summary: IOrderRestaurant
}

export function ModalUpdateStatusSummary({ order_summary }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [changeValue, setChangeValue] = useState<any>()

  const handleChange = (value: 'ordering' | 'paid' | 'refuse') => {
    setChangeValue(value) // Gán giá trị mới vào biến changeValue
    setDialogOpen(true) // Mở Dialog khi thay đổi giá trị
  }

  const handleClose = () => {
    setDialogOpen(false) // Đóng Dialog
  }

  const handleUpdateStatusSummary = async () => {
    setLoading(true)
    const res = await updateStatusSummary({
      _id: order_summary._id,
      od_dish_smr_status: changeValue
    })
    if (res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái thành công',
        variant: 'default'
      })
      setDialogOpen(false)
      const currentPath = window.location.pathname
      router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
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
    } else if (res.statusCode === 404) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đơn hàng không tồn tại, vui lòng thử lại sau',
        variant: 'destructive'
      })
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      {order_summary.od_dish_smr_status === 'ordering' ? (
        <Select value={order_summary.od_dish_smr_status} onValueChange={handleChange} disabled={
          !hasPermissionKey('order_dish_update_status')
        }>
          <SelectTrigger className='w-[140px] mr-[70px]' >
            <SelectValue placeholder='Chọn trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='paid'>Đã thanh toán</SelectItem>
              <SelectItem value='refuse'>Từ chối</SelectItem>
              <SelectItem value='ordering'>Đang order</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Button disabled className='mr-[80px] w-[140px]'>
          {switchStatusOrderSummaryVi(order_summary.od_dish_smr_status)}
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
          </DialogHeader>
          <div>
            Bạn có chắc muốn thay đổi trạng thái đơn hàng của '{order_summary.od_dish_smr_guest_id.guest_name}' ngồi tại
            '{order_summary.od_dish_smr_table_id.tbl_name}' từ
            <span className='font-bold'>{switchStatusOrderSummaryVi(order_summary.od_dish_smr_status)}</span> sang
            <span className='font-bold'>{switchStatusOrderSummaryVi(changeValue as string)} </span>
            không? Thao tác này không thể hoàn tác, hãy chắc chắn điều đó.
          </div>

          <DialogFooter>
            <Button onClick={handleClose}>Đóng</Button>
            <Button onClick={handleUpdateStatusSummary}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
