export interface IFoodComboRes {
  fcb_id: string
  fcb_res_id: string
  fcb_name: string
  fcb_slug: string
  fcb_description: string
  fcb_price: number
  fcb_image: string
  fcb_status: 'enable' | 'disable' // 'enable' or 'disable' (other statuses if needed)
  fcb_state: 'soldOut' | 'inStock' | 'almostOut' // 'soldOut', 'inStock', 'almostOut'
  fcb_open_time: string // e.g., "09:00"
  fcb_close_time: string // e.g., "21:00"
  fcb_note: string
  fcb_sort: number
  fcbi_combo: IFoodComboItem[]
  food_items: { food_id: string; food_quantity: number }[]
}

export interface IFoodComboItem {
  fcbi_id: string
  fcbi_res_id: string
  fcbi_food_id: string
  fcbi_combo_id: string
  fcbi_quantity: number
}
