import { OdDishSmrGuestId } from '../dashboard/(order)/order/order.interface'

export interface IGuest {
  guest_restaurant_id: string
  guest_table_id: string
  guest_name: string
  guest_type: string
  order_id: string
}

export interface IOrderDishGuest {
  _id: string
  od_dish_smr_restaurant_id: string
  od_dish_smr_guest_id: OdDishSmrGuestId
  od_dish_smr_table_id: string
  od_dish_smr_status: 'paid' | 'refuse' | 'ordering'
  or_dish: OrDish[]
}

export interface OrDish {
  _id: string
  isDeleted: boolean
  od_dish_summary_id: string
  od_dish_guest_id: string
  od_dish_duplicate_id: OdDishDuplicateId
  od_dish_quantity: number
  od_dish_status: string
  __v: number
  createdAt: string
  updatedAt: string
}

export interface OdDishDuplicateId {
  _id: string
  isDeleted: boolean
  dish_duplicate_dish_id: string
  dish_duplicate_restaurant_id: string
  dish_duplicate_name: string
  dish_duplicate_image: DishDuplicateImage
  dish_duplicate_price: number
  dish_duplicate_short_description: string
  dish_duplicate_sale: DishDuplicateSale
  dish_duplicate_priority: number
  dish_duplicate_description: string
  dish_duplicate_note: string
  dish_duplicate_status: string
  __v: number
  createdAt: string
  updatedAt: string
}

export interface DishDuplicateImage {
  image_cloud: string
  image_custom: string
}

export interface DishDuplicateSale {
  sale_type: string
  sale_value: number
}
