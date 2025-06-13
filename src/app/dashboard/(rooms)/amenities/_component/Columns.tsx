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
import { updateStatus } from '../amenities.api'
import { MoreHorizontal } from 'lucide-react'
import { IAmenities } from '../amenities.interface'
import { usePermission } from '@/app/auth/PermissionContext'
export const columns: ColumnDef<IAmenities>[] = [
  {
    accessorKey: 'ame_name',
    id: 'Tên',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên' />,
    enableHiding: true
  },
  {
    accessorKey: 'ame_price',
    id: 'Giá',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giá' />,
    enableHiding: true
  },
  {
    accessorKey: 'ame_note',
    id: 'Ghi chú',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ghi chú' />,
    enableHiding: true
  },
  {
    accessorKey: 'ame_description',
    id: 'Mô tả',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    enableHiding: true
  },

  {
    accessorKey: 'ame_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const router = useRouter()
      const amenities = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          ame_id: amenities.ame_id ? amenities.ame_id : '',
          ame_status: amenities.ame_status === 'enable' ? 'disable' : 'enable'
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
      return amenities.ame_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermission('amenities_update_status')}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermission('amenities_update_status')}>
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
      const amenities = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforAmenities={amenities} path={pathname} />
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
              hasPermission('amenities_view_detail') && (
                <Link href={`/dashboard/amenities/view?id=${amenities.ame_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('amenities_update') && (
                <Link href={`/dashboard/amenities/edit?id=${amenities.ame_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('amenities_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforAmenities={amenities} path='delete' />
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
