'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { IChatBot } from '../chat-bot.interface'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/app/auth/PermissionContext'

export const columns: ColumnDef<IChatBot>[] = [
  {
    accessorKey: 'user_message',
    id: 'Tin nhắn khách',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tin nhắn khách' />,
    enableHiding: true
  },
  {
    accessorKey: 'bot_response',
    id: 'Tin nhắn bot',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tin nhắn bot' />,
    enableHiding: true
  },
  {
    accessorKey: 'timestamp',
    id: 'Thời gian',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiện ích có sẵn' />,
    cell: ({ row }) => {
      const chatBot = row.original
      const date = new Date(chatBot.timestamp)
      return <span>{date.toLocaleString()}</span>
    },
    enableHiding: true
  }, {
    accessorKey: 'Action',
    id: 'Action',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Action' />,
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const chatBot = row.original
      return <Button disabled={!hasPermission('chat_bot_delete')}>Xóa</Button>
    },
  }
]
