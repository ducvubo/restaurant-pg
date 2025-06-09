export interface IBookTable {
  _id: string
  isDeleted: boolean
  book_tb_guest_id: string
  book_tb_restaurant_id: string
  book_tb_email: string
  book_tb_phone: string
  book_tb_name: string
  book_tb_date: string
  book_tb_hour: string
  book_tb_number_adults: number
  book_tb_number_children: number
  book_tb_note: string
  book_tb_status:
  | 'WAITING_GUESR' //Chờ khách hàng xác nhận,
  | 'GUEST_CANCEL' //Khách hàng hủy
  | 'EXPRIED_CONFIRM_GUEST' // Hết hạn xác nhận của khách hàng
  | 'WAITING_RESTAURANT' // Chờ nhà hàng xác nhận
  | 'RESTAURANT_CANCEL' // Nhà hàng hủy
  | 'RESTAURANT_CONFIRM' // Nhà hàng xác nhận
  | 'DONE' // Hoàn thành
  | 'EXEPTION' // ngoại lệ

  book_tb_details: BookTbDetail[]
  book_tb_feedback: string
  book_tb_feedback_restaurant: string
  book_tb_star: number
  book_tb_hide_feedback: boolean
  createdAt: string
  updatedAt: string
  book_tb_token_verify: string
}

export interface BookTbDetail {
  book_tb_status: string
  book_tb_details: string
  date_of_now: string
}
