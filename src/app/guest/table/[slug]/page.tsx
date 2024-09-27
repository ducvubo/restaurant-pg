import React from 'react'
import { LoginTableForm } from '../../_component/LoginTable'
import { MemberLogin } from '../../_component/MemberLogin'
interface PageProps {
  searchParams: { [key: string]: string }
  params: { slug: string }
}
export default function Table({ searchParams, params }: PageProps) {
  const id = params.slug
  if (id === 'add-member') {
    return <MemberLogin />
  } else {
    return (
      <div>
        <LoginTableForm />
      </div>
    )
  }
}
