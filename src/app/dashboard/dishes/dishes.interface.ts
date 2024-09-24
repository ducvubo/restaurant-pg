export interface IDish {
  _id: string
  dish_name: string
  dish_image: {
    image_cloud: string
    image_custom: string
  }
  dish_price: number
  dish_short_description: string
  dish_sale?: {
    sale_type: 'percentage' | 'fixed'
    sale_value: number
  }
  dish_priority: number
  dish_description: string
  dish_note: string
  dish_detail: string
  isDeleted: boolean
  dish_status: 'enable' | 'disable'
}
