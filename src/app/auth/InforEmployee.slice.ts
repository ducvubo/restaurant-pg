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
  epl_status: ''
}

const inforEmployeeSlice = createSlice({
  name: 'inforEmployee',
  initialState,
  reducers: {
    startAppEmployee: (state, action: PayloadAction<IEmployee>) => {
      ;(state._id = action.payload._id),
        (state.epl_restaurant_id = action.payload.epl_restaurant_id),
        (state.epl_name = action.payload.epl_name),
        (state.epl_email = action.payload.epl_email),
        (state.epl_phone = action.payload.epl_phone),
        (state.epl_gender = action.payload.epl_gender),
        (state.epl_address = action.payload.epl_address),
        (state.epl_avatar = action.payload.epl_avatar),
        (state.restaurant_id = action.payload.epl_restaurant_id)
    },
    endAppEmployee: (state, action) => {
      return initialState
    }
  }
})

const inforEmployeeReducer = inforEmployeeSlice.reducer
export const { startAppEmployee, endAppEmployee } = inforEmployeeSlice.actions
export default inforEmployeeReducer
