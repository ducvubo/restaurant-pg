'use client'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
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
import { usePathname, useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IWorkingShift } from '../working-shift.interface'
import DeleteOrRestore from './DeleteOrRestore'

export const columns: ColumnDef<IWorkingShift>[] = [
  {
    accessorKey: 'wks_name',
    id: 'Tên ca làm việc',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên ca làm việc' />,
    enableHiding: true
  },
  {
    accessorKey: 'wks_description',
    id: 'Mô tả',
    header: () => <div>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'wks_start_time',
    id: 'Thời gian',
    header: () => <div>Thời gian</div>,
    cell: ({ row }) => {
      const workingShift = row.original
      return (
        <div>
          {workingShift.wks_start_time} - {workingShift.wks_end_time}
        </div>
      )
    },
    enableHiding: true
  },

  // {
  //   accessorKey: 'wks_status',
  //   id: 'Trạng thái',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
  //   enableHiding: true,
  //   cell: ({ row }) => {
  //     const router = useRouter()
  //     const workingShift = row.original
  //     const handleUpdateStatus = async () => {
  //       const res = await updateStatus({
  //         wks_id: workingShift.wks_id,
  //         wks_status: workingShift.wks_status === 'enable' ? 'disable' : 'enable'
  //       })
  //       if (res.statusCode === 200) {
  //         workingShift.wks_status = workingShift.wks_status === 'enable' ? 'disable' : 'enable'
  //         toast({
  //           title: 'Thành công',
  //           description: 'Cập nhật trạng thái thành công',
  //           variant: 'default'
  //         })
  //         router.refresh()
  //       } else if (res.statusCode === 400) {
  //         if (Array.isArray(res.message)) {
  //           res.message.map((item: string) => {
  //             toast({
  //               title: 'Thất bại',
  //               description: item,
  //               variant: 'destructive'
  //             })
  //           })
  //         } else {
  //           toast({
  //             title: 'Thất bại',
  //             description: res.message,
  //             variant: 'destructive'
  //           })
  //         }
  //       } else if (res.code === -10) {
  //         toast({
  //           title: 'Thông báo',
  //           description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
  //           variant: 'destructive'
  //         })
  //         await deleteCookiesAndRedirect()
  //       } else if (res.code === -11) {
  //         toast({
  //           title: 'Thông báo',
  //           description:
  //             'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
  //           variant: 'destructive'
  //         })
  //       } else {
  //         toast({
  //           title: 'Thất bại',
  //           description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  //           variant: 'destructive'
  //         })
  //       }
  //     }

  //     return workingShift.wks_status === 'enable' ? (
  //       <Button variant={'outline'} onClick={handleUpdateStatus}>
  //         Hoạt động
  //       </Button>
  //     ) : (
  //       <Button onClick={handleUpdateStatus} variant={'destructive'}>
  //         Ngừng hoạt động
  //       </Button>
  //     )
  //   }
  // },

  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const workingShift = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforWorkingShift={workingShift} path={pathname} />
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
            <Link href={`/dashboard/working-shifts/${workingShift.wks_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforWorkingShift={workingShift} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
