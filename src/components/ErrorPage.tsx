'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <Card className="relative overflow-hidden border-none shadow-xl dark:shadow-gray-800/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-50" />
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
            >
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 animate-pulse" />
            </motion.div>
            <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Ôi, có gì đó không ổn!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Đã xảy ra lỗi không mong muốn
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Đừng lo, chúng tôi sẽ khắc phục sớm! Vui lòng thử lại hoặc liên hệ với quản trị viên nếu sự cố vẫn tiếp diễn.
            </p>
            {/* <div className="flex justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Quay lại
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    Về trang chủ
                  </Button>
                </Link>
              </motion.div>
            </div> */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}