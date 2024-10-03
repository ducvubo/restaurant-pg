export interface IGuest {
  _id: string
  guest_restaurant_id: string
  guest_table_id: {
    _id: string
    tbl_name: string
  }
  guest_name: string
  guest_type: 'owner' | 'member'
}
