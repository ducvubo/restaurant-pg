interface Module {
  name: string;
  key: string;
  functions: ModuleFunction[];
}

interface ModuleFunction {
  name: string;
  key: string;
  description: string;
  actions: ModuleAction[];
}

interface ModuleAction {
  method: string;
  patchRequire: string[];
}