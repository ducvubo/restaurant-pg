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
