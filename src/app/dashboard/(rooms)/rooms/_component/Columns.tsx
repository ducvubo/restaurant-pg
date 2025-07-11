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
import { updateStatus } from '../rooms.api'
import { MoreHorizontal } from 'lucide-react'
import { IRoom } from '../rooms.interface'
import Image from 'next/image'
import { usePermission } from '@/app/auth/PermissionContext'
export const columns: ColumnDef<IRoom>[] = [
  {
    accessorKey: 'room_images',
    id: 'Ảnh',
    header: () => <div className='font-semibold'>Ảnh</div>,
    cell: ({ row }) => {
      const room = row.original;
      let imageUrl = null;

      try {
        const images = JSON.parse(room.room_images);
        if (Array.isArray(images) && images.length > 0 && images[0].image_cloud) {
          imageUrl = images[0].image_cloud;
        }
      } catch (e) {
      }

      return imageUrl ? (
        <Image src={imageUrl} alt='Ảnh phòng' width={50} height={50} />
      ) : null;
    },
    enableHiding: true
  },
  {
    accessorKey: 'room_name',
    id: 'Tên phòng/sảnh',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phòng/sảnh' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_fix_ame',
    id: 'Tiện ích có sẵn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiện ích có sẵn' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_max_guest',
    id: 'Lượng khách tối đa',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Lượng khách tối đa' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_base_price',
    id: 'Giá cơ bản',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giá cơ bản' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_area',
    id: 'Diện tích phòng/sảnh',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Diện tích phòng/sảnh' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_note',
    id: 'Ghi chú',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ghi chú' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_description',
    id: 'Mô tả',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    enableHiding: true
  },
  {
    accessorKey: 'room_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const router = useRouter()
      const amenities = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          room_id: amenities.room_id ? amenities.room_id : '',
          room_status: amenities.room_status === 'enable' ? 'disable' : 'enable'
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
      return amenities.room_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermission('room_update_status')}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermission('room_update_status')}>
          Vô hiệu hóa
        </Button>
      )
    }
  },

  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const amenities = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforRoom={amenities} path={pathname} />
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
            {
              hasPermission('room_view_detail') && (
                <Link href={`/dashboard/rooms/view?id=${amenities.room_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('room_update') && (
                <Link href={`/dashboard/rooms/edit?id=${amenities.room_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('room_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforRoom={amenities} path='delete' />
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
