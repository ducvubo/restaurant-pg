export interface ILabel {
  lb_id: string
  lb_res_id?: string
  lb_name: string
  lb_color: string
  lb_description?: string
  lb_status?: 'ENABLED' | 'DISABLED'
}
