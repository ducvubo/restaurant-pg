'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { setCookieRefreshTokenGuest } from '../guest.api'
import { useLoading } from '@/context/LoadingContext'

export default function SignInAgain() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const param = useParams().slug
  const setCookie = async () => {
    setLoading(true)
    await setCookieRefreshTokenGuest(param as string)
    router.push('/guest/order')
  }
  useEffect(() => {
    if (param) {
      setCookie()
    } else {
      setLoading(true)
      router.push('/')
    }
    return () => {
      setLoading(false)
    }
  }, [param])
  return <div></div>
}
