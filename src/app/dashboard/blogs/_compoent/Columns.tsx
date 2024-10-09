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
import DOMPurify from 'dompurify'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { IBlog } from '../blog.interface'
import { Badge } from '@/components/ui/badge'
import { updateBlogStatus } from '../blog.api'
import DeleteOrRestore from './DeleteOrRestore'

export const columns: ColumnDef<IBlog>[] = [
  {
    accessorKey: 'blg_title',
    id: 'Tiêu đề',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiêu đề' />,
    enableHiding: true
  },
  {
    accessorKey: 'blg_thumbnail',
    id: 'Ảnh',
    header: () => <div>Ảnh</div>,
    cell: ({ row }) => {
      const blog = row.original
      return (
        <Image
          src={blog.blg_thumbnail.image_cloud}
          alt='vuducbo'
          width={100}
          height={100}
          className='w-auto h-auto object-cover'
        />
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'blg_tag',
    id: 'Tag',
    header: () => <div>Tag</div>,
    cell: ({ row }) => {
      const blog = row.original
      return (
        <div className='flex gap-2'>
          {blog.blg_tag.map((tag: string | { _id: string; tag_name: string }, index: number) => (
            <Badge key={index} variant={'outline'}>
              {typeof tag === 'string' ? tag : tag.tag_name}
            </Badge>
          ))}
        </div>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'blg_content',
    id: 'Nội dung',
    header: () => <div>Nội dung</div>,
    cell: ({ row }) => {
      const blog = row.original
      const sanitizedHTML = DOMPurify.sanitize(blog.blg_content)
      return (
        <ScrollArea className='h-[200px] w-[200px] rounded-md border p-4'>
          <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        </ScrollArea>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'blg_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const blog = row.original
      const handleUpdateStatus = async () => {
        const res = await updateBlogStatus({
          _id: blog._id,
          blg_status: blog.blg_status === 'draft' ? 'publish' : 'draft'
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
      return blog.blg_status === 'draft' ? (
        <Button variant={'default'} onClick={handleUpdateStatus}>
          Bản nháp
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'outline'}>
          Public
        </Button>
      )
    }
  },

  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const blog = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforBlog={blog} path={pathname} />
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
            <Link href={`/dashboard/blogs/${blog._id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforBlog={blog} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
