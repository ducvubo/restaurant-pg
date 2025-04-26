export enum BookRoomStatus {
  NEW_CREATED = 'NEW_CREATED',
  OVERTIME_GUEST = 'OVERTIME_GUEST',
  CANCEL_GUEST = 'CANCEL_GUEST',
  WAITING_RESTAURANT = 'WAITING_RESTAURANT',
  RESTAURANT_CONFIRM_DEPOSIT = 'RESTAURANT_CONFIRM_DEPOSIT',
  CANCEL_RESTAURANT = 'CANCEL_RESTAURANT',
  RESTAURANT_CONFIRM = 'RESTAURANT_CONFIRM',
  GUEST_CHECK_IN = 'GUEST_CHECK_IN',
  GUEST_CHECK_OUT = 'GUEST_CHECK_OUT',
  GUEST_CHECK_OUT_OVERTIME = 'GUEST_CHECK_OUT_OVERTIME',
  NO_SHOW = 'NO_SHOW',
  RESTAURANT_REFUND_DEPOSIT = 'RESTAURANT_REFUND_DEPOSIT',
  RESTAURANT_REFUND_ONE_THIRD_DEPOSIT = 'RESTAURANT_REFUND_ONE_THIRD',
  RESTAURANT_REFUND_ONE_TWO_DEPOSITE = 'RESTAURANT_REFUND_ONE_TWO_DEPOSITE',
  RESTAURANT_NO_DEPOSIT = 'RESTAURANT_NO_DEPOSIT',
  IN_USE = "IN_USE",
  RESTAURANT_CONFIRM_PAYMENT = 'RESTAURANT_CONFIRM_PAYMENT',
  GUEST_COMPLAINT = 'GUEST_COMPLAINT',
  DONE_COMPLAINT = 'DONE_COMPLAINT',
  RESTAURANT_EXCEPTION = 'RESTAURANT_EXCEPTION',
  GUEST_EXCEPTION = 'GUEST_EXCEPTION'
}
export interface IBookRoom {
  bkr_id: string
  bkr_res_id: string
  bkr_guest_id: string
  bkr_ame: string
  bkr_email: string
  bkr_phone: string
  bkr_time_start: Date
  bkr_time_end: Date
  bkr_check_in: Date
  bkr_check_out: Date
  bkr_created_at: Date
  bkr_note: string
  bkr_note_res: string
  bkr_feedback: string
  bkr_reply: string
  bkr_star: 1 | 2 | 3 | 4 | 5
  bkr_reason_cancel: string
  bkr_detail_history: string
  bkr_status: BookRoomStatus
  bkr_plus_price: number
  amenities: IAmenitiesSnap[]
  menuItems: IMenuItemsSnap[]
}

export interface IAmenitiesSnap {
  ame_snap_id: string
  ame_snap_bkr_id: string
  ame_snap_res_id: string
  ame_snap_name: string
  ame_snap_price: number
  ame_snap_note: string
  ame_snap_description: string
  ame_snap_quantity: number
  bookRoom: IBookRoom
}

export interface IMenuItemsSnap {
  mitems_snap_id: string
  mitems_snap_res_id: string
  mitems_snap_bkr_id: string
  mitems_snap_name: string
  mitems_snap_price: number
  mitems_snap_image: string
  mitems_snap_note: string
  mitems_snap_description: string
  mitems_snap_quantity: number
  bookRoom: IBookRoom
}
