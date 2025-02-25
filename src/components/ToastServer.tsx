'use client'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function ToastServer({
  message,
  title,
  variant,
  route
}: {
  message: string
  title: string
  variant?: 'default' | 'destructive'
  route?: string
}) {
  const router = useRouter()
  toast({
    title,
    description: message,
    variant
  })
  if (route) {
    router.push(route)
  }
  return null
}
