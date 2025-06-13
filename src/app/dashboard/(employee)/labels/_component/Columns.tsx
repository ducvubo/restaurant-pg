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
import { updateStatus } from '../label.api'
import { MoreHorizontal } from 'lucide-react'
import { ILabel } from '../label.interface'
import { usePermission } from '@/app/auth/PermissionContext'

export const columns: ColumnDef<ILabel>[] = [
  {
    accessorKey: 'lb_name',
    id: 'Tên nhãn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên nhãn' />,
    enableHiding: true
  },
  {
    accessorKey: 'lb_color',
    id: 'Màu sắc',
    header: () => <div className='font-semibold'>Màu sắc</div>,
    // #522121
    cell: ({ row }) => {
      const label = row.original
      return (
        <div className='flex items-center gap-2'>
          <div
            className='h-4 w-4 rounded-full border border-gray-300'
            style={{ backgroundColor: label.lb_color }}
          ></div>
          <span>{label.lb_color}</span>
        </div>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'lb_description',
    id: 'Mô tả',
    header: () => <div className='font-semibold'>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'lb_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const router = useRouter()
      const label = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          lb_id: label.lb_id ? label.lb_id : '',
          lb_status: label.lb_status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
        })
        if (res.statusCode === 201) {
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
      return label.lb_status === 'ENABLED' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermission('label_list_update_status')}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermission('label_list_update_status')}>
          Vô hiệu hóa
        </Button>
      )
    }
  },

  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const label = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforLabel={label} path={pathname} />
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
            {
              hasPermission('label_list_view_detail') && (
                <Link href={`/dashboard/labels/view?id=${label.lb_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('label_list_update') && (
                <Link href={`/dashboard/labels/edit?id=${label.lb_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('label_list_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforLabel={label} path='delete' />
                </DropdownMenuItem>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
