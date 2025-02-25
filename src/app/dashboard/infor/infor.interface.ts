export interface IResApiAddress {
  id: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  latitude: string
  longitude: string
}

export interface IAmentities {
  _id: string
  amenity_name: string
}

export interface IRestaurantTypes {
  _id: string
  restaurant_type_name: string
}
