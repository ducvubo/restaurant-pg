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
      <Card className='m-4'>
        <ScrollArea className='h-[600px]'>
          <div className='container pt-8 pb-8 px-4 sm:px-8'>{children}</div>
        </ScrollArea>
      </Card>
    </div>
  )
}
