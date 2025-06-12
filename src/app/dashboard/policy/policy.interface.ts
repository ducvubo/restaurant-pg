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
  poly_description: string
  poly_path: string[]
  poly_key: string[]
  isDeleted: boolean
  poly_status: 'enable' | 'disable',
  poly_key_normal: string[]
}
