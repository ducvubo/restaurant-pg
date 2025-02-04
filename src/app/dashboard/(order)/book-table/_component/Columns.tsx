'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { calculateFinalPrice, formatDateMongo, switchStatusOrderVi } from '@/app/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
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
import { IBookTable } from '../book-table.interface'
import { updateStatusBookTable } from '../book-table.api'

export const columns: ColumnDef<IBookTable>[] = [
  {
    accessorKey: 'od_dish_table_id',
    id: 'Tên khách',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên khách' />,
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return <span>{bookTable.book_tb_name}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_hour',
    id: 'Giờ đặt',
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return (
        <div className='flex flex-col'>
          <span>{bookTable.book_tb_hour.label}</span>
        </div>
      )
    },
    header: () => <div>Giờ đặt</div>,
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_date',
    id: 'Ngày đặt',
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return (
        <div className='flex flex-col'>
          <span>{formatDateMongo(bookTable.book_tb_date)}</span>
        </div>
      )
    },
    header: () => <div>Ngày đặt</div>,
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_number_adults',
    id: 'Số người',
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return (
        <div className='flex flex-col'>
          <span>Số người lớn: {bookTable.book_tb_number_adults}</span>
          <span>Số trẻ em: {bookTable.book_tb_number_children}</span>
        </div>
      )
    },
    header: () => <div>Số người</div>,
    enableHiding: true
  },
  {
    accessorKey: 'od_dish_status',
    id: 'Trạng thái',
    cell: ({ row }) => {
      const { setLoading } = useLoading()
      const bookTable: IBookTable = row.original

      const router = useRouter()
      const handleUpdateStatus = async (
        status: 'Nhà hàng đã tiếp nhận' | 'Đã hoàn thành' | 'Hủy' | 'Chờ nhà hàng xác nhận'
      ) => {
        if (status === 'Chờ nhà hàng xác nhận') return
        setLoading(true)
        const res: IBackendRes<IBookTable> = await updateStatusBookTable({
          _id: bookTable._id,
          book_tb_status: status
        })
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
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
        <Select
          onValueChange={(value: 'Nhà hàng đã tiếp nhận' | 'Đã hoàn thành' | 'Hủy') => handleUpdateStatus(value)}
          value={bookTable.book_tb_status}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='Nhà hàng đã tiếp nhận'>Nhà hàng đã tiếp nhận</SelectItem>
              <SelectItem value='Đã hoàn thành'>Đã hoàn thành</SelectItem>
              <SelectItem value='Hủy'>Hủy</SelectItem>
              <SelectItem value='Chờ nhà hàng xác nhận'>Chờ nhà hàng xác nhận</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    },
    header: () => <div>Trạng thái</div>,
    enableHiding: true
  }
]
