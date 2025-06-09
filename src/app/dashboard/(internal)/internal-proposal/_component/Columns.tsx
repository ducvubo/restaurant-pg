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
import { IInternalProposal } from '../internal-proposal.interface'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateStatusInternalProposal } from '../internal-proposal.api'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'

export const columns: ColumnDef<IInternalProposal>[] = [
  {
    accessorKey: 'itn_proposal_title',
    id: 'Tiêu đề',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiêu đề' />,
    enableHiding: true
  },
  {
    accessorKey: 'itn_proposal_type',
    id: 'Loại đề xuất',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại đề xuất' />,
    enableHiding: true
  },
  {
    accessorKey: 'itn_proposal_content',
    id: 'Nội dung',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nội dung' />,
    enableHiding: true
  },
  {
    accessorKey: 'itn_proposal_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const internalProposal = row.original
      const handleUpdateStatus = async (itn_proposal_status: "pending" | "approved" | "rejected") => {
        const res = await updateStatusInternalProposal({
          itn_proposal_id: internalProposal.itn_proposal_id,
          itn_proposal_status: itn_proposal_status
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
      return (
        <Select
          value={internalProposal.itn_proposal_status}
          onValueChange={(value: 'pending' | 'approved' | 'rejected') => handleUpdateStatus(value)}
        >
          <SelectTrigger className='w-1/2' >
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
              <SelectItem value='approved'>Đã duyệt</SelectItem>
              <SelectItem value='rejected'>Từ chối</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }
  },
  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const internalNote = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforInternalProposal={internalNote} path={pathname} />
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
            <Link href={`/dashboard/internal-proposal/edit?id=${internalNote.itn_proposal_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforInternalProposal={internalNote} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
