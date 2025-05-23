'use client'

import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { ModeToggle } from '@/components/mode-toggle'
import { UserNav } from '@/components/admin-panel/user-nav'
import { SheetMenu } from '@/components/admin-panel/sheet-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getAllNotificationPagination,
  getCountNotification,
  readOneNotification,
  readAllNotification,
} from '../../app/auth/notification.api'
import {
  appendNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateNotificationCounts,
  INotification,
} from '../../app/auth/notification.slice'

interface NavbarProps {
  title: string
}

export function Navbar({ title }: NavbarProps) {
  const dispatch = useDispatch()
  const inforNotification = useSelector((state: RootState) => state.inforNotification)
  const { notifications, unreadNoti } = inforNotification

  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 10
  const notificationContainerRef = useRef<HTMLDivElement>(null)
  const fetchInitialData = async () => {
    try {
      const countRes = await getCountNotification()
      if (countRes.data && countRes.statusCode === 200) {
        dispatch(
          updateNotificationCounts({
            totalNoti: countRes.data.totalNoti,
            unreadNoti: countRes.data.unreadNoti,
          })
        )
      }

      // Fetch first page of notifications
      await loadMoreNotifications()
    } catch (error) {
      console.error('Lỗi khi tải thông báo ban đầu:', error)
    }
  }
  useEffect(() => {
    fetchInitialData()
  }, [dispatch])

  // Load more notifications
  const loadMoreNotifications = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const res = await getAllNotificationPagination({ offset, limit })
      if (res.data && res.data.data) {
        dispatch(appendNotifications(res.data.data))
        setOffset((prev) => prev + limit)

        // Update counts after fetching new notifications
        const countRes = await getCountNotification()
        if (countRes.data && countRes.statusCode === 200) {
          dispatch(
            updateNotificationCounts({
              totalNoti: countRes.data.totalNoti,
              unreadNoti: countRes.data.unreadNoti,
            })
          )
          // Chỉ đặt hasMore thành false nếu totalNoti bằng số thông báo đã tải
          if (countRes.data.totalNoti <= offset + res.data.data.length) {
            setHasMore(false)
          }
        }
      } else {
        setHasMore(false) // Không có dữ liệu trả về, dừng tải
      }
    } catch (error) {
      console.error('Lỗi khi tải thêm thông báo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle scroll event for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!notificationContainerRef.current || isLoading || !hasMore) return

      const { scrollTop, scrollHeight, clientHeight } = notificationContainerRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

      if (isNearBottom) {
        loadMoreNotifications()
      }
    }

    const container = notificationContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [isLoading, hasMore])

  const runMarkNotificationAsRead = (noti_id: string) => {
    dispatch(markNotificationAsRead(noti_id))
    readOneNotification(noti_id)
      .then((res) => {
        if (res.statusCode === 200) {
          // getCountNotification().then((countRes) => {
          //   if (countRes.data && countRes.statusCode === 200) {
          //     dispatch(
          //       updateNotificationCounts({
          //         totalNoti: countRes.data.totalNoti,
          //         unreadNoti: countRes.data.unreadNoti,
          //       })
          //     )
          //   }
          // })
          fetchInitialData() // Tải lại thông báo sau khi đánh dấu đã đọc
        }
      })
      .catch((error) => {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', error)
      })
  }

  const runMarkAllNotificationsAsRead = () => {
    dispatch(markAllNotificationsAsRead())
    readAllNotification()
      .then((res) => {
        if (res.statusCode === 200) {
          // getCountNotification().then((countRes) => {
          //   if (countRes.data && countRes.statusCode === 200) {
          //     dispatch(
          //       updateNotificationCounts({
          //         totalNoti: countRes.data.totalNoti,
          //         unreadNoti: countRes.data.unreadNoti,
          //       })
          //     )
          //   }
          // })
          fetchInitialData() // Tải lại thông báo sau khi đánh dấu tất cả đã đọc
        }
      })
      .catch((error) => {
        console.error('Lỗi khi đánh dấu tất cả thông báo đã đọc:', error)
      })
  }

  return (
    <header className='sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary'>
      <div className='mx-4 sm:mx-8 flex h-14 items-center'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <SheetMenu />
          <h1 className='font-bold'>{title}</h1>
        </div>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <Sheet>
            <SheetTrigger asChild>
              <button className='relative focus:outline-none'>
                <Bell className='h-5 w-5' />
                {unreadNoti > 0 && (
                  <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    {unreadNoti}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Thông báo</SheetTitle>
                <SheetDescription>
                  {unreadNoti > 0
                    ? `${unreadNoti} thông báo chưa đọc`
                    : 'Tất cả thông báo đã được đọc'}
                </SheetDescription>
              </SheetHeader>
              <div
                ref={notificationContainerRef}
                className='grid gap-4 py-4 overflow-y-auto'
                style={{
                  maxHeight: 'calc(100vh - 9rem)', // Giảm chiều cao cố định để đảm bảo cuộn
                }}
              >
                {notifications.length > 0 ? (
                  notifications.map((notification: INotification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        'p-1 rounded-md cursor-pointer',
                        notification.noti_is_read ? 'bg-background' : 'bg-accent'
                      )}
                      onClick={() => runMarkNotificationAsRead(notification._id)}
                    >
                      <p className='text-sm font-medium'>{notification.noti_title}</p>
                      <p className='text-sm'>{notification.noti_content}</p>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                      <hr className='my-2' />
                    </div>
                  ))
                ) : (
                  <div className='p-3 text-center text-sm text-muted-foreground'>
                    Không có thông báo nào
                  </div>
                )}
                {isLoading && (
                  <div className='p-3 text-center text-sm text-muted-foreground'>
                    Đang tải...
                  </div>
                )}
              </div>
              <div className='border-t pt-4'>
                <SheetClose asChild>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={runMarkAllNotificationsAsRead}
                  >
                    Đánh dấu tất cả đã đọc
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}