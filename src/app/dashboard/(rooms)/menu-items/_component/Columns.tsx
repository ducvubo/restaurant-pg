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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import DeleteOrRestore from './DeleteOrRestore'
import { updateStatus } from '../menu-items.api'
import { MoreHorizontal } from 'lucide-react'
import { IMenuItems } from '../menu-items.interface'
import Image from 'next/image'

export const columns: ColumnDef<IMenuItems>[] = [
  {
    accessorKey: 'mitems_image',
    id: 'Ảnh',
    header: () => <div className='font-semibold'>Ảnh</div>,
    cell: ({ row }) => {
      const menuItems = row.original
      return <Image src={JSON.parse(menuItems.mitems_image).image_cloud} alt='vuducbo' width={50} height={50} />
    },
    enableHiding: true
  },
  {
    accessorKey: 'mitems_name',
    id: 'Tên thực đơn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên thực đơn' />,
    enableHiding: true
  },
  {
    accessorKey: 'mitems_image',
    id: 'Danh mục',
    header: () => <div className='font-semibold'>Danh mục</div>,
    cell: ({ row }) => {
      const menuItems = row.original
      return typeof menuItems.category === 'object' && menuItems.category !== null
        ? menuItems.category.mcat_name
        : 'Chưa có danh mục'
    },
    enableHiding: true
  },

  {
    accessorKey: 'mitems_price',
    id: 'Giá thực đơn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giá thực đơn' />,
    enableHiding: true
  },
  {
    accessorKey: 'mitems_note',
    id: 'Ghi chú',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ghi chú' />,
    enableHiding: true
  },
  {
    accessorKey: 'mitems_description',
    id: 'Mô tả',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    enableHiding: true
  },

  {
    accessorKey: 'mitems_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const menuItems = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          mitems_id: menuItems.mitems_id ? menuItems.mitems_id : '',
          mitems_status: menuItems.mitems_status === 'enable' ? 'disable' : 'enable'
        })
        if (res.statusCode === 200) {
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
      return menuItems.mitems_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'}>
          Vô hiệu hóa
        </Button>
      )
    }
  },

  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const menuItems = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforMenuItems={menuItems} path={pathname} />
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
            <Link href={`/dashboard/menu-items/${menuItems.mitems_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforMenuItems={menuItems} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
