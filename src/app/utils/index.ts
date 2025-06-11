import md5 from 'md5'

import { v2 as cloudinary } from 'cloudinary'
import { ca } from 'date-fns/locale'

const getRandomNonce = (num: number) => {
  return Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1))
}

const keyToken = process.env.KEY_SECRET_API_ENDPOINT
const versionToken = 'v1'
export function genSignEndPoint() {
  const headers: any = {}
  const stime = Date.now()
  const nonce = getRandomNonce(20).toString()

  headers.stime = stime
  headers.nonce = nonce

  const sortKeys: string[] = []
  for (const key in headers) {
    if (key !== 'sign') {
      sortKeys.push(key)
    }
  }
  sortKeys.sort()
  let headersString = ''
  sortKeys.forEach((key) => {
    headersString += key + headers[key]
  })

  const sign = md5(headersString + keyToken + versionToken).toString()

  return {
    sign: sign,
    version: versionToken,
    nonce: nonce,
    stime: stime.toString()
  }
}

export const isNumericString = (str: string) => {
  return /^[0-9]{10,}$/.test(str)
}

export const calculateFinalPrice = (price: number, sale: { sale_type: string; sale_value: number } | undefined) => {
  if (!sale) return price
  if (sale.sale_type === 'fixed') {
    return Math.max(0, price - sale.sale_value)
  }
  if (sale.sale_type === 'percentage') {
    return Math.max(0, price - (price * sale.sale_value) / 100)
  }
  console.log("🚀 ~ calculateFinalPrice ~ price:", price)
  return Math.round(price)
}

export const switchStatusOrderSummaryVi = (status: string) => {
  switch (status) {
    case 'ordering':
      return ' Đang order'
    case 'paid':
      return ' Đã thanh toán'
    case 'refuse':
      return ' Từ chối order'
    default:
      return 'Trạng thái không hợp lệ'
  }
}

export const switchStatusOrderVi = (status: string) => {
  switch (status) {
    case 'processing':
      return ' Đang nấu'
    case 'pending':
      return 'Chờ xử lý'
    case 'refuse':
      return ' Từ chối'
    case 'delivered':
      return 'Đã phục vụ'
    case 'guest_cancel':
      return 'Khách hủy'
    default:
      return 'Trạng thái không hợp lệ'
  }
}

export const formatDateMongo = (dateStr: string) => {
  const date = new Date(dateStr)

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
}

// export const calculateTotalPrice = (data: any) => {
//   let totalPrice = 0
//   data.or_dish.forEach((dish: any) => {
//     if (dish.od_dish_status === 'delivered') {
//       const price = dish.od_dish_duplicate_id.dish_duplicate_price
//       const sale = dish.od_dish_duplicate_id.dish_duplicate_sale
//       const quantity = dish.od_dish_quantity
//       let finalPrice = price

//       if (sale) {
//         if (sale.sale_type === 'fixed') {
//           finalPrice = price - sale.sale_value
//         } else if (sale.sale_type === 'percent') {
//           finalPrice = price * (1 - sale.sale_value / 100)
//         }
//       }
//       totalPrice += finalPrice * quantity
//     }
//   })
//   return totalPrice
// }

export const calculateTotalPrice = (data: any) => {
  let totalPrice = 0;
  data.or_dish.forEach((dish: any) => {
    if (dish.od_dish_status === 'delivered') {
      const price = dish.od_dish_duplicate_id.dish_duplicate_price;
      const sale = dish.od_dish_duplicate_id.dish_duplicate_sale;
      const quantity = dish.od_dish_quantity;
      const finalPrice = Math.floor(calculateFinalPrice(price, sale));
      totalPrice += finalPrice * quantity;
    }
  });
  return totalPrice;
};

export const formatDate = (date: Date) => {
  //21/09/2021
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
