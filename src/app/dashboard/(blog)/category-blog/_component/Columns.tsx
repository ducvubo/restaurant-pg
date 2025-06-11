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
import { updateStatus } from '../category-blog.api'
import { MoreHorizontal } from 'lucide-react'
import { ICategory } from '../category-blog.interface'

export const columns: ColumnDef<ICategory>[] = [
  {
    accessorKey: 'catName',
    id: 'Tên danh mục',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên danh mục' />,
    enableHiding: true
  },
  {
    accessorKey: 'catSlug',
    id: 'Slug',
    header: () => <div className='font-semibold'>Slug</div>,
    enableHiding: true
  },
  {
    accessorKey: 'catDescription',
    id: 'Mô tả',
    header: () => <div className='font-semibold'>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'catOrder',
    id: 'Thứ tự',
    header: () => <div className='font-semibold'>Thứ tự</div>,
    enableHiding: true
  },
  {
    accessorKey: 'catStatus',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const cat = row.original
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          catId: cat.catId ? cat.catId : '',
          catStatus: cat.catStatus === 'ENABLED' ? 'DISABLED' : 'ENABLED'
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
      return cat.catStatus === 'ENABLED' ? (
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
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const cat = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforCategory={cat} path={pathname} />
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
            <Link href={`/dashboard/category-blog/edit?id=${cat.catId}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/category-blog/view?id=${cat.catId}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforCategory={cat} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
