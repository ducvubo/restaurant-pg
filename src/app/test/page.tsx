'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

export default function page() {
  const name = useSelector((state: RootState) => state.inforRestaurant)
  console.log(name)
  return <div>page</div>
}
