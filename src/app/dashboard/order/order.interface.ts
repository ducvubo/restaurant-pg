export interface IStatusCount {
  status: string
  count: number
}

export interface IModelPaginateWithStatusCount<T> extends IModelPaginate<T> {
  meta: {
    statusCount: IStatusCount[] // Thêm thuộc tính statusCount
  } & IModelPaginate<T>['meta'] // Kế thừa các thuộc tính từ meta của IModelPaginate
}

export interface OrderRestaurant {
  createdBy: CreatedBy
  updatedBy: CreatedBy
  _id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  od_dish_restaurant_id: string
  od_dish_guest_id: OdDishGuestId
  od_dish_table_id: OdDishTableId
  od_dish_duplicate_id: OdDishDuplicateId
  od_dish_quantity: number
  od_dish_status: string
}

export interface OdDishGuestId {
  _id: string
  isDeleted: boolean
  guest_restaurant_id: string
  guest_table_id: string
  guest_name: string
  guest_refresh_token: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface OdDishTableId {
  _id: string
  createdBy: CreatedBy
  isDeleted: boolean
  tbl_restaurant_id: string
  tbl_name: string
  tbl_description: string
  tbl_capacity: number
  tbl_status: string
  tbl_token: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreatedBy {
  _id: string
  email: string
}

export interface OdDishDuplicateId {
  _id: string
  isDeleted: boolean
  dish_duplicate_dish_id: string
  dish_duplicate_restaurant_id: string
  dish_duplicate_name: string
  dish_duplicate_image: DishDuplicateImage
  dish_duplicate_price: number
  dish_duplicate_short_description: string
  dish_duplicate_sale: DishDuplicateSale
  dish_duplicate_priority: number
  dish_duplicate_description: string
  dish_duplicate_note: string
  dish_duplicate_status: string
  __v: number
  createdAt: string
  updatedAt: string
}

export interface DishDuplicateImage {
  image_cloud: string
  image_custom: string
}

export interface DishDuplicateSale {
  sale_type: string
  sale_value: number
}

export interface IUpdateStatusOrderDish {
  _id: string // ID của món ăn, phải là một ObjectId hợp lệ
  od_dish_status: 'processing' | 'pending' | 'paid' | 'delivered' | 'refuse' // Trạng thái của món ăn
}
