import Link from 'next/link'
import { PanelsTopLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/use-store'
import { Button } from '@/components/ui/button'
import { Menu } from '@/components/admin-panel/menu'
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle'
import { SidebarToggle } from '@/components/admin-panel/sidebar-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { IRestaurant } from '@/app/auth/auth.interface'
import { IEmployee } from '@/app/dashboard/(employee)/employees/employees.interface'

interface Props {
  inforRestaurant: IRestaurant
  inforEmployee: IEmployee
}

export function Sidebar({ inforEmployee, inforRestaurant }: Props) {
  const sidebar = useStore(useSidebarToggle, (state) => state)
  if (!sidebar) return null

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className='relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800'>
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant='link'
          asChild
        >
          <Link href='/dashboard' className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage
                src={
                  inforRestaurant.restaurant_email
                    ? inforRestaurant.restaurant_banner.image_cloud
                    : inforEmployee.epl_avatar?.image_cloud
                }
                alt='@shadcn'
              />
              <AvatarFallback>ABC</AvatarFallback>
            </Avatar>
            <h1
              className={cn(
                'font-semibold text-base whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                sidebar?.isOpen === false ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'
              )}
            >
              {inforRestaurant.restaurant_email ? inforRestaurant.restaurant_name : inforEmployee.epl_name}
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  )
}
