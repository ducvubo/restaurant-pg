'use client'

import Link from 'next/link'
import { LayoutGrid, LogOut, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

export function UserNav() {
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const logOut = async () => {
    await deleteCookiesAndRedirect()
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={
                    inforRestaurant.restaurant_email
                      ? inforRestaurant.restaurant_banner.image_cloud
                      : inforEmployee.epl_avatar?.image_cloud
                  } alt='Avatar' />
                  <AvatarFallback className='bg-transparent' >JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{
              inforRestaurant.restaurant_email
                ? inforRestaurant.restaurant_name
                : inforEmployee.epl_name
            }</p>
            <p className='text-xs leading-none text-muted-foreground'>{
              inforRestaurant.restaurant_email
                ? inforRestaurant.restaurant_email
                : inforEmployee.epl_email
            }</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='hover:cursor-pointer' asChild>
            <Link href='/dashboard' className='flex items-center'>
              <LayoutGrid className='w-4 h-4 mr-3 text-muted-foreground' />
              Thống kê
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:cursor-pointer' asChild>
            <Link href='/dashboard/account' className='flex items-center'>
              <User className='w-4 h-4 mr-3 text-muted-foreground' />
              Tài khoản
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='hover:cursor-pointer' onClick={logOut}>
          <LogOut className='w-4 h-4 mr-3 text-muted-foreground' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
