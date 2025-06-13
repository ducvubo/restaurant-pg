import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import RefreshToken from '../auth/_component/RefreshToken'
import { PermissionProvider } from '../auth/PermissionContext'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionProvider>
      <AdminPanelLayout>
        <RefreshToken />
        {children}
      </AdminPanelLayout>
    </PermissionProvider>
  )
}
