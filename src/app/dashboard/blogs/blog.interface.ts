export interface IBlog {
  _id: string
  blg_restaurant_id: string
  blg_title: string
  blg_thumbnail: {
    image_cloud: string
    image_custom: string
  }
  blg_content: string
  blg_tag: Array<string | { tag_name: string; _id: string }>
  blg_status: 'draft' | 'publish'
  blg_verify: 'inactive' | 'active'
  isDeleted: boolean
}
