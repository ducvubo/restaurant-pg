'use client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { QRCodeSVG } from 'qrcode.react'
import { IDish } from '../dishes.interface'
import DOMPurify from 'dompurify'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import DeleteOrRestore from './DeleteOrRestore'
import { updateStatus } from '../dishes.api'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

export const columns: ColumnDef<IDish>[] = [
  {
    accessorKey: 'dish_name',
    id: 'Tên món',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên món' />,
    enableHiding: true
  },
  {
    accessorKey: 'dish_image',
    id: 'Ảnh',
    header: () => <div>Ảnh</div>,
    cell: ({ row }) => {
      const dish = row.original
      return (
        <Image
          src={dish.dish_image.image_cloud}
          alt='vuducbo'
          width={100}
          height={100}
          className='w-14 h-14 object-cover'
        />
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'dish_short_description',
    id: 'Giới thiệu ngắn',
    header: () => <div>Giới thiệu ngắn</div>,
    enableHiding: true
  },
  {
    accessorKey: 'dish_price',
    id: 'Giá',
    cell: ({ row }) => {
      const dish = row.original
      return `${dish.dish_price.toLocaleString()} đ`
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giá' />,
    enableHiding: true
  },
  {
    accessorKey: 'dish_sale',
    id: 'Giảm giá',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giảm giá' />,
    cell: ({ row }) => {
      const dish = row.original
      return (
        <div>
          {!dish.dish_sale ? (
            <span className='text-success'>Không</span>
          ) : (
            <div className='flex flex-col'>
              <span className='text-danger'>
                Giảm:{' '}
                {dish.dish_sale.sale_type === 'percentage'
                  ? `${dish.dish_sale.sale_value}%`
                  : `${dish.dish_sale.sale_value.toLocaleString()}đ`}
              </span>
              <span className='text-danger'>
                Giá sau khi giảm:
                {dish.dish_sale.sale_type === 'percentage'
                  ? (dish.dish_price - (dish.dish_price * dish.dish_sale.sale_value) / 100).toLocaleString()
                  : (dish.dish_price - dish.dish_sale.sale_value).toLocaleString()}{' '}
                đ
              </span>
            </div>
          )}
        </div>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'dish_priority',
    id: 'Độ ưu tiên',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Độ ưu tiên' />,
    enableHiding: true
  },
  {
    accessorKey: 'dish_note',
    id: 'Ghi chú',
    header: () => <div>Ghi chú</div>,
    enableHiding: true
  },
  // {
  //   accessorKey: 'dish_description',
  //   id: 'Mô tả',
  //   header: () => <div>Mô tả</div>,
  //   cell: ({ row }) => {
  //     const dish = row.original
  //     const sanitizedHTML = DOMPurify.sanitize(dish.dish_description)
  //     return (
  //       <ScrollArea className='h-[200px] w-[200px] rounded-md border p-4'>
  //         <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  //       </ScrollArea>
  //     )
  //   },
  //   enableHiding: true
  // },
  {
    accessorKey: 'dish_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const dish = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          _id: dish._id,
          dish_status: dish.dish_status === 'enable' ? 'disable' : 'enable'
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
      return dish.dish_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermissionKey('dish_list_update_status')}>
          Đang bán
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermissionKey('dish_list_update_status')}>
          Ngưng bán
        </Button>
      )
    }
  },

  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const dish = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforDish={dish} path={pathname} />
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
              hasPermissionKey('dish_list_update') && (
                <Link href={`/dashboard/dishes/edit?id=${dish._id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermissionKey('dish_list_view_detail') && (
                <Link href={`/dashboard/dishes/view?id=${dish._id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermissionKey('dish_list_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforDish={dish} path='delete' />
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
