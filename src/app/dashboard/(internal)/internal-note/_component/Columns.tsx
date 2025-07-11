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
import { usePathname, } from 'next/navigation'
import DeleteOrRestore from './DeleteOrRestore'
import { MoreHorizontal } from 'lucide-react'
import { IInternalNote } from '../internal-note.interface'
import { usePermission } from '@/app/auth/PermissionContext'

export const columns: ColumnDef<IInternalNote>[] = [
  {
    accessorKey: 'itn_note_title',
    id: 'Tiêu đề',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiêu đề' />,
    enableHiding: true
  },
  {
    accessorKey: 'itn_note_type',
    id: 'Loại ghi chú',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại ghi chú' />,
    enableHiding: true
  },
  {
    accessorKey: 'itn_note_content',
    id: 'Nội dung',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nội dung' />,
    enableHiding: true
  },
  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const internalNote = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforInternalNote={internalNote} path={pathname} />
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
              hasPermission('internal_note_view_detail') && (
                <Link href={`/dashboard/internal-note/view?id=${internalNote.itn_note_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('internal_note_update') && (
                <Link href={`/dashboard/internal-note/edit?id=${internalNote.itn_note_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('internal_note_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforInternalNote={internalNote} path='delete' />
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
