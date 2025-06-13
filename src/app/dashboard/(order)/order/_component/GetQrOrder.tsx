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
import { useEffect, useState } from 'react'
import { IOrderRestaurant } from '../order.interface'
import { useLoading } from '@/context/LoadingContext'
import { useRouter } from 'next/navigation'
import { getTokenOrderSummary } from '../order.api'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface Props {
  order_summary: IOrderRestaurant
}
export default function GetQrOrder({ order_summary }: Props) {
  const { setLoading } = useLoading()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [token, setToken] = useState('')

  const getTokenOrder = async () => {
    setLoading(true)
    const res: IBackendRes<{ refresh_token: string }> = await getTokenOrderSummary({
      _id: order_summary.od_dish_smr_guest_id._id
    })

    if (res.statusCode === 201 && res.data) {
      setLoading(false)
      setToken(res.data.refresh_token)
    } else if (res?.statusCode === 400) {
      setIsModalOpen(false)
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
      setIsModalOpen(false)
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại, hoặc liên hệ quản trị viên',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else {
      setIsModalOpen(false)
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau ít phút hoặc liên hệ quản trị viên',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      getTokenOrder()
    } else {
      setToken('')
    }

    return () => {
      setToken('')
    }
  }, [isModalOpen])

  const url = `${process.env.NEXT_PUBLIC_URL_CLIENT}/guest/sign-in-again/${token}`

  return (
    <div>
      <Dialog onOpenChange={(isOpen) => setIsModalOpen(isOpen)} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='-ml-[123px] w-32'
            disabled={
              !hasPermissionKey('order_dish_create_qr') ||
                order_summary.od_dish_smr_status === 'paid' ||
                order_summary.od_dish_smr_status === 'refuse' ||
                order_summary.od_dish_smr_guest_id.guest_name === 'Nhân viên order'
                ? true
                : false
            }
          >
            Tạo Qr Order
          </Button>
        </DialogTrigger>
        <DialogContent className='w-auto'>
          <DialogHeader>
            <DialogTitle>Tạo Qr Order</DialogTitle>
            <DialogDescription>Quét mã qr để đăng nhập lại và tiếp tục order</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col justify-center items-center gap-3'>
            {token && (
              <>
                <Link target='_blank' href={`/guest/sign-in-again/${token}`}>
                  <QRCodeSVG value={url} />
                </Link>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsModalOpen(false)
              }}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
