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
import { IEmployee } from '../employees.interface'
import Link from 'next/link'
import DeleteOrRestore from './DeleteOrRestore'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { updateStatus } from '../employees.api'
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import RegisterFaceUpload from './RegisterFaceUpload'
// import RegisterFace from './RegisterFace'
const RegisterFace = dynamic(() => import('./RegisterFace'), {
  ssr: false,
})
export const columns: ColumnDef<IEmployee>[] = [
  {
    accessorKey: 'epl_name',
    id: 'Tên',
    header: () => <div>Tên</div>,
    enableHiding: true
  },
  //avatar
  {
    accessorKey: 'epl_avatar',
    id: 'Avatar',
    header: () => <div>Avatar</div>,
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className='flex items-center space-x-2'>
          <Image
            src={employee.epl_avatar?.image_cloud}
            alt={employee.epl_name}
            width={40}
            height={40}
            className='h-10 w-10 rounded-full object-cover'
          />
        </div>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'epl_email',
    id: 'Email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    enableHiding: true
  },
  {
    accessorKey: 'epl_face_id',
    id: 'Khuôn mặt',
    header: () => <div>Khuôn mặt</div>,
    enableHiding: true,
    cell: ({ row }) => {
      const employee = row.original
      return employee.epl_face_id ? (
        <div >Đã đăng ký</div>
      ) : (
        <div>Chưa đăng ký</div>
      )
    }
  },
  {
    accessorKey: 'epl_phone',
    id: 'Số điện thoại',
    header: () => <div>Số điện thoại</div>,
    enableHiding: true
  },
  {
    accessorKey: 'epl_address',
    id: 'Địa chỉ',
    header: () => <div>Địa chỉ</div>,
    enableHiding: true
  },
  {
    accessorKey: 'epl_gender',
    id: 'Giới tính',
    header: () => <div>Giới tính</div>,
    enableHiding: true
  },
  {
    accessorKey: 'epl_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const employee = row.original
      const router = useRouter()
      const handleUpdateStatus = async () => {
        const res = await updateStatus({
          _id: employee._id,
          epl_status: employee.epl_status === 'enable' ? 'disable' : 'enable'
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
        } else if (res.statusCode === 404) {
          toast({
            title: 'Thông báo',
            description: 'Nhân viên không tồn tại, vui lòng thử lại sau',
            variant: 'destructive'
          })
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
      return employee.epl_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus}>
          Đang làm
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'}>
          Nghỉ làm
        </Button>
      )
    }
  },

  {
    accessorKey: 'Thao tác',
    id: 'Thao tác',
    cell: ({ row }) => {
      const employees = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforEmployee={employees} path={pathname} />
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
            <Link href={`/dashboard/employees/edit?id=${employees._id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/employees/view?id=${employees._id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Xem</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforEmployee={employees} path='delete' />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <RegisterFace inforEmployee={employees} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <RegisterFaceUpload inforEmployee={employees} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
