import { IMenuCategory } from '../menu-category/menu-category.interface'

export interface IMenuItems {
  mitems_id?: string
  mitems_res_id?: string
  mcat_id?: string
  mitems_name?: string
  mitems_price?: number
  mitems_image: string
  mitems_note?: string
  mitems_description?: string
  mitems_status?: 'enable' | 'disable'
  category?: IMenuCategory
}
