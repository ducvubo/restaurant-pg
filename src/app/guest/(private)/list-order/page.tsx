// 'use client'
// import React from 'react'
// import ListOrderPage from '../../_component/ListOrderPage'

// export default function page() {
//   return (
//     <div>
//       <ListOrderPage />
//     </div>
//   )
// }

import React, { Suspense } from 'react'
import ListOrderPage from '../../_component/ListOrderPage'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ListOrderPage />
      </Suspense>
    </div>
  )
}
