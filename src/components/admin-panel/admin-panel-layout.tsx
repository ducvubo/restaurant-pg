'use client'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/use-store'
import { Footer } from '@/components/admin-panel/footer'
import { Sidebar } from '@/components/admin-panel/sidebar'
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const sidebar = useStore(useSidebarToggle, (state) => state)
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  if (!sidebar) return null

  return (
    <>
      <Sidebar inforRestaurant={inforRestaurant} inforEmployee={inforEmployee} />
      <main
        className={cn(
          'min-h-[calc(100vh)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        {children}
      </main>
      {/* <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Footer />
      </footer> */}
    </>
  )
}
