'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { OrderRestaurant } from '../order.interface'
import { calculateFinalPrice, formatDateMongo, switchStatusOrderVi } from '@/app/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { updateStatusOrder } from '../order.api'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'

export const columns: ColumnDef<OrderRestaurant>[] = [
  {
    accessorKey: 'od_dish_table_id',
    id: 'Bàn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Bàn' />,
    cell: ({ row }) => {
      const order: OrderRestaurant = row.original
      return <span>{order.od_dish_table_id.tbl_name}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'od_dish_guest_id',
    id: 'Khách hàng',
    cell: ({ row }) => {
      const order: OrderRestaurant = row.original
      return <span>{order.od_dish_guest_id?.guest_name}</span>
    },
    header: () => <div>Khách hàng</div>,
    enableHiding: true
  },
  {
    accessorKey: 'ahgdfhbashb',
    id: 'Chức vụ',
    cell: ({ row }) => {
      const order: OrderRestaurant = row.original
      return (
        <span>
          {order.od_dish_guest_id.guest_type === 'owner'
            ? 'Chủ bàn'
            : order.od_dish_guest_id.guest_type === 'member' &&
              `Thành viên (${order.od_dish_guest_id.guest_owner.owner_name})`}
        </span>
      )
    },
    header: () => <div>Chức vụ</div>,
    enableHiding: true
  },
  {
    accessorKey: 'od_dish_duplicate_id',
    id: 'Món ăn',
    cell: ({ row }) => {
      const order: OrderRestaurant = row.original
      return (
        <div className='flex gap-2'>
          <Image
            src={order.od_dish_duplicate_id?.dish_duplicate_image?.image_cloud}
            width={100}
            height={100}
            alt='vuducbo'
            className='w-[47px] h-[47px] object-fill rounded-lg'
          />
          <div className='flex flex-col'>
            <span>{order.od_dish_duplicate_id.dish_duplicate_name}</span>
            <span className='italic'>
              {calculateFinalPrice(
                order.od_dish_duplicate_id.dish_duplicate_price,
                order.od_dish_duplicate_id.dish_duplicate_sale
              )?.toLocaleString()}{' '}
              đ
            </span>
          </div>
          <Badge variant={'secondary'} className='w-5 h-5 flex justify-center items-center'>
            x{order.od_dish_quantity}
          </Badge>
        </div>
      )
    },
    header: () => <div>Món ăn</div>,
    enableHiding: true
  },
  {
    accessorKey: 'od_dish_quantity',
    id: 'Tổng tiền',
    cell: ({ row }) => {
      const order: OrderRestaurant = row.original
      return (
        <span className='italic'>
          {(
            calculateFinalPrice(
              order.od_dish_duplicate_id.dish_duplicate_price,
              order.od_dish_duplicate_id.dish_duplicate_sale
            ) * order.od_dish_quantity
          ).toLocaleString()}{' '}
          đ
        </span>
      )
    },
    header: () => <div>Tổng tiền</div>,
    enableHiding: true
  },
  {
    accessorKey: 'od_dish_status',
    id: 'Trạng thái',
    cell: ({ row }) => {
      const { setLoading } = useLoading()
      const order: OrderRestaurant = row.original

      const router = useRouter()
      const handleUpdateStatus = async (status: 'processing' | 'pending' | 'paid' | 'delivered' | 'refuse') => {
        setLoading(true)
        const res = await updateStatusOrder({
          _id: order._id,
          od_dish_status: status
        })
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
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
            description:
              'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
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
        <Select onValueChange={(value: any) => handleUpdateStatus(value)} value={order.od_dish_status}>
          <SelectTrigger className='w-[153px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='pending'>Chờ xử lý</SelectItem>
              <SelectItem value='processing'>Đang nấu</SelectItem>
              <SelectItem value='delivered'>Đã phục vụ</SelectItem>
              <SelectItem value='paid'>Đã thanh toán</SelectItem>
              <SelectItem value='refuse'>Từ chối</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    },
    header: () => <div>Trạng thái</div>,
    enableHiding: true
  },

  {
    accessorKey: 'createdAt',
    id: 'Tạo/Cập nhật',
    cell: ({ row }) => {
      const order: OrderRestaurant = row.original
      return (
        <div className='flex flex-col'>
          <span>{formatDateMongo(order.createdAt)}</span>
          <span>{formatDateMongo(order.updatedAt)}</span>
        </div>
      )
    },
    header: () => <div>Tạo/Cập nhật</div>,
    enableHiding: true
  }
]
