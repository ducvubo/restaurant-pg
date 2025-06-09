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
import { IFoodComboRes } from '../food-combos.interface'
import Image from 'next/image'
import { updateStateFoodCombo, updateStatusFoodCombo } from '../food-combos.api'
import DeleteOrRestore from './DeleteOrRestore'
export const columns: ColumnDef<IFoodComboRes>[] = [
  {
    accessorKey: 'fcb_name',
    // id: 'Tên combo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên combo' />,
    enableHiding: true
  },
  {
    accessorKey: 'fcb_image',
    // id: 'Giá',
    header: () => <div className='font-semibold'>Ảnh</div>,
    cell: ({ row }) => {
      const food = row.original
      return <Image src={JSON.parse(food.fcb_image).image_cloud} alt='vuducbo' width={50} height={50} />
    },
    enableHiding: true
  },
  {
    accessorKey: 'fcb_price',
    id: 'Giá',
    header: () => <div className='font-semibold'>Giá</div>,
    cell: ({ row }) => {
      const food = row.original
      return `${food.fcb_price.toLocaleString()} đ`
    },
    enableHiding: true
  },
  {
    accessorKey: 'fcb_open_time',
    // id: 'Giá',
    header: () => <div className='font-semibold'>Giờ bán</div>,
    cell: ({ row }) => {
      const food = row.original
      return `${food.fcb_open_time} - ${food.fcb_close_time}`
    },
    enableHiding: true
  },
  {
    accessorKey: 'fcb_note',
    // id: 'Ghi chú',
    header: () => <div className='font-semibold'>Ghi chú</div>,
    enableHiding: true
  },
  {
    accessorKey: 'fcb_description',
    // id: 'Mô tả',
    header: () => <div className='font-semibold'>Mô tả</div>,
    cell: ({ row }) => {
      const food = row.original
      return <div dangerouslySetInnerHTML={{ __html: food.fcb_description }} />
    },
    enableHiding: true
  },
  {
    accessorKey: 'food',
    // id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const food = row.original
      const handleUpdateState = async (fcb_state: 'soldOut' | 'inStock' | 'almostOut') => {
        const res = await updateStateFoodCombo({
          fcb_id: food.fcb_id,
          fcb_state: fcb_state
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
          value={food.fcb_state}
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
    accessorKey: 'fcb_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const foodCombo = row.original
      const router = useRouter()
      const handleUpdateStatus = async () => {
        const res = await updateStatusFoodCombo({
          fcb_id: foodCombo.fcb_id,
          fcb_status: foodCombo.fcb_status === 'enable' ? 'disable' : 'enable'
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
      return foodCombo.fcb_status === 'enable' ? (
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
    accessorKey: 'Thao tác',
    // id: 'Thao tác',
    cell: ({ row }) => {
      const foodCombo = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforFoodCombo={foodCombo} path={pathname} />
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
            <Link href={`/dashboard/food-combos/edit?id=${foodCombo.fcb_id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforFoodCombo={foodCombo} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
