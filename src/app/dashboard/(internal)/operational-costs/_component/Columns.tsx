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
import { IOperationalCosts } from '../operational-costs.interface'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { updateStatusOperationalCosts } from '../operational-costs.api'

export const columns: ColumnDef<IOperationalCosts>[] = [
  // opera_cost_type: string
  // opera_cost_amount: number
  // opera_cost_date: Date
  // opera_cost_description: string
  // opera_cost_status: 'pending' | 'paid' | 'canceled'
  {
    accessorKey: 'opera_cost_type',
    id: 'Loại chi phí',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại chi phí' />,
    enableHiding: true
  },
  {
    accessorKey: 'opera_cost_amount',
    id: 'Số tiền',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số tiền' />,
    enableHiding: true
  },
  {
    accessorKey: 'opera_cost_date',
    id: 'Ngày chi phí',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày chi phí' />,
    enableHiding: true
  },
  {
    accessorKey: 'opera_cost_description',
    id: 'Mô tả',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    enableHiding: true
  },
  {
    accessorKey: 'opera_cost_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const OperationalCosts = row.original
      const handleUpdateStatus = async (opera_cost_status: 'pending' | 'paid' | 'canceled') => {
        const res = await updateStatusOperationalCosts({
          opera_cost_id: OperationalCosts.opera_cost_id,
          opera_cost_status: opera_cost_status
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
          value={OperationalCosts.opera_cost_status}
          onValueChange={(value: 'pending' | 'paid' | 'canceled') => handleUpdateStatus(value)}
        >
          <SelectTrigger className='w-1/2' >
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
              <SelectItem value='paid'>Đã duyệt</SelectItem>
              <SelectItem value='canceled'>Đã hủy</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }
  },
  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const OperationalCosts = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforOperationalCosts={OperationalCosts} path={pathname} />
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
            <Link href={`/dashboard/operational-costs/${OperationalCosts.opera_cost_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforOperationalCosts={OperationalCosts} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
