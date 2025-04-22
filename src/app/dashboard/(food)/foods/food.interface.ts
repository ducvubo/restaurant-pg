
export interface IFood {
  food_id: string
  food_res_id: string
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
  food_options?: IFoodOptions[]
}

export interface IFoodOptions {
  fopt_name: string
  fopt_price: number
  fopt_attribute: string
  fopt_image: string
  fopt_status: 'enable' | 'disable'
  fopt_state: 'soldOut' | 'inStock' | 'almostOut'
  fopt_note: string
}
