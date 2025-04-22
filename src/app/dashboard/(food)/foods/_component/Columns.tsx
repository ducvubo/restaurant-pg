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
import Image from 'next/image'
import { updateStateFood, updateStatusFood } from '../food.api'
import DeleteOrRestore from './DeleteOrRestore'
export const columns: ColumnDef<IFood>[] = [
  {
    accessorKey: 'food_name',
    id: 'Tên món ăn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên món ăn' />,
    enableHiding: true
  },
  {
    accessorKey: 'food_image',
    id: 'Ảnh',
    header: () => <div className='font-semibold'>Ảnh</div>,
    cell: ({ row }) => {
      const food = row.original
      return <Image src={JSON.parse(food.food_image)[0].image_cloud} alt='vuducbo' width={50} height={50} />
    },
    enableHiding: true
  },
  {
    accessorKey: 'food_price',
    id: 'Giá',
    header: () => <div className='font-semibold'>Giá</div>,
    cell: ({ row }) => {
      const food = row.original
      return `${food.food_price.toLocaleString()} đ`
    },
    enableHiding: true
  },
  {
    accessorKey: 'food_note',
    id: 'Ghi chú',
    header: () => <div className='font-semibold'>Ghi chú</div>,
    enableHiding: true
  },
  {
    accessorKey: 'food_description',
    id: 'Mô tả',
    header: () => <div className='font-semibold'>Mô tả</div>,
    cell: ({ row }) => {
      const food = row.original
      return <div dangerouslySetInnerHTML={{ __html: food.food_description }} />
    },
    enableHiding: true
  },
  {
    accessorKey: 'food',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const food = row.original
      const handleUpdateState = async (food_state: 'soldOut' | 'inStock' | 'almostOut') => {
        const res = await updateStateFood({
          food_id: food.food_id,
          food_state: food_state
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

      return (
        <Select
          value={food.food_state}
          onValueChange={(value: 'soldOut' | 'inStock' | 'almostOut') => handleUpdateState(value)}
        >
          <SelectTrigger className='w-[153px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='soldOut'>Hết hàng</SelectItem>
              <SelectItem value='inStock'>Có sẵn</SelectItem>
              <SelectItem value='almostOut'>Sắp hết</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }
  },
  {
    accessorKey: 'food_status',
    // id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const food = row.original
      const router = useRouter()
      const handleUpdateStatus = async () => {
        const res = await updateStatusFood({
          food_id: food.food_id,
          food_status: food.food_status === 'enable' ? 'disable' : 'enable'
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
      return food.food_status === 'enable' ? (
        <Button variant={'outline'} onClick={handleUpdateStatus}>
          Đang bán
        </Button>
      ) : (
        <Button onClick={handleUpdateStatus} variant={'destructive'}>
          Ngừng bán
        </Button>
      )
    }
  },

  {
    accessorKey: 'Actions',
    // id: 'Actions',
    cell: ({ row }) => {
      const food = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforFood={food} path={pathname} />
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
            <Link href={`/dashboard/foods/${food.food_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforFood={food} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
