'use client'
import { RootState } from '@/app/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import InforEmployee from './InforEmployee';
import InforRestaurant from './InforRestaurant';

export default function PageAccount() {
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);

  console.log("🚀 ~ PageAccount ~ inforRestaurant:", inforRestaurant);

  return (
    <>
      {inforEmployee._id && <InforEmployee inforEmployee={inforEmployee} />}
      {inforRestaurant._id && <InforRestaurant inforRestaurant={inforRestaurant} />}
    </>
  );
}
