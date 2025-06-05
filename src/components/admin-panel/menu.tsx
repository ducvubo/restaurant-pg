'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Ellipsis } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { cn } from '@/lib/utils';
import { getMenuListEmployee, getMenuListRestaurant } from '@/lib/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollapseMenuButton } from '@/components/admin-panel/collapse-menu-button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { permissions } from '@/app/dashboard/policy/policy';
import { Module } from '@/app/dashboard/policy/policy.interface';
import buildPermissionSet from '@/app/dashboard/policy/buildPermissionSet';

interface MenuProps {
  isOpen: boolean | undefined;
}

const hasPermissionForPath = (
  path: string,
  key: string,
  poly_key: string[],
  permissions: Module[]
): boolean => {
  const cleanPath = path.split('?')[0];
  const permissionSet = buildPermissionSet(poly_key, cleanPath, permissions);
  return permissionSet[key] || false;
};


const getActionKeyForPath = (pathname: string): string | null => {
  const cleanPath = pathname.split('?')[0];
  for (const module of permissions) {
    for (const func of module.functions) {
      for (const action of func.actions) {
        for (const reqPath of action.patchRequire) {
          const normalizedReqPath = normalizePath(reqPath, cleanPath);
          if (cleanPath === normalizedReqPath) { // Khớp chính xác
            return action.key;
          }
        }
      }
    }
  }
  return null;
};

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

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);
  const poly_key = inforEmployee?.policy?.poly_key || [];
  const menuListEpl = getMenuListEmployee(pathname, poly_key);
  const menuList = inforRestaurant._id ? getMenuListRestaurant(pathname) : menuListEpl;
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log('pathname', pathname);
    setShowAlert(false);
    if (inforRestaurant._id || pathname === '/dashboard') {
      setShowAlert(false);
      return;
    }

    let hasAccess = false;

    // Kiểm tra submenu
    for (const group of menuListEpl) {
      for (const menu of group.menus) {
        for (const submenu of menu.submenus) {
          const submenuCleanHref = submenu.href.split('?')[0];
          if (
            (pathname === submenuCleanHref || pathname.startsWith(submenuCleanHref + '/')) &&
            hasPermissionForPath(pathname, submenu.key, poly_key, permissions)
          ) {
            hasAccess = true;
            break;
          }
        }
        if (hasAccess) break;

        const menuCleanHref = menu.href.split('?')[0];
        if (
          (pathname === menuCleanHref || pathname.startsWith(menuCleanHref + '/')) &&
          hasPermissionForPath(pathname, menu.key, poly_key, permissions)
        ) {
          hasAccess = true;
          break;
        }
      }
      if (hasAccess) break;
    }

    // Kiểm tra non-menu routes
    if (!hasAccess) {
      const cleanPath = pathname.split('?')[0];
      const actionKey = getActionKeyForPath(cleanPath);
      if (actionKey) {
        hasAccess = hasPermissionForPath(cleanPath, actionKey, poly_key, permissions);
      }

      if (!hasAccess && !actionKey) {
        const basePath = cleanPath.split('/').slice(0, 4).join('/');
        for (const module of permissions) {
          for (const func of module.functions) {
            const funcPaths = func.actions
              .flatMap((action) => action.patchRequire)
              .map((path) => path.split('/').slice(0, 4).join('/'))
              .filter((path) => path);
            if (funcPaths.includes(basePath)) {
              const hasActionWithPatch = func.actions.some((action) => action.patchRequire.length > 0);
              if (!hasActionWithPatch && hasPermissionForPath(cleanPath, func.key, poly_key, permissions)) {
                hasAccess = true;
              }
              break;
            }
          }
          if (hasAccess) break;
        }
      }

      setShowAlert(!hasAccess);
      console.log('done');
    }
  }, [pathname, poly_key, inforRestaurant._id, menuListEpl, router]);

  const handleRedirect = () => {
    setShowAlert(false);
    router.push('/dashboard');
  };

  if (menuList.length === 0 && !inforRestaurant._id) {
    return (
      <div className='p-4 text-center text-muted-foreground'>
        Bạn chưa có quyền truy cập vào chức năng nào. Vui lòng liên hệ chủ nhà hàng để được cấp quyền.
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Không có quyền truy cập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn không có quyền truy cập vào trang này. Bạn sẽ được chuyển về trang Dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRedirect}>Chuyển về Dashboard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollArea className='[&>div>div[style]]:!block'>
        <nav className='mt-8 h-full w-full'>
          <ul className='flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2'>
            {menuList.map(({ groupLabel, menus }, index) => (
              <li className={cn('w-full')} key={index}>
                {(isOpen && groupLabel) || isOpen === undefined ? (
                  <p className='text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate'>
                    {groupLabel}
                  </p>
                ) : !isOpen && isOpen !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className='w-full'>
                        <div className='w-full flex justify-center items-center'>
                          <Ellipsis className='h-5 w-5' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side='right'>
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className='pb-2'></p>
                )}
                {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className='w-full' key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? 'secondary' : 'ghost'}
                              className='w-full justify-start h-10 mb-1'
                              asChild
                            >
                              <Link href={href}>
                                <span className={cn(isOpen === false ? '' : 'mr-4')}>
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    'max-w-[200px] truncate',
                                    isOpen === false
                                      ? '-translate-x-96 opacity-0'
                                      : 'translate-x-0 opacity-100'
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && <TooltipContent side='right'>{label}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className='w-full' key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </>
  );
}