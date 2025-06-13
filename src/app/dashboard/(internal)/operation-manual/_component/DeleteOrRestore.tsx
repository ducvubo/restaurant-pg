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
import { IOperationManual } from '../operation-manual.interface'
import { deleteOperationManual, restoreOperationManual } from '../operation-manual.api'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface Props {
  inforOperationManual: IOperationManual
  path: 'recycle' | 'delete'
}
export default function DeleteOrRestore({ inforOperationManual, path }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const handleDeleteOperationManual = async (opera_manual_id: string) => {
    setLoading(true)
    const res = path === 'recycle' ? await restoreOperationManual({ opera_manual_id }) : await deleteOperationManual({ opera_manual_id })
    if (res.statusCode === 201) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: path === 'recycle' ? 'Khôi phục tài liệu hướng dẫn vận hành thành công' : 'Chuyển tài liệu hướng dẫn vận hành vào thùng rác thành công',
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
          <Button disabled={!hasPermissionKey('operation_manual_restore')}>Khôi phục</Button>
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
          <AlertDialogTitle>{path === 'delete' ? 'Xóa tài liệu hướng dẫn vận hành' : 'Khôi phục tài liệu hướng dẫn vận hành'} </AlertDialogTitle>
          <AlertDialogDescription>
            {path === 'delete'
              ? `Bạn có chắc muốn chuyển tài liệu hướng dẫn vận hành '${inforOperationManual.opera_manual_title}' vào thùng rác không?`
              : `Bạn có chắc muốn khôi phục tài liệu hướng dẫn vận hành '${inforOperationManual.opera_manual_title}' không?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteOperationManual(inforOperationManual.opera_manual_id ? inforOperationManual.opera_manual_id : '')}>Có</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
