'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

// Định nghĩa kiểu cho context
interface PermissionContextType {
  hasPermission: (key: string) => boolean;
  permissions: string[] | null; // Danh sách tất cả quyền hiện có
  isLoading: boolean;
}

// Tạo Context với giá trị mặc định
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);
  const [permissions, setPermissions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasPermission = (key: string): boolean => {
    if (inforRestaurant?._id) {
      return true;
    }
    return permissions?.includes(key) || false;
  };

  useEffect(() => {
    if (inforEmployee?.policy?.poly_key_normal) {
      setPermissions(inforEmployee.policy.poly_key_normal);
    } else if (inforRestaurant?._id) {
      setPermissions([]);
    } else {
      setPermissions([]);
    }
    setIsLoading(false);
  }, [inforEmployee, inforRestaurant]);

  return (
    <PermissionContext.Provider value={{ hasPermission, permissions, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};