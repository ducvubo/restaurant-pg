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
import { usePathname } from 'next/navigation'
import DeleteOrRestore from './DeleteOrRestore'
import { MoreHorizontal } from 'lucide-react'
import { IStockOut, IStockOutItem } from '../stock-out.interface'
import { formatDate, formatDateMongo } from '@/app/utils'

export const columns: ColumnDef<IStockOut>[] = [
  {
    accessorKey: 'stko_code',
    id: 'Mã hóa đơn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã hóa đơn' />,
    enableHiding: true
  },
  {
    accessorKey: 'stko_date',
    id: 'Ngày xuất',
    header: () => <div className='font-semibold'>Ngày xuất</div>,
    cell: ({ row }) => {
      const stockOut = row.original
      return <div>{formatDate(new Date(stockOut.stko_date))}</div>
    },
    enableHiding: true
  },
  {
    accessorKey: 'items',
    id: 'Tổng hóa đơn',
    header: () => <div className='font-semibold'>Tổng hóa đơn</div>,
    cell: ({ row }) => {
      const stockOut = row.original
      const total = stockOut.items.reduce((total, item: IStockOutItem) => {
        return total + item.stko_item_quantity * item.stko_item_price
      }, 0)

      return total.toLocaleString() + ' đ'
    },
    enableHiding: true
  },
  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const stockOut = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforStockOut={stockOut} path={pathname} />
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
            <Link href={`/dashboard/stock-out/${stockOut.stko_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforStockOut={stockOut} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
