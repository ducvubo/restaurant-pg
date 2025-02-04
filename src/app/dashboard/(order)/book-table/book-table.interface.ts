export interface IBookTable {
  _id: string
  isDeleted: boolean
  book_tb_guest_id: string
  book_tb_restaurant_id: string
  book_tb_email: string
  book_tb_phone: string
  book_tb_name: string
  book_tb_date: string
  book_tb_hour: BookTbHour
  book_tb_number_adults: number
  book_tb_number_children: number
  book_tb_note: string
  book_tb_status: string
  book_tb_details: BookTbDetail[]
  book_tb_feedback: string
  createdAt: string
  updatedAt: string
  book_tb_token_verify: string
}

export interface BookTbHour {
  value: number
  label: string
}

export interface BookTbDetail {
  book_tb_status: string
  book_tb_details: string
  date_of_now: string
}
