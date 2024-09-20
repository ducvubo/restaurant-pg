'use client'
import { toast } from '@/hooks/use-toast'
import React from 'react'

export default function ToastServer({
  message,
  title,
  variant
}: {
  message: string
  title: string
  variant?: 'default' | 'destructive'
}) {
  toast({
    title,
    description: message,
    variant
  })
  return null
}
