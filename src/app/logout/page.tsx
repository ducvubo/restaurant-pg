'use client'
import React, { useEffect } from 'react'
import { deleteCookiesAndRedirect } from '../actions/action'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export default function LogoutPage() {
  useEffect(() => {
    toast({
      title: 'Lỗi',
      description: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
      variant: 'destructive'
    })
    deleteCookiesAndRedirect()
  }, [])
  return <></>
}
