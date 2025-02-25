import { Navbar } from '@/components/admin-panel/navbar'
import { Card } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className='pt-4 pb-4 px-4 sm:px-8 w-full'>{children}</div>
    </div>
  )
}
