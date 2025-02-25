import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import RefreshToken from '../auth/_component/RefreshToken'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPanelLayout>
      <RefreshToken />
      {children}
    </AdminPanelLayout>
  )
}
