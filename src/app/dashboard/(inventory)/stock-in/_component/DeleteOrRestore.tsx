'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { IStockIn } from '../stock-in.interface'
import { deleteStockIn, restoreStockIn } from '../stock-in.api'
import { usePermission } from '@/app/auth/PermissionContext'
interface Props {
  inforStockIn: IStockIn
  path: 'recycle' | 'delete'
}
export default function DeleteOrRestore({ inforStockIn, path }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleDeleteUnit = async (stki_id: string) => {
    setLoading(true)
    const res = path === 'recycle' ? await restoreStockIn({ stki_id }) : await deleteStockIn({ stki_id })
    if (res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description:
          path === 'recycle' ? 'Khôi phục phiếu nhập thành công' : 'Chuyển phiếu nhập vào thùng rác thành công',
        variant: 'default'
      })
      router.refresh()
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {path === 'recycle' ? (
          <Button disabled={!hasPermission('stock_in_restore')}>Khôi phục</Button>
        ) : (
          <div
            role='menuitem'
            className='relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer'
            data-orientation='vertical'
            data-radix-collection-item=''
          >
            Xóa
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{path === 'delete' ? 'Xóa phiếu nhập' : 'Khôi phục phiếu nhập'} </AlertDialogTitle>
          <AlertDialogDescription>
            {path === 'delete'
              ? `Bạn có chắc muốn chuyển phiếu nhập '${inforStockIn.stki_code}' vào thùng rác không?`
              : `Bạn có chắc muốn khôi phục phiếu nhập '${inforStockIn.stki_code}' không?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteUnit(inforStockIn.stki_id ? inforStockIn.stki_id : '')}>
            Có
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
