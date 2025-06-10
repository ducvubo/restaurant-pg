
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
          if (countRes.data.totalNoti <= offset + res.data.data.length) {
            setHasMore(false)
          }
        }
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Lỗi khi tải thêm thông báo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runMarkNotificationAsRead = (noti_id: string) => {
    dispatch(markNotificationAsRead(noti_id))
    readOneNotification(noti_id)
      .then((res) => {
        if (res.statusCode === 200) {
          fetchInitialData() // Reload notifications after marking as read
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
          fetchInitialData() // Reload notifications after marking all as read
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
                  maxHeight: 'calc(100vh - 11rem)', // Adjusted height to accommodate new button
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
              </div>
              <div className='border-t space-y-4 flex gap-2'>
                {hasMore && (
                  <Button
                    variant='outline'
                    className='w-full mt-4'
                    onClick={loadMoreNotifications}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className='flex items-center'>
                        <svg
                          className='animate-spin h-5 w-5 mr-2'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Đang tải...
                      </span>
                    ) : (
                      'Xem thêm'
                    )}
                  </Button>
                )}
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