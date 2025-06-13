'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { ITicketGuestRestaurant } from '../ticket-guest.interface'
import { formatDateMongo } from '@/app/utils'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

export const getTextStatus = (status?: string) => {
  switch (status) {
    case 'open':
      return 'Mở'
    case 'in_progress':
      return 'Đang xử lý'
    case 'close':
      return 'Đóng'
    case 'resolved':
      return 'Đã giải quyết'
    default:
      return ''
  }
}

export const getTextPriority = (priority?: string) => {
  switch (priority) {
    case 'low':
      return 'Thấp'
    case 'medium':
      return 'Trung bình'
    case 'high':
      return 'Cao'
    case 'urgent':
      return 'Khẩn cấp'
    default:
      return ''
  }
}

export const getTextType = (type?: string) => {
  switch (type) {
    case 'book_table':
      return 'Đặt bàn'
    case 'order_dish':
      return 'Gọi món'
    case 'Q&A':
      return 'Hỏi đáp'
    case 'complain':
      return 'Khiếu nại'
    case 'other':
      return 'Khác'
    default:
      return ''
  }
}

export const columns: ColumnDef<ITicketGuestRestaurant>[] = [
  {
    accessorKey: 'tkgr_user_email',
    id: 'Email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    enableHiding: true
  },
  {
    accessorKey: 'tkgr_title',
    id: 'Tiêu đề',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiêu đề' />,
    enableHiding: true
  },
  {
    accessorKey: 'tkgr_description',
    id: 'Nội dung',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nội dung' />,
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div dangerouslySetInnerHTML={{ __html: ticket.tkgr_description }}></div>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'tkgr_attachment',
    id: 'File đính kèm',
    header: () => <div>File đính kèm</div>,
    cell: ({ row }) => {
      const ticket = row.original
      const tkgr_attachment = ticket.tkgr_attachment ? JSON.parse(ticket.tkgr_attachment) : []
      return (
        <ul className='list-disc flex flex-col gap-2'>
          {tkgr_attachment.map((link: string, index: number) => (
            <li key={index} className='flex items-center justify-between'>
              <a
                href={process.env.NEXT_PUBLIC_URL_CLIENT + link}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 underline'
              >
                Tệp đính kèm {index + 1}
              </a>
            </li>
          ))}
        </ul>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'tkgr_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const ticket = row.original
      return <Badge variant={'destructive'}>{getTextStatus(ticket.tkgr_status)}</Badge>
    },
    enableHiding: true
  },
  {
    accessorKey: 'tkgr_priority',
    id: 'Độ ưu tiên',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Độ ưu tiên' />,
    cell: ({ row }) => {
      const ticket = row.original
      return <Badge variant={'secondary'}>{getTextPriority(ticket.tkgr_priority)}</Badge>
    },
    enableHiding: true
  },
  {
    accessorKey: 'tkgr_type',
    id: 'Loại yêu cầu',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại yêu cầu' />,
    cell: ({ row }) => {
      const ticket = row.original
      return <Badge variant={'outline'}>{getTextType(ticket.tkgr_type)}</Badge>
    },
    enableHiding: true
  },
  {
    accessorKey: 'createdAt',
    id: 'Ngày tạo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      const ticket = row.original
      return <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('vi-VN') : ''}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'updatedAt',
    id: 'Thao tác',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Thao tác' />,
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>

            <DropdownMenuSeparator />
            {
              hasPermissionKey('ticket_list_view_detail') && (
                <DropdownMenuItem className='cursor-pointer'>
                  <Link href={`/dashboard/ticket-guest/view?id=${ticket.tkgr_id}`} className='cursor-pointer'> Xem chi tiết</Link>
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
