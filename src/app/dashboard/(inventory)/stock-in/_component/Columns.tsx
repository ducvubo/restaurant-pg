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
import { IStockIn, IStockInItem } from '../stock-in.interface'
import { formatDate, formatDateMongo } from '@/app/utils'

export const columns: ColumnDef<IStockIn>[] = [
  {
    accessorKey: 'stki_code',
    id: 'Mã hóa đơn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã hóa đơn' />,
    enableHiding: true
  },
  {
    accessorKey: 'stki_delivery_name',
    id: 'Người giao',
    header: () => <div className='font-semibold'>Người giao</div>,
    enableHiding: true
  },
  {
    accessorKey: 'stki_date',
    id: 'Ngày nhập',
    header: () => <div className='font-semibold'>Ngày nhập</div>,
    cell: ({ row }) => {
      const stockIn = row.original
      return <div>{formatDate(new Date(stockIn.stki_date))}</div>
    },
    enableHiding: true
  },
  {
    accessorKey: 'items',
    id: 'Tổng hóa đơn',
    header: () => <div className='font-semibold'>Tổng hóa đơn</div>,
    cell: ({ row }) => {
      const stockIn = row.original
      const total = stockIn.items.reduce((total, item: IStockInItem) => {
        return total + item.stki_item_quantity_real * item.stki_item_price
      }, 0)

      return total.toLocaleString() + ' đ'
    },
    enableHiding: true
  },
  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const stockIn = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforStockIn={stockIn} path={pathname} />
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
            <Link href={`/dashboard/stock-in/edit?id=${stockIn.stki_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforStockIn={stockIn} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
