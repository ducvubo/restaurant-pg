import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IRestaurant } from './auth.interface'

export const initialState: IRestaurant = {
  _id: '',
  restaurant_email: '',
  restaurant_phone: '',
  restaurant_category: '',
  restaurant_name: '',
  restaurant_banner: {
    image_cloud: '',
    image_custom: ''
  },
  // restaurant_image: {
  //   image_cloud: '',
  //   image_custom: ''
  // }[],
  restaurant_address: {
    address_province: {
      value: '',
      name: ''
    },
    address_district: {
      value: '',
      name: ''
    },
    address_ward: {
      value: '',
      name: ''
    },
    address_specific: ''
  },
  restaurant_type: [],
  restaurant_price: {
    restaurant_price_option: '',
    restaurant_price_amount: 0
  },
  restaurant_hours: [],
  restaurant_propose: '',
  restaurant_overview: '',
  restaurant_regulation: '',
  restaurant_parking_area: '',
  restaurant_amenity: [],
  restaurant_image: [],
  restaurant_description: '',
  restaurant_verify: false,
  restaurant_state: false,
  restaurant_slug: ''
}

const inforRestaurantSlice = createSlice({
  name: 'inforRestaurant',
  initialState,
  reducers: {
    startAppRestaurant: (state, action: PayloadAction<IRestaurant>) => {
      ;(state._id = action.payload._id),
        (state.restaurant_email = action.payload.restaurant_email),
        (state.restaurant_phone = action.payload.restaurant_phone),
        (state.restaurant_category = action.payload.restaurant_category),
        (state.restaurant_name = action.payload.restaurant_name),
        (state.restaurant_banner.image_cloud = action.payload.restaurant_banner.image_cloud),
        (state.restaurant_banner.image_custom = action.payload.restaurant_banner.image_custom),
        (state.restaurant_address.address_province.value = action.payload.restaurant_address.address_province.value),
        (state.restaurant_address.address_province.name = action.payload.restaurant_address.address_province.name),
        (state.restaurant_address.address_district.value = action.payload.restaurant_address.address_district.value),
        (state.restaurant_address.address_district.name = action.payload.restaurant_address.address_district.name),
        (state.restaurant_address.address_ward.value = action.payload.restaurant_address.address_ward.value),
        (state.restaurant_address.address_ward.name = action.payload.restaurant_address.address_ward.name),
        (state.restaurant_address.address_specific = action.payload.restaurant_address.address_specific),
        (state.restaurant_type = action.payload.restaurant_type),
        (state.restaurant_price.restaurant_price_option = action.payload.restaurant_price.restaurant_price_option),
        (state.restaurant_price.restaurant_price_amount = action.payload.restaurant_price.restaurant_price_amount),
        (state.restaurant_hours = action.payload.restaurant_hours),
        (state.restaurant_propose = action.payload.restaurant_propose),
        (state.restaurant_overview = action.payload.restaurant_overview),
        (state.restaurant_regulation = action.payload.restaurant_regulation),
        (state.restaurant_parking_area = action.payload.restaurant_parking_area),
        (state.restaurant_amenity = action.payload.restaurant_amenity),
        (state.restaurant_image = action.payload.restaurant_image),
        (state.restaurant_description = action.payload.restaurant_description),
        (state.restaurant_verify = action.payload.restaurant_verify),
        (state.restaurant_state = action.payload.restaurant_state),
        (state.restaurant_slug = action.payload.restaurant_slug)
    },
    endAppRestaurant: (state, action) => {
      return initialState
    }
  }
})

const inforRestaurantReducer = inforRestaurantSlice.reducer
export const { startAppRestaurant, endAppRestaurant } = inforRestaurantSlice.actions
export default inforRestaurantReducer