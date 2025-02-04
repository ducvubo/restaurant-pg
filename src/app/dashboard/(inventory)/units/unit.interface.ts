export interface IUnit {
  unt_id: string
  unt_res_id?: string
  unt_symbol?: string
  unt_name?: string
  unt_description?: string
  unt_status?: 'enable' | 'disable'
}
