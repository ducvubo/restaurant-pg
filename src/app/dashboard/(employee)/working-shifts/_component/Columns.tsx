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
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

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
  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
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
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

            <DropdownMenuSeparator />
            {
              hasPermissionKey('working_shift_list_view_detail') && (
                <Link href={`/dashboard/working-shifts/view?id=${workingShift.wks_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermissionKey('working_shift_list_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforWorkingShift={workingShift} path='delete' />
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
