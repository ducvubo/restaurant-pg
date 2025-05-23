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
import { Ban, CheckCircle, Clock, Download, MoreHorizontal, Send, Upload, XCircle } from 'lucide-react'
import { IArticle } from '../article.interface'
import {
  approveArticle,
  publishArticle,
  rejectArticle,
  sendArticle,
  unpublishArticle,
  unpublishScheduleArticle
} from '../article.api'
import DeleteOrRestore from './DeleteOrRestore'

export const columns: ColumnDef<IArticle>[] = [
  {
    accessorKey: 'atlImage',
    id: 'Ảnh',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh' />,
    enableHiding: true,
    cell: ({ row }) => {
      const article = row.original
      return (
        <div className='flex items-center'>
          <img src={JSON.parse(article.atlImage).image_cloud} alt={article.atlTitle} className='w-10 h-10 ' />
        </div>
      )
    }
  },
  {
    accessorKey: 'atlTitle',
    id: 'Tiêu đề',
    header: () => <div className='font-semibold'>Tiêu đề</div>,
    enableHiding: true
  },
  //atlView
  {
    accessorKey: 'atlView',
    id: 'Lượt xem',
    header: () => <div className='font-semibold'>Lượt xem</div>,
    cell: ({ row }) => {
      const article = row.original
      return (
        <div className='flex items-center'>
          <span>{article.atlView}</span>
        </div>
      )
    },
    enableHiding: true
  },

  {
    accessorKey: 'atlType',
    id: 'Loại',
    header: () => <div className='font-semibold'>Loại</div>,
    // atlType: 'DEFAULT' | 'VIDEO' | 'IMAGE'
    cell: ({ row }) => {
      const article = row.original
      return (
        <div className='flex items-center gap-2'>
          {article.atlType === 'DEFAULT' && <span>Mặc định</span>}
          {article.atlType === 'VIDEO' && <span>Video</span>}
          {article.atlType === 'IMAGE' && <span>Ảnh</span>}
        </div>
      )
    },
    enableHiding: true
  },

  {
    accessorKey: 'atlStatus',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const article = row.original

      // 1: Gửi phê duyệt
      // 2: Duyệt bài viết
      // 3: Xuất bản
      // 4: Lên lịch xuất bản
      // 5: Hủy xuất bản
      // 6: Hủy lịch xuất bản
      // 7: Từ chối bài viết

      const handleUpdateStatus = async (type: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
        let res
        const id = article.atlId
        if (type === 1) {
          res = await sendArticle(id)
        }
        if (type === 2) {
          res = await approveArticle(id)
        }
        if (type === 3) {
          res = await publishArticle(id)
        }
        if (type === 4) {
          // lên lịch xuất bản
        }
        if (type === 5) {
          res = await unpublishArticle(id)
        }
        if (type === 6) {
          res = await unpublishScheduleArticle(id)
        }
        if (type === 7) {
          res = await rejectArticle(id)
        }

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

      if (article.isDeleted === 0) {
        if (article.atlStatus === 'DRAFT') {
          return (
            <div
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={() => handleUpdateStatus(1)}
              title='Gửi phê duyệt'
            >
              <Send size={20} />
            </div>
          )
        }
        if (article.atlStatus === 'PENDING_APPROVAL') {
          return (
            <div className='flex gap-2'>
              <div
                className='cursor-pointer text-red-500 hover:text-red-700'
                onClick={() => handleUpdateStatus(7)}
                title='Bài viết không đạt'
              >
                <XCircle size={20} />
              </div>
              <div
                className='cursor-pointer text-green-500 hover:text-green-700'
                onClick={() => handleUpdateStatus(2)}
                title='Duyệt bài viết'
              >
                <CheckCircle size={20} />
              </div>
            </div>
          )
        }
        if (article.atlStatus === 'REJECTED') {
          return (
            <div
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={() => handleUpdateStatus(1)}
              title='Gửi phê duyệt'
            >
              <Send size={20} />
            </div>
          )
        }
        if (article.atlStatus === 'PENDING_PUBLISH') {
          return (
            <div className='flex gap-2'>
              <div
                className='cursor-pointer text-purple-500 hover:text-purple-700'
                onClick={() => handleUpdateStatus(3)}
                title='Xuất bản'
              >
                <Upload size={20} />
              </div>
              <div
                className='cursor-pointer text-yellow-500 hover:text-yellow-700'
                onClick={() => handleUpdateStatus(4)}
                title='Lên lịch xuất bản'
              >
                <Clock size={20} />
              </div>
            </div>
          )
        }
        if (article.atlStatus === 'PUBLISH_SCHEDULE') {
          return (
            <div
              className='cursor-pointer text-red-500 hover:text-red-700'
              onClick={() => handleUpdateStatus(6)}
              title='Hủy lịch xuất bản'
            >
              <Clock size={20} />
            </div>
          )
        }
        if (article.atlStatus === 'PUBLISHED') {
          return (
            <div
              className='cursor-pointer text-orange-500 hover:text-orange-700'
              onClick={() => handleUpdateStatus(5)}
              title='Hủy xuất bản'
            >
              <Ban size={20} />
            </div>
          )
        }
        if (article.atlStatus === 'UNPUBLISHED') {
          return (
            <div
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={() => handleUpdateStatus(1)}
              title='Gửi phê duyệt'
            >
              <Send size={20} />
            </div>
          )
        }
      }
    }
  },
  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const article = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforArticle={article} path={pathname} />
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
            <Link href={`/dashboard/article/${article.atlId}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            {(article.atlStatus === 'DRAFT' || article.atlStatus === 'REJECTED' || article.atlStatus === 'UNPUBLISHED') && (
              <DropdownMenuItem asChild>
                <DeleteOrRestore inforArticle={article} path='delete' />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
