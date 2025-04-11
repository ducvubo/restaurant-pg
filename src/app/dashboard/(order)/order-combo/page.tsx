import React from 'react'
import OrderFoodComboPage from './_component/OrderFoodComboPage'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function PageBookTable() {
  return (
    <div>
      <ContentLayout title='Danh sách đặt bàn'>
        <OrderFoodComboPage />
      </ContentLayout>
    </div>
  )
}
