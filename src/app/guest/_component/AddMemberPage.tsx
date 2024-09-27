'use client'
import { sendRequest } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { generateTokenAddMember } from '../guest.api'
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'

export default function AddMemberPage() {
  const { setLoading } = useLoading()
  const [token, setToken] = useState('')

  const getToken = async () => {
    setLoading(true)
    const res: IBackendRes<string> = await generateTokenAddMember()
    console.log(res)
    if (res.statusCode === 201 && res.data) {
      setLoading(false)
      // toast({
      //   title: 'Thành công',
      //   description: 'Đặt hàng thành công',
      //   variant: 'default'
      // })
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
    } else {
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau ít phút',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    getToken()
  }, [])
  console.log(token)

  const url = `${process.env.NEXT_PUBLIC_URL_CLIENT}/guest/table/add-member?token=${token}`

  return (
    <div>
      <h1>Thêm thành viên</h1>
      <QRCodeSVG value={url} />
      <Link target='_blank' href={`/guest/table/add-member?token=${token}`} className='w-40 h-auto'>
        {url}
      </Link>
    </div>
  )
}
