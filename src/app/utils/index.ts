import { IOrderDish } from '../guest/guest.interface'

export const isNumericString = (str: string) => {
  return /^[0-9]{10,}$/.test(str)
}

export const calculateFinalPrice = (price: number, sale: { sale_type: string; sale_value: number } | undefined) => {
  if (!sale) return price // Nếu không có khuyến mãi, trả về giá gốc
  if (sale.sale_type === 'fixed') {
    return Math.max(0, price - sale.sale_value) // Khuyến mãi cố định
  }
  if (sale.sale_type === 'percentage') {
    return Math.max(0, price - (price * sale.sale_value) / 100) // Khuyến mãi phần trăm
  }
  return price
}

export const switchStatusOrderVi = (status: string) => {
  switch (status) {
    case 'processing':
      return 'Đang nấu'
    case 'pending':
      return 'Chờ xử lý'
    case 'paid':
      return 'Đã thanh toán'
    case 'delivered':
      return 'Đã phục vụ'
    case 'refuse':
      return 'Từ chối'
    default:
      return 'Trạng thái không hợp lệ'
  }
}

export const formatDateMongo = (dateStr: string) => {
  const date = new Date(dateStr)

  // Lấy giờ, phút, giây
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  // Lấy ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Tháng bắt đầu từ 0, nên cần +1
  const year = date.getFullYear()

  // Format lại chuỗi theo giờ:phút:giây ngày/tháng/năm
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
}

// export const countOrderStatus = (
//   orders: IOrderDish[],
//   statuses: 'processing' | 'pending' | 'paid' | 'delivered' | 'refuse'
// ) => {
//   const statusCount = statuses.reduce((acc, status) => {
//     acc[status] = 0
//     return acc
//   }, {})

//   // Duyệt qua danh sách các order và đếm số lượng theo trạng thái
//   orders.forEach((order) => {
//     if (statusCount.hasOwnProperty(order.od_dish_status)) {
//       statusCount[order.od_dish_status]++
//     }
//   })

//   return statusCount
// }
