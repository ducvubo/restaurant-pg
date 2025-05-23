'use client'
import { sendRequest } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { generateTokenAddMember } from '../guest.api'
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import { deleteCookiesAndRedirect, deleteCookiesAndRedirectGuest } from '@/app/actions/action'

export default function AddMemberPage() {
  const { setLoading } = useLoading()
  const [token, setToken] = useState('')

  const getToken = async () => {
    setLoading(true)
    const res: IBackendRes<string> = await generateTokenAddMember()
    if (res.statusCode === 201 && res.data) {
      setLoading(false)
      setToken(res.data)
    } else if (res?.code === 400) {
      setLoading(false)
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
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại, hoặc liên hệ nhân viên',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirectGuest()
    } else {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: res.message ? res.message : 'Đã xảy ra lỗi, vui lòng thử lại sau ít phút',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  const url = `${process.env.NEXT_PUBLIC_URL_CLIENT}/guest/table/add-member?token=${token}`

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-5'>Thêm thành viên</h1>
      <Link target='_blank' href={`/guest/table/add-member?token=${token}`} className='w-auto h-auto'>
        <QRCodeSVG value={url} className='w-80' />
      </Link>
      <span className='mt-3'>Thành viên quét QR để gọi món </span>
    </div>
  )
}
