export interface User {
  user_id: string;
  google_id?: string;
  email?: string;
  display_name: string;
  created_at: string;
  is_guest: boolean;
}

export interface MenuItem {
  menu_item_id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  calories: number;
  fat_g?: number;
  carbs_g?: number;
  protein_g?: number;
  sugar_g?: number;
  created_date: string;
  last_modified_date: string;
}

export interface Restaurant {
  restaurant_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  chain_name: string;
  created_date: string;
  last_modified_date: string;
  menu_items: MenuItem[];
}