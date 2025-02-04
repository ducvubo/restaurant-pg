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
    accessorKey: 'unt_id',
    id: 'Đơn vị đo',
    header: () => <div className='font-semibold'>Đơn vị đo</div>,
    cell: ({ row }) => {
      const ingredient = row.original
      if (typeof ingredient.unt_id === 'object') {
        return ingredient.unt_id.unt_name
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
      const ingredient = row.original
      return <Image src={JSON.parse(ingredient.igd_image).image_cloud} alt='vuducbo' width={50} height={50} />
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={`/dashboard/ingredients/${ingredient.igd_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforIngredient={ingredient} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
