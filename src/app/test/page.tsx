'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

export default function page() {
  const name = useSelector((state: RootState) => state.inforRestaurant)
  const name1 = useSelector((state: RootState) => state.inforEmployee)

  console.log(name)
  console.log(name1)
  return <div>page</div>
}
