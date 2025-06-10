import React from 'react'
import { IEmployee } from '../../(employee)/employees/employees.interface'

interface InforEmployeeProps {
  inforEmployee: IEmployee
}

export default function InforEmployee({ inforEmployee }: InforEmployeeProps) {

  return (
    <div>InforEmployee</div>
  )
}
