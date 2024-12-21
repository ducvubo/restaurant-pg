import { ICategories } from '../categories/category.interface'

export interface IFood {
  food_id: string
  food_res_id: string
  food_cat_id: ICategories | string
  food_name: string
  food_slug: string
  food_open_time: string
  food_close_time: string
  food_description: string
  food_price: number
  food_image: string
  food_status: 'enable' | 'disable'
  food_state: 'soldOut' | 'inStock' | 'almostOut'
  food_note: string
  food_sort: number
}
