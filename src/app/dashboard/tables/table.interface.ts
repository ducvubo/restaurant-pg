export interface ITable {
  tbl_restaurant_id: string
  _id: string
  tbl_name: string
  tbl_description: string
  tbl_capacity: number
  tbl_status: 'enable' | 'disable' | 'serving' | 'reserve'
  tbl_token: string
}
