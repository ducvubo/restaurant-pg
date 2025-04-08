export interface IRoom {
  room_id?: string
  room_res_id?: string
  room_name?: string
  room_fix_ame?: string
  room_max_guest?: number
  room_base_price?: number
  room_area?: string
  room_note?: string
  room_images: string
  room_description?: string
  room_status?: 'enable' | 'disable'
}
