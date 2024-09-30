import Nav from '../_component/Nav'
import RefreshTokenPage from '../_component/RefreshToken'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <Nav />
      <RefreshTokenPage />
      {children}
    </div>
  )
}
