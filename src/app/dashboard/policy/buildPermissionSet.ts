import { Module, ModuleAction } from './policy.interface';

function normalizePath(path: string, pathname: string): string {
  const pathSegments = path.split('/');
  const pathnameSegments = pathname.split('/');
  return pathSegments
    .map((segment, index) => {
      if (segment === ':id' && index < pathnameSegments.length) {
        return pathnameSegments[index];
      }
      return segment;
    })
    .join('/');
}

function isPathMatch(pathname: string, patchRequire: string[]): boolean {
  if (!patchRequire || patchRequire.length === 0) {
    return false; // Yêu cầu patchRequire phải có để kiểm tra quyền
  }

  const cleanPathname = pathname.split('?')[0];
  return patchRequire.some((requiredPath) => {
    const normalizedRequiredPath = normalizePath(requiredPath, cleanPathname);
    return cleanPathname === normalizedRequiredPath || cleanPathname.startsWith(normalizedRequiredPath + '/');
  });
}

function buildPermissionSet(poly_key: string[], pathname: string, permissions: Module[]): Record<string, boolean> {
  const permissionSet: Record<string, boolean> = {};

  // Khởi tạo permissionSet
  permissions.forEach((module) => {
    permissionSet[module.key] = false;
    module.functions.forEach((func) => {
      permissionSet[func.key] = false;
      func.actions.forEach((action) => {
        permissionSet[action.key] = false;
      });
    });
  });

  // Kiểm tra quyền theo thứ tự: action -> function -> module
  permissions.forEach((module) => {
    module.functions.forEach((func) => {
      func.actions.forEach((action) => {
        if (poly_key.includes(action.key) && isPathMatch(pathname, action.patchRequire)) {
          permissionSet[action.key] = true;
        }
      });
      // Chỉ gán function.key nếu có action hợp lệ hoặc poly_key chứa function.key
      if (
        poly_key.includes(func.key) ||
        func.actions.some((action) => permissionSet[action.key])
      ) {
        permissionSet[func.key] = true;
      }
    });
    // Chỉ gán module.key nếu có function hợp lệ hoặc poly_key chứa module.key
    if (
      poly_key.includes(module.key) ||
      module.functions.some((func) => permissionSet[func.key])
    ) {
      permissionSet[module.key] = true;
    }
  });

  return permissionSet;
}

export default buildPermissionSet;