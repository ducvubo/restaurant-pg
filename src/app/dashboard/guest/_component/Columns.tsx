'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { IGuest } from '../guest.interface'
export const columns: ColumnDef<IGuest>[] = [
  {
    accessorKey: 'guest_name',
    id: 'Tên khách',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên khách' />,
    enableHiding: true
  },
  {
    accessorKey: 'guest_table_id',
    id: 'Bàn',
    header: () => <div>Bàn</div>,
    cell: ({ row }) => {
      const guest = row.original
      return <span>{guest.guest_table_id.tbl_name}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'guest_type',
    id: 'Chức vụ',
    cell: ({ row }) => {
      const guest = row.original
      return <span>{guest.guest_type === 'member' ? 'Thành viên' : 'Chủ bàn'}</span>
    },
    header: () => <div>Chức vụ</div>,
    enableHiding: true
  }
]
