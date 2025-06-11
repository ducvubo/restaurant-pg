import { IRestaurant } from "@/app/auth/auth.interface"
import { IPolicy } from "../../policy/policy.interface"

export interface IEmployee {
  _id: string
  restaurant_id: string
  epl_avatar: {
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
  epl_policy_id: string
  policy: IPolicy
  epl_face_id: boolean
  restaurant_phone: string
  restaurant_name: string
  restaurant_address: {
    address_province: {
      id: string
      name: string
    }
    address_district: {
      id: string
      name: string
    }
    address_ward: {
      id: string
      name: string
    }
    address_specific: string
  }
  restaurant_email: string
}
