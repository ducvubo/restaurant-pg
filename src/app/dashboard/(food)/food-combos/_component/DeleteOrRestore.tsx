'use client'

import React, { useEffect } from 'react'
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
import { deleteFoodCombo, restoreFoodCombo } from '../food-combos.api'
import { IFoodComboRes } from '../food-combos.interface'
import { usePermission } from '@/app/auth/PermissionContext'
interface Props {
  inforFoodCombo: IFoodComboRes
  path: 'recycle' | 'delete'
}
export default function DeleteOrRestore({ inforFoodCombo, path }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleDeleteFoodCombo = async (food_id: string) => {
    setLoading(true)
    const res = path === 'recycle' ? await restoreFoodCombo(food_id) : await deleteFoodCombo(food_id)
    if (res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: path === 'recycle' ? 'Khôi phục món ăn thành công' : 'Chuyển món ăn vào thùng rác thành công',
        variant: 'default'
      })
      router.refresh()
    } else if (res.statusCode === 404) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Món ăn không tồn tại, vui lòng thử lại sau',
        variant: 'destructive'
      })
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
          <Button disabled={!hasPermission('food_combo_restore')}>Khôi phục</Button>
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
          <AlertDialogTitle>{path === 'delete' ? 'Xóa món ăn' : 'Khôi phục món ăn'} </AlertDialogTitle>
          <AlertDialogDescription>
            {path === 'delete'
              ? `Bạn có chắc muốn chuyển món ăn '${inforFoodCombo.fcb_name}' vào thùng rác không?`
              : `Bạn có chắc muốn khôi phục món ăn '${inforFoodCombo.fcb_name}' không?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteFoodCombo(inforFoodCombo.fcb_id)}>Có</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
