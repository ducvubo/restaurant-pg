export interface ISupplier {
  spli_id: string
  spli_res_id?: string
  spli_name?: string
  spli_email?: string
  spli_phone?: string
  spli_address?: string
  spli_description?: string
  spli_type?: 'supplier' | 'customer'
  spli_status?: 'enable' | 'disable'
}
