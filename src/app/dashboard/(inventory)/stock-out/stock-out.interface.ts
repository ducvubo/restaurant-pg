import { ISupplier } from '../suppliers/supplier.interface'

export interface IStockOut {
  stko_id?: string
  stko_res_id?: string
  spli_id?: string
  stko_code?: string
  stko_image?: string
  stko_seller?: string
  stko_seller_type?: 'employee' | 'restaurant'
  stko_type?: 'retail' | 'internal'
  stko_date: Date
  stko_note?: string
  stko_payment_method?: 'cash' | 'transfer' | 'credit_card'
  items: IStockOutItem[]
  supplier?: ISupplier
}

export interface IStockOutItem {
  igd_id: string
  igd_name: string
  unt_name: string
  stko_item_quantity: number
  stko_item_price: number
}
