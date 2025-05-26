export interface ITicketGuestRestaurant {
  tkgr_id?: string
  tkgr_res_id?: string
  id_user_guest?: string
  tkgr_user_id?: number
  tkgr_user_email?: string
  tkgr_title?: string
  tkgr_description: string
  tkgr_status?: 'open' | 'in_progress' | 'close' | 'resolved'
  tkgr_priority?: 'low' | 'medium' | 'high' | 'urgent'
  tkgr_type?: 'book_table' | 'order_dish' | 'Q&A' | 'complain' | 'other'
  tkgr_attachment?: string
  tkgr_star?: number
  tkgr_feedback?: string
  createdAt?: string
  updatedAt?: string
}

export interface ITicketGuestRestaurantReplice {
  tkgr_rp_id?: string
  tkgr_id?: string
  tkgr_rp_content: string
  tkgr_rp_attachment?: string
  tkgr_rp_type?: 'guest' | 'restaurant'
  tkgr_rp_time?: Date
}
