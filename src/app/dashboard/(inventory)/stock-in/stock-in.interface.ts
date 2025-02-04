import { ISupplier } from '../suppliers/supplier.interface'

export interface IStockIn {
  stki_id?: string
  stki_res_id?: string
  spli_id?: string
  stki_code?: string
  stki_image?: string
  stki_delivery_name?: string
  stki_delivery_phone?: string
  stki_receiver?: string
  stki_receiver_type?: 'employee' | 'restaurant'
  stki_date: Date
  stki_note?: string
  stki_payment_method?: 'cash' | 'transfer' | 'credit_card'
  items: IStockInItem[]
  supplier?: ISupplier
}

export interface IStockInItem {
  igd_id: string
  igd_name: string
  unt_name: string
  stki_item_quantity: number
  stki_item_quantity_real: number
  stki_item_price: number
}
