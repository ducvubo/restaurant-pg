export interface IFoodComboSnap {
  fcb_snp_id: string;
  fcb_id: string;
  fcb_snp_res_id: string;
  fcb_snp_name: string;
  fcb_snp_slug: string;
  fcb_snp_description: string;
  fcb_snp_price: number;
  fcb_snp_image: string;
  fcb_snp_note: string;
  fcb_snp_sort: number;
  fcb_snp_item: string;
  orderItems: IOrderFoodComboItem[];
}

export interface IOrderFoodComboItem {
  od_cb_it_id: string;
  od_cb_res_id: string;
  od_cb_id: string;
  fcb_snp_id: string;
  od_cb_it_quantity: number;
  foodComboSnap: IFoodComboSnap;
  orderCombo: IOrderFoodCombo;
}

export interface IOrderFoodCombo {
  od_cb_id: string;
  od_cb_res_id: string;
  od_cb_user_id: number;
  id_user_guest: string;
  od_cb_user_name: string;
  od_cb_user_phone: string;
  od_cb_user_email: string;
  od_cb_user_address: string;
  od_cb_user_province: string;
  od_cb_user_district: string;
  od_cb_user_ward: string;
  od_cb_user_note: string;
  od_cb_status:
  | "waiting_confirm_customer"
  | "over_time_customer"
  | "waiting_confirm_restaurant"
  | "waiting_shipping"
  | "shipping"
  | "delivered_customer"
  | "received_customer"
  | "cancel_customer"
  | "cancel_restaurant"
  | "complaint"
  | "complaint_done";
  od_cb_type_shipping: 'GHN' | 'GHTK';
  od_cb_price_shipping: number;
  od_cb_atribute: string;
  od_cb_feed_star: 0 | 1 | 2 | 3 | 4 | 5;
  od_cb_feed_content: string;
  od_cb_feed_reply: string;
  od_cb_feed_view: 'active' | 'disable';
  od_cb_created_at: Date;
  orderItems: IOrderFoodComboItem[];
}
