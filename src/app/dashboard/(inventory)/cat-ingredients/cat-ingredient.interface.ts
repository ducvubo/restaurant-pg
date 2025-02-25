export interface ICatIngredient {
  cat_igd_id: string
  cat_igd_res_id?: string
  cat_igd_name: string
  cat_igd_description?: string
  cat_igd_status?: 'enable' | 'disable'
}
