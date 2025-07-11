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
import { updateStatus } from '../ingredient.api'
import { MoreHorizontal } from 'lucide-react'
import { IIngredient } from '../ingredient.interface'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { usePermission } from '@/app/auth/PermissionContext'    
export const columns: ColumnDef<IIngredient>[] = [
  {
    accessorKey: 'igd_name',
    id: 'Tên nguyên liệu',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên nguyên liệu' />,
    enableHiding: true
  },
  {
    accessorKey: 'cat_igd_id',
    id: 'Danh mục',
    header: () => <div className='font-semibold'>Danh mục</div>,
    cell: ({ row }) => {
      const ingredient = row.original
      if (typeof ingredient.cat_igd_id === 'object') {
        return ingredient.cat_igd_id.cat_igd_name
      } else {
        return ''
      }
    }
  },
  {
    accessorKey: 'totalStockInQuantity',
    id: 'Nhập kho',
    header: () => <div className='font-semibold'>Nhập kho</div>,
    cell: ({ row }) => {
      const ingredient = row.original
      if (typeof ingredient.totalStockInQuantity === 'number' && typeof ingredient.unt_id === 'object') {
        return `${ingredient.totalStockInQuantity} ${ingredient.unt_id?.unt_name}`
      } else {
        return ''
      }
    }
  },
  {
    accessorKey: 'totalStockOutQuantity',
    id: 'Đã sử dụng',
    header: () => <div className='font-semibold'>Đã sử dụng</div>,
    cell: ({ row }) => {
      const ingredient = row.original
      if (typeof ingredient.totalStockOutQuantity === 'number' && typeof ingredient.unt_id === 'object') {
        return `${ingredient.totalStockOutQuantity} ${ingredient.unt_id?.unt_name}`
      } else {
        return ''
      }
    }
  },
  {
    accessorKey: 'totalStockInQuantity',
    id: 'Tồn kho hiện tại',
    header: () => <div className='font-semibold'>Tồn kho hiện tại</div>,
    cell: ({ row }) => {
      const ingredient = row.original
      if (
        typeof ingredient.totalStockInQuantity === 'number' &&
        typeof ingredient.totalStockOutQuantity === 'number' &&
        typeof ingredient.unt_id === 'object'
      ) {
        const currentStock = ingredient.totalStockInQuantity - ingredient.totalStockOutQuantity
        let variant: 'secondary' | 'default' | 'destructive' = 'secondary'

        if (currentStock < 0) {
          variant = 'destructive'
        } else if (currentStock < 10) {
          variant = 'default'
        } else {
          variant = 'secondary'
        }

        return (
          <Badge variant={variant}>
            {currentStock} {ingredient.unt_id?.unt_name}
          </Badge>
        )
      } else {
        return ''
      }
    }
  },
  {
    accessorKey: 'igd_image',
    id: 'Ảnh',
    header: () => <div className='font-semibold'>Ảnh</div>,
    cell: ({ row }) => {
      const ingredient = row.original;
      try {
        const parsedImage = JSON.parse(ingredient.igd_image);
        if (parsedImage && parsedImage.image_cloud) {
          return <Image
            src={parsedImage.image_cloud}
            alt='vuducbo'
            width={50}
            height={50}
          />;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    enableHiding: true
  },
  {
    accessorKey: 'igd_description',
    id: 'Mô tả',
    header: () => <div className='font-semibold'>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'igd_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const { hasPermission } = usePermission()
      const router = useRouter()
      const ingredient = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          igd_id: ingredient.igd_id ? ingredient.igd_id : '',
          igd_status: ingredient.igd_status === 'enable' ? 'disable' : 'enable'
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
      return ingredient.igd_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus} disabled={!hasPermission('ingredient_update_status')}>
          Hoạt động
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'} disabled={!hasPermission('ingredient_update_status')}>
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
      const ingredient = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforIngredient={ingredient} path={pathname} />
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
              hasPermission('ingredient_view_detail') && (
                <Link href={`/dashboard/ingredients/view?id=${ingredient.igd_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('ingredient_update') && (
                <Link href={`/dashboard/ingredients/edit?id=${ingredient.igd_id}`} className='cursor-pointer'>
                  <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
                </Link>
              )
            }
            {
              hasPermission('ingredient_delete') && (
                <DropdownMenuItem asChild>
                  <DeleteOrRestore inforIngredient={ingredient} path='delete' />
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
