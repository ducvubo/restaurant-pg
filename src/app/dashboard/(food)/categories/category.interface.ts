export interface ICategories {
  cat_res_id: string
  _id: string
  cat_res_name: string
  cat_res_slug: string
  cat_res_icon: {
    image_cloud: string
    image_custom: string
  }
  cat_res_short_description: string
  cat_res_status: 'enable' | 'disable' 
}
