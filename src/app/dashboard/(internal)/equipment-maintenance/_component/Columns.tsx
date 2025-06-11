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
import { IEquipmentMaintenance } from '../equipment-maintenance.interface'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { updateStatusEquipmentMaintenance } from '../equipment-maintenance.api'

export const columns: ColumnDef<IEquipmentMaintenance>[] = [
  // eqp_mtn_name: string
  // eqp_mtn_cost: number
  // eqp_mtn_date_fixed: Date
  // eqp_mtn_date_reported: Date
  // eqp_mtn_issue_description: string
  // eqp_mtn_location: string
  // eqp_mtn_note: string
  // eqp_mtn_performed_by: string
  // eqp_mtn_reported_by: string
  // eqp_mtn_status: 'pending' | ' in_progress' | ' done' | ' rejected'
  {
    accessorKey: 'eqp_mtn_name',
    id: 'Tên thiết bị',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên thiết bị' />,
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_cost',
    id: 'Chi phí',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Chi phí' />,
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_date_fixed',
    id: 'Ngày sửa chữa',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày sửa chữa' />,
    cell: ({ row }) => {
      const equipmentMaintenance = row.original
      return <span>{equipmentMaintenance.eqp_mtn_date_fixed ? new Date(equipmentMaintenance.eqp_mtn_date_fixed).toLocaleDateString('vi-VN') : ''}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_date_reported',
    id: 'Ngày hoàn thành',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày hoàn thành' />,
    cell: ({ row }) => {
      const equipmentMaintenance = row.original
      return <span>{equipmentMaintenance.eqp_mtn_date_reported ? new Date(equipmentMaintenance.eqp_mtn_date_reported).toLocaleDateString('vi-VN') : ''}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_issue_description',
    id: 'Mô tả sự cố',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả sự cố' />,
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_location',
    id: 'Địa điểm',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm' />,
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_note',
    id: 'Ghi chú',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ghi chú' />,
    enableHiding: true
  },
  // {
  //   accessorKey: 'eqp_mtn_reported_by',
  //   id: 'Người báo cáo',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Người báo cáo' />,
  //   enableHiding: true
  // },
  {
    accessorKey: 'eqp_mtn_performed_by',
    id: 'Người sửa chữa',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Người sửa chữa' />,
    enableHiding: true
  },
  {
    accessorKey: 'eqp_mtn_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const equipmentMaintenance = row.original
      const handleUpdateStatus = async (eqp_mtn_status: 'pending' | ' in_progress' | ' done' | ' rejected') => {
        const res = await updateStatusEquipmentMaintenance({
          eqp_mtn_id: equipmentMaintenance.eqp_mtn_id,
          eqp_mtn_status: eqp_mtn_status
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
          value={equipmentMaintenance.eqp_mtn_status}
          onValueChange={(value: 'pending' | ' in_progress' | ' done' | ' rejected') => handleUpdateStatus(value)}
        >
          <SelectTrigger className='w-36' >
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value='pending'>Chờ xử lý</SelectItem>
              <SelectItem value='in_progress'>Đang xử lý</SelectItem>
              <SelectItem value='done'>Đã hoàn thành</SelectItem>
              <SelectItem value='rejected'>Đã từ chối</SelectItem>
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
      const equipmentMaintenance = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforEquipmentMaintenance={equipmentMaintenance} path={pathname} />
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
            <Link href={`/dashboard/equipment-maintenance/view?id=${equipmentMaintenance.eqp_mtn_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/equipment-maintenance/edit?id=${equipmentMaintenance.eqp_mtn_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforEquipmentMaintenance={equipmentMaintenance} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
