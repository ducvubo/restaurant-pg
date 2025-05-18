export interface IEmployee {
  _id: string
  restaurant_id: string
  epl_avatar?: {
    image_cloud: string
    image_custom: string
  }
  epl_restaurant_id: string
  epl_name: string
  epl_email: string
  epl_phone: string
  epl_gender: 'Khác' | 'Nam' | 'Nữ'
  epl_address: string
  epl_status: string
  epl_face_id: boolean
}
