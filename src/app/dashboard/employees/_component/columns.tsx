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
import { DataTableColumnHeader } from '../../../../components/ColumnHeader'
import { IEmployee } from '../employees.interface'
import Link from 'next/link'
// export type Payment = {
//   id: string
//   amount: number
//   status: string
//   email: string
// }

export const columns: ColumnDef<IEmployee>[] = [
  {
    accessorKey: '_id',
    id: 'Trạng thái',
    // header: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true
  },
  {
    accessorKey: 'epl_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    enableHiding: true
  },
  {
    accessorKey: 'epl_phone',
    header: () => <div>Amount</div>,
    // cell: ({ row }) => {
    //   const amount = parseFloat(row.getValue('epl_phone'))
    //   const formatted = new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'USD'
    //   }).format(amount)

    //   return <div className='text-right font-medium'>{formatted}</div>
    // },
    enableHiding: true
  },
  {
    accessorKey: 'epl_status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true
  },
  {
    accessorKey: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const employees = row.original
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employees._id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/employees/${employees._id}`}>
              <DropdownMenuItem>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true // Cho phép ẩn
  }
]
