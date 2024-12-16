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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { IFood } from '../food.interface'
export const columns: ColumnDef<IFood>[] = [
  {
    accessorKey: 'food_name',
    id: 'Tên món ăn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên món ăn' />,
    enableHiding: true
  },
  {
    accessorKey: 'food_cat_id',
    id: 'Danh mục',
    header: () => <div>Danh mục</div>,
    enableHiding: true
  },
  {
    accessorKey: 'food_price',
    id: 'Giá',
    header: () => <div>Giá</div>,
    cell: ({ row }) => {
      const food = row.original
      return `${food.food_price.toLocaleString()} đ`
    },
    enableHiding: true
  },
  {
    accessorKey: 'food_note',
    id: 'Ghi chú',
    header: () => <div>Ghi chú</div>,
    enableHiding: true
  },
  {
    accessorKey: 'food_description',
    id: 'Mô tả',
    header: () => <div>Mô tả</div>,
    enableHiding: true
  },
  // {
  //   accessorKey: 'tbl_status',
  //   id: 'Trạng thái',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
  //   enableHiding: true,
  //   cell: ({ row }) => {
  //     const router = useRouter()
  //     const table = row.original
  //     const handleUpdateStatus = async (table_status: 'enable' | 'disable' | 'serving') => {
  //       const res = await updateStatus({
  //         _id: table._id,
  //         tbl_status: table_status
  //       })
  //       if (res.statusCode === 200) {
  //         toast({
  //           title: 'Thành công',
  //           description: 'Cập nhật trạng thái thành công',
  //           variant: 'default'
  //         })
  //         router.refresh()
  //       } else if (res.statusCode === 400) {
  //         if (Array.isArray(res.message)) {
  //           res.message.map((item: string) => {
  //             toast({
  //               title: 'Thất bại',
  //               description: item,
  //               variant: 'destructive'
  //             })
  //           })
  //         } else {
  //           toast({
  //             title: 'Thất bại',
  //             description: res.message,
  //             variant: 'destructive'
  //           })
  //         }
  //       } else if (res.code === -10) {
  //         toast({
  //           title: 'Thông báo',
  //           description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
  //           variant: 'destructive'
  //         })
  //         await deleteCookiesAndRedirect()
  //       } else if (res.code === -11) {
  //         toast({
  //           title: 'Thông báo',
  //           description:
  //             'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
  //           variant: 'destructive'
  //         })
  //       } else {
  //         toast({
  //           title: 'Thất bại',
  //           description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  //           variant: 'destructive'
  //         })
  //       }
  //     }

  //     if (table.tbl_status === 'reserve') {
  //       return <Button disabled>Đang phục vụ</Button>
  //     }

  //     return (
  //       <Select
  //         value={table.tbl_status}
  //         onValueChange={(value: 'enable' | 'disable' | 'serving') => handleUpdateStatus(value)}
  //       >
  //         <SelectTrigger className='w-[153px]'>
  //           <SelectValue placeholder='Trạng thái' />
  //         </SelectTrigger>
  //         <SelectContent>
  //           <SelectGroup>
  //             <SelectLabel>Chọn trạng thái</SelectLabel>
  //             <SelectItem value='enable'>Có sẵn</SelectItem>
  //             <SelectItem value='disable'>Không có sẵn</SelectItem>
  //             <SelectItem value='serving'>Đã đặt trước</SelectItem>
  //             {/* <SelectItem value='reserve'>Đang phục vụ</SelectItem> */}
  //           </SelectGroup>
  //         </SelectContent>
  //       </Select>
  //     )
  //   }
  // },

  // {
  //   accessorKey: 'Actions',
  //   id: 'Actions',
  //   cell: ({ row }) => {
  //     const table = row.original
  //     const pathname = usePathname().split('/').pop()
  //     if (pathname === 'recycle') {
  //       return <DeleteOrRestore inforTable={table} path={pathname} />
  //     }
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant='ghost' className='h-8 w-8 p-0'>
  //             <span className='sr-only'>Open menu</span>
  //             <MoreHorizontal className='h-4 w-4' />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align='end'>
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>

  //           <DropdownMenuSeparator />
  //           <Link href={`/dashboard/tables/${table._id}`} className='cursor-pointer'>
  //             <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
  //           </Link>
  //           <DropdownMenuItem asChild>
  //             <DeleteOrRestore inforTable={table} path='delete' />
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  //   enableHiding: true
  // }
]
