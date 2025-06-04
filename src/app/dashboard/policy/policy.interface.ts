export interface Module {
  name: string;
  key: string;
  functions: ModuleFunction[];
}

export interface ModuleFunction {
  name: string;
  key: string;
  description: string;
  actions: ModuleAction[];
}

export interface ModuleAction {
  key: string;
  method: string;
  patchRequire: string[];
}

export interface IPolicy {
  _id: string
  poly_res_id: string
  poly_name: string
  dish_price: number
  poly_description: string
  poly_key: string[]
  isDeleted: boolean
  poly_status: 'enable' | 'disable'
}
