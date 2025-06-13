'use client'
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

export const hasPermissionKey = (key: string): boolean => {
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  console.log('inforEmployee', inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);
  console.log('inforRestaurant', inforRestaurant);

  if (inforRestaurant?._id) {
    console.log(`Restaurant detected - Granting permission for key "${key}"`);
    return true;
  }

  if (inforEmployee?.policy?.poly_key_normal) {
    const hasKey = inforEmployee.policy.poly_key_normal.includes(key);
    console.log(`Checking key "${key}": ${hasKey} (poly_key_normal: ${inforEmployee.policy.poly_key_normal})`);
    return hasKey;
  }

  console.log(`No permission found for key "${key}"`);
  return false;
};