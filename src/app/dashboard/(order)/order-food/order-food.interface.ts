export interface IOrderFood {
  od_id: string;
  od_res_id: string;
  od_user_id: string;
  id_user_guest: string;
  od_user_name: string;
  od_user_phone: string;
  od_user_email: string;
  od_user_address: string;
  od_user_province: string;
  od_user_district: string;
  od_user_ward: string;
  od_user_note: string;

  od_status:
  | 'waiting_confirm_customer'
  | 'over_time_customer'
  | 'waiting_confirm_restaurant'
  | 'waiting_shipping'
  | 'shipping'
  | 'delivered_customer'
  | 'received_customer'
  | 'cancel_customer'
  | 'cancel_restaurant'
  | 'complaint'
  | 'complaint_done';

  od_type_shipping: 'GHN' | 'GHTK';
  od_price_shipping: number;
  od_atribute: string;
  od_feed_star: 0 | 1 | 2 | 3 | 4 | 5;
  od_feed_content: string;
  od_feed_reply: string;
  od_feed_view: 'active' | 'disable';
  od_created_at: Date;
  orderItems: IOrderFoodItem[];
}

export interface IOrderFoodItem {
  od_it_id: string;
  od_res_id: string;
  od_id: string;
  fsnp_id: string;
  od_it_quantity: number;
  foodSnap: IFoodSnap;
}
export interface IFoodSnap {
  fsnp_id: string;
  food_id: string;
  food_cat_id: string;
  fsnp_res_id: string;

  fsnp_name: string;
  fsnp_slug: string;
  fsnp_description: string;
  fsnp_price: number;
  fsnp_image: string;
  fsnp_note: string;
  fsnp_options: string;
}