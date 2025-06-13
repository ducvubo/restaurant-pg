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
import { usePathname, useRouter, } from 'next/navigation'
import DeleteOrRestore from './DeleteOrRestore'
import { MoreHorizontal } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IOperationManual } from '../operation-manual.interface'
import { updateStatusOperationManual } from '../operation-manual.api'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'
export const columns: ColumnDef<IOperationManual>[] = [
  {
    accessorKey: 'opera_manual_title',
    id: 'Tiêu đề',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiêu đề' />,
    enableHiding: true
  },
  {
    accessorKey: 'opera_manual_type',
    id: 'Loại tài liệu',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại tài liệu' />,
    enableHiding: true
  },
  // {
  //   accessorKey: 'opera_manual_content',
  //   id: 'Nội dung',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Nội dung' />,
  //   //render html content
  //   cell: ({ row }) => {
  //     const operationManual = row.original
  //     return (
  //       <div dangerouslySetInnerHTML={{ __html: operationManual.opera_manual_content }} />
  //     )
  //   },
  //   enableHiding: true
  // },
  {
    accessorKey: 'opera_manual_note',
    id: 'Ghi chú',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ghi chú' />,
    enableHiding: true
  },
  {
    accessorKey: 'opera_manual_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const operationManual = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatusOperationManual({
          opera_manual_id: operationManual.opera_manual_id ? operationManual.opera_manual_id : '',
          opera_manual_status: operationManual.opera_manual_status === 'active' ? 'archived' : 'active'
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
      return operationManual.opera_manual_status === 'active' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermissionKey('operation_manual_update_status')}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermissionKey('operation_manual_update_status')}>
          Vô hiệu hóa
        </Button>
      )
    }
  },
  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const operationManual = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforOperationManual={operationManual} path={pathname} />
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
              hasPermissionKey('operation_manual_view_detail') && (
                <Link href={`/dashboard/operation-manual/view?id=${operationManual.opera_manual_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermissionKey('operation_manual_update') && (
                <Link href={`/dashboard/operation-manual/edit?id=${operationManual.opera_manual_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermissionKey('operation_manual_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforOperationManual={operationManual} path='delete' />
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
