export interface IToken {
  access_token_rtr: string
  refresh_token_rtr: string
  type: 'employee' | 'restaurant'
}

export interface IBank {
  id: number
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
  short_name: string
  support: number
  isTransfer: number
  swift_code?: string
}
export interface IResApiAddress {
  id: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  latitude: string
  longitude: string
}


export interface IRestaurant {
  _id: string
  restaurant_id: string
  restaurant_email: string
  restaurant_phone: string
  restaurant_category: string
  restaurant_name: string
  restaurant_banner: {
    image_cloud: string
    image_custom: string
  }
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
  restaurant_type: string[]
  restaurant_price: {
    restaurant_price_option: 'up' | 'down' | 'range'
    restaurant_price_min: number
    restaurant_price_max: number
    restaurant_price_amount: number
  }
  restaurant_hours: {
    day_of_week: string
    open: string
    close: string
  }[]
  restaurant_bank: RestaurantBank

  restaurant_propose: string
  restaurant_overview: string
  restaurant_regulation: string
  restaurant_parking_area: string
  restaurant_amenity: string[]
  restaurant_image: {
    image_cloud: string
    image_custom: string
  }[]
  restaurant_description: string
  restaurant_verify: boolean
  restaurant_state: boolean
  restaurant_slug: string
  restaurant_metadata: string
}

export interface RestaurantBank {
  bank: string
  account_number: string
  account_name: string
}