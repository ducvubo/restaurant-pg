import { useEffect, useState } from 'react'
import { findOneEmployee } from '../../employees/employees.api'
import { deleteCookiesAndRedirect } from '@/app/actions/action'

function EmployeeNameCell({ employeeId }: { employeeId: string }) {
  const [name, setName] = useState<string>('Đang tải...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchEmployee = async () => {
      try {
        const res = await findOneEmployee({ _id: employeeId })
        if (!isMounted) return

        if (res.statusCode === 200 && res.data) {
          setName(res.data.epl_name)
        } else if (res.statusCode === 404) {
          setName('Không tìm thấy nhân viên')
        } else if (res.code === -10) {
          await deleteCookiesAndRedirect()
          setName('Phiên đăng nhập đã hết hạn')
        } else {
          setName('Đã có lỗi xảy ra')
        }
      } catch (err) {
        if (isMounted) setError('Lỗi khi gọi API')
      }
    }

    fetchEmployee()

    return () => {
      isMounted = false
    }
  }, [employeeId])

  return <div>{error ?? name}</div>
}

export default EmployeeNameCell