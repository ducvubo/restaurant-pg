export interface IStatusCount {
  status: string
  count: number
}

export interface IModelPaginateWithStatusCount<T> extends IModelPaginate<T> {
  meta: {
    statusCount: IStatusCount[] // Thêm thuộc tính statusCount
  } & IModelPaginate<T>['meta'] // Kế thừa các thuộc tính từ meta của IModelPaginate
}

export interface ICreateOrderDish {
  od_dish_id: string
  od_dish_quantity: number
}

export interface IRestaurantCreateOrderDish {
  od_dish_summary_id: string
  order_dish: ICreateOrderDish[]
}

export interface ITableOrderSummary {
  _id: string
  isDeleted: boolean
  tbl_restaurant_id: string
  tbl_name: string
  tbl_description: string
  tbl_capacity: number
  tbl_status: 'enable' | 'disable' | 'serving' | 'reserve'
  tbl_token: string
  od_dish_smr_count: {
    paid: number
    refuse: number
    ordering: number
    guest: number
  }
}

export interface IOrderRestaurant {
  _id: string
  isDeleted: boolean
  od_dish_smr_restaurant_id: string
  od_dish_smr_guest_id: OdDishSmrGuestId
  od_dish_smr_table_id: OdDishSmrTableId
  od_dish_smr_status: 'ordering' | 'paid' | 'refuse'
  createdAt: string
  updatedAt: string
  or_dish: OrDish[]
}

export interface OdDishSmrGuestId {
  _id: string
  isDeleted: boolean
  guest_restaurant_id: string
  guest_table_id: string
  guest_name: string
  guest_type: 'member' | 'owner'
  guest_refresh_token: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface OdDishSmrTableId {
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
  updatedBy: UpdatedBy
}

export interface CreatedBy {
  _id: string
  email: string
}

export interface UpdatedBy {
  _id: string
  email: string
}

export interface OrDish {
  _id: string
  isDeleted: boolean
  od_dish_summary_id: string
  od_dish_guest_id: OdDishGuestId
  od_dish_duplicate_id: OdDishDuplicateId
  od_dish_quantity: number
  od_dish_status: string
  __v: number
  createdAt: string
  updatedAt: string
}

export interface OdDishGuestId {
  _id: string
  isDeleted: boolean
  guest_restaurant_id: string
  guest_table_id: string
  guest_name: string
  guest_type: string
  guest_refresh_token: string
  createdAt: string
  updatedAt: string
  __v: number
  guest_owner?: GuestOwner
}

export interface GuestOwner {
  owner_id: string
  owner_name: string
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
  _id: string
  od_dish_summary_id: string
  od_dish_status: 'processing' | 'pending' | 'delivered' | 'refuse'
}
