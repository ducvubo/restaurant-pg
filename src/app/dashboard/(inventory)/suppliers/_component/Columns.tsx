'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import DeleteOrRestore from './DeleteOrRestore'
import { updateStatus } from '../supplier.api'
import { MoreHorizontal } from 'lucide-react'
import { ISupplier } from '../supplier.interface'

export const columns: ColumnDef<ISupplier>[] = [
  {
    accessorKey: 'spli_name',
    id: 'Tên nhà cung cấp',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên nhà cung cấp' />,
    enableHiding: true
  },
  {
    accessorKey: 'spli_phone',
    id: 'Số điện thoại',
    header: () => <div className='font-semibold'>Số điện thoại</div>,
    enableHiding: true
  },
  {
    accessorKey: 'spli_email',
    id: 'Email',
    header: () => <div className='font-semibold'>Email</div>,
    enableHiding: true
  },
  {
    accessorKey: 'spli_address',
    id: 'Địa chỉ',
    header: () => <div className='font-semibold'>Địa chỉ</div>,
    enableHiding: true
  },
  {
    accessorKey: 'spli_description',
    id: 'Giới thiệu',
    header: () => <div className='font-semibold'>Giới thiệu</div>,
    enableHiding: true
  },
  {
    accessorKey: 'spli_type',
    id: 'Loại',
    header: () => <div className='font-semibold'>Loại</div>,
    cell: ({ row }) => {
      const supplier = row.original
      return supplier.spli_type === 'supplier' ? 'Nhà cung cấp' : 'Khách hàng'
    },
    enableHiding: true
  },
  {
    accessorKey: 'spli_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const supplier = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          spli_id: supplier.spli_id ? supplier.spli_id : '',
          spli_status: supplier.spli_status === 'enable' ? 'disable' : 'enable'
        })
        if (res.statusCode === 200) {
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.refresh()
        } else if (res.statusCode === 400) {
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
      return supplier.spli_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'}>
          Vô hiệu hóa
        </Button>
      )
    }
  },

  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const supplier = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforSupplier={supplier} path={pathname} />
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={`/dashboard/suppliers/view?id=${supplier.spli_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/suppliers/edit?id=${supplier.spli_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforSupplier={supplier} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
