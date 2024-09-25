import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGuest } from './guest.interface'

export const initialState: IGuest = {
  guest_restaurant_id: '',
  guest_table_id: '',
  guest_name: ''
}

const inforGuestSlice = createSlice({
  name: 'inforGuest',
  initialState,
  reducers: {
    startAppGuest: (state, action: PayloadAction<IGuest>) => {
      ;(state.guest_restaurant_id = action.payload.guest_restaurant_id),
        (state.guest_table_id = action.payload.guest_table_id),
        (state.guest_name = action.payload.guest_name)
    }
  }
})

const inforGuestReducer = inforGuestSlice.reducer
export const { startAppGuest } = inforGuestSlice.actions
export default inforGuestReducer
