'use client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import Image from 'next/image'
import { IPolicy } from '../policy.interface'
import { updateStatus } from '../policy.api'
import DeleteOrRestore from './DeleteOrRestore'
import { usePermission } from '@/app/auth/PermissionContext'  
export const columns: ColumnDef<IPolicy>[] = [
  {
    accessorKey: 'poly_name',
    id: 'Tên quyền',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên quyền' />,
    enableHiding: true
  },
  {
    accessorKey: 'poly_description',
    id: 'Mô tả',
    header: () => <div>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'poly_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const router = useRouter()
      const poly = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          _id: poly._id,
          poly_status: poly.poly_status === 'enable' ? 'disable' : 'enable'
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
      return poly.poly_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermission('policy_update_status')}>
          Đang hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermission('policy_update_status')}>
          Ngưng hoạt động
        </Button>
      )
    }
  },

  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const poly = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforPolicy={poly} path={pathname} />
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
              hasPermission('policy_view_detail') && (
                <Link href={`/dashboard/policy/view?id=${poly._id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('policy_update') && (
                <Link href={`/dashboard/policy/edit?id=${poly._id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('policy_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforPolicy={poly} path='delete' />
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
