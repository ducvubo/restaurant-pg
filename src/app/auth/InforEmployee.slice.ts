import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEmployee } from '../dashboard/(employee)/employees/employees.interface'

export const initialState: IEmployee = {
  _id: '',
  restaurant_id: '',
  epl_restaurant_id: '',
  epl_name: '',
  epl_email: '',
  epl_phone: '',
  epl_gender: 'Khác',
  epl_address: '',
  epl_avatar: {
    image_cloud: '',
    image_custom: ''
  },
  epl_status: '',
  epl_policy_id: '',
  policy: {
    _id: '',
    poly_name: '',
    poly_description: '',
    poly_key: [''],
    poly_path: [''],
    poly_res_id: '',
    poly_status: 'enable',
    isDeleted: false,
  },
  epl_face_id: false,
  restaurant_phone: '',
  restaurant_name: '',
  restaurant_address: {
    address_province: {
      id: '',
      name: ''
    },
    address_district: {
      id: '',
      name: ''
    },
    address_ward: {
      id: '',
      name: ''
    },
    address_specific: ''
  },
  restaurant_email: '',
  restaurant_bank: {
    account_name: '',
    account_number: '',
    bank: ''
  }
}

const inforEmployeeSlice = createSlice({
  name: 'inforEmployee',
  initialState,
  reducers: {
    startAppEmployee: (state, action: PayloadAction<IEmployee>) => {
      ; (state._id = action.payload._id),
        (state.epl_restaurant_id = action.payload.epl_restaurant_id),
        (state.epl_name = action.payload.epl_name),
        (state.epl_email = action.payload.epl_email),
        (state.epl_phone = action.payload.epl_phone),
        (state.epl_gender = action.payload.epl_gender),
        (state.epl_address = action.payload.epl_address),
        (state.epl_avatar = action.payload.epl_avatar),
        (state.policy = action.payload.policy),
        (state.restaurant_id = action.payload.epl_restaurant_id),
        (state.restaurant_phone = action.payload.restaurant_phone),
        (state.restaurant_name = action.payload.restaurant_name),
        (state.restaurant_address = action.payload.restaurant_address),
        (state.restaurant_email = action.payload.restaurant_email),
        (state.restaurant_bank = action.payload.restaurant_bank)
    },
    endAppEmployee: (state, action) => {
      return initialState
    }
  }
})

const inforEmployeeReducer = inforEmployeeSlice.reducer
export const { startAppEmployee, endAppEmployee } = inforEmployeeSlice.actions
export default inforEmployeeReducer
