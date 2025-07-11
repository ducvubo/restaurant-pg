'use client'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuItem
} from '@/components/ui/navigation-menu'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { RootState } from '@/app/redux/store'
import { useSelector } from 'react-redux'
export default function Nav() {
  const { setTheme } = useTheme()
  const inforGuest = useSelector((state: RootState) => state.inforGuest)


  return (
    <header className='flex h-20 w-full shrink-0 items-center px-4 md:px-6 sticky top-0  z-10 dark:bg-[#121212] bg-white'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='lg:hidden'>
            <MenuIcon className='h-6 w-6' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <Link href='#' prefetch={false}>
            <MountainIcon className='h-6 w-6' />
            <span className='sr-only'>Acme Inc</span>
          </Link>
          <div className='grid gap-2 py-6'>
            {inforGuest?.guest_type === 'owner' && (
              <Link
                href='/guest/add-member'
                className='flex w-full items-center py-2 text-lg font-semibold'
                prefetch={false}
              >
                Thêm thành viên
              </Link>
            )}

            <Link href='/guest/order' className='flex w-full items-center py-2 text-lg font-semibold' prefetch={false}>
              Gọi món
            </Link>
            <Link
              href='/guest/list-order'
              className='flex w-full items-center py-2 text-lg font-semibold'
              prefetch={false}
            >
              Đơn hàng
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link href='#' className='mr-6 hidden lg:flex' prefetch={false}>
        <MountainIcon className='h-6 w-6' />
        <span className='sr-only'>Acme Inc</span>
      </Link>
      <NavigationMenu className='hidden lg:flex'>
        <NavigationMenuList>
          {inforGuest?.guest_type === 'owner' && (
            <NavigationMenuLink asChild>
              <Link
                href='/guest/add-member'
                className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-[#121212] dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
                prefetch={false}
              >
                Thêm thành viên
              </Link>
            </NavigationMenuLink>
          )}

          <NavigationMenuLink asChild>
            <Link
              href='/guest/order'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-[#121212] dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
              prefetch={false}
            >
              Gọi món
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              href='/guest/list-order'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-[#121212] dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
              prefetch={false}
            >
              Đơn hàng
            </Link>
          </NavigationMenuLink>
          {/* <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                  <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                  <span className='sr-only'>Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  )
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m8 3 4 8 5-5 5 15H2L8 3z' />
    </svg>
  )
}
