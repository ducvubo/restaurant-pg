export interface ITable {
  _id: string
  tbl_name: string
  tbl_description: string
  tbl_capacity: number
  tbl_status: 'enable' | 'disable'
  tbl_token: string
}
