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
import { updateStatus } from '../unit.api'
import { MoreHorizontal } from 'lucide-react'
import { IUnit } from '../unit.interface'
import Conversion from './Conversion'

export const columns: ColumnDef<IUnit>[] = [
  {
    accessorKey: 'unt_name',
    id: 'Tên đơn vị',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên đơn vị' />,
    enableHiding: true
  },
  {
    accessorKey: 'unt_symbol',
    id: 'Ký hiệu',
    header: () => <div className='font-semibold'>Ký hiệu</div>,
    enableHiding: true
  },
  {
    accessorKey: 'unt_description',
    id: 'Mô tả',
    header: () => <div className='font-semibold'>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'unt_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const unit = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          unt_id: unit.unt_id ? unit.unt_id : '',
          unt_status: unit.unt_status === 'enable' ? 'disable' : 'enable'
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
      return unit.unt_status === 'enable' ? (
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
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const unit = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforUnit={unit} path={pathname} />
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={`/dashboard/units/${unit.unt_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforUnit={unit} path='delete' />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Conversion inforUnit={unit} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
