import { permissions } from '@/app/dashboard/policy/policy';
import { Module } from '@/app/dashboard/policy/policy.interface';
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Salad,
  HandPlatter,
  ListOrdered,
  TicketCheck,
  StickyNote,
  Album,
  EthernetPort,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  key: string; // Added key
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  key: string; // Added key
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const hasPermissionForPath = (
  path: string,
  key: string,
  poly_key: string[],
  permissions: Module[]
): boolean => {
  // Check key directly in poly_key
  if (poly_key.includes(key)) {
    console.log(`🚀 ~ hasPermissionForPath ~ Key match: ${key} for ${path}`);
    return true;
  }

  // Remove query parameters from path for comparison
  const cleanPath = path.split('?')[0];
  for (const module of permissions) {
    // Check module key
    if (module.key === key && poly_key.includes(module.key)) {
      console.log(`🚀 ~ hasPermissionForPath ~ Module key match: ${module.key} for ${cleanPath}`);
      return true;
    }
    for (const func of module.functions) {
      // Check function key
      if (func.key === key && poly_key.includes(func.key)) {
        console.log(`🚀 ~ hasPermissionForPath ~ Function key match: ${func.key} for ${cleanPath}`);
        return true;
      }
      // Check action-specific permissions
      for (const action of func.actions) {
        if (
          action.patchRequire.some((p) => cleanPath.startsWith(p)) &&
          poly_key.includes(action.key)
        ) {
          console.log(`🚀 ~ hasPermissionForPath ~ Action match: ${action.key} for ${cleanPath}`);
          return true;
        }
      }
    }
  }
  console.log(`🚀 ~ hasPermissionForPath ~ No match for ${cleanPath} with key ${key}`);
  return false;
};

const baseMenuList = (pathname: string): Group[] => {
  return [
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: '/dashboard/order',
          label: 'Đơn đặt hàng',
          active: pathname.includes('/order'),
          icon: ListOrdered,
          key: 'order', // Matches module.key
          submenus: [
            {
              href: '/dashboard/order/dish',
              label: 'Danh sách đơn đặt hàng',
              active: pathname === '/dashboard/order/dish',
              key: 'order_dish', // Matches function.key
            },
            {
              href: '/dashboard/order/table',
              label: 'Đơn đặt theo bàn',
              active: pathname === '/dashboard/order/table',
              key: 'order_table',
            },
            {
              href: '/dashboard/book-table',
              label: 'Danh sách đặt bàn',
              active: pathname === '/dashboard/book-table',
              key: 'book_table',
            },
            {
              href: '/dashboard/order-food',
              label: 'Danh sách đặt món ăn',
              active: pathname === '/dashboard/order-food',
              key: 'order_food',
            },
            {
              href: '/dashboard/order-combo',
              label: 'Danh sách đặt combo',
              active: pathname === '/dashboard/order-combo',
              key: 'order_combo',
            },
            {
              href: '/dashboard/book-room',
              label: 'Danh sách đặt phòng',
              active: pathname === '/dashboard/book-room',
              key: 'book_room',
            },
          ],
        },
        {
          href: '/dashboard/ticket-guest',
          label: 'Quản lý hỗ trợ',
          active: pathname.includes('/ticket-guest'),
          icon: TicketCheck,
          key: 'ticket_guest',
          submenus: [
            {
              href: '/dashboard/ticket-guest',
              label: 'Danh sách hỏi đáp',
              active: pathname === '/dashboard/ticket-guest',
              key: 'ticket_list',
            },
            {
              href: '/dashboard/connect',
              label: 'Tin nhắn khách hàng',
              active: pathname === '/dashboard/connect',
              key: 'ticket_connect',
            },
            {
              href: '/dashboard/chat-bot',
              label: 'Chat bot khách hàng',
              active: pathname === '/dashboard/chat-bot',
              key: 'chat_bot',
            },
          ],
        },
        {
          href: '/dashboard/rooms',
          label: 'Quản lý phòng/sảnh',
          active: pathname.includes('/rooms'),
          icon: Album,
          key: 'rooms',
          submenus: [
            {
              href: '/dashboard/rooms',
              label: 'Quản lý phòng/sảnh',
              active: pathname === '/dashboard/rooms',
              key: 'room_list',
            },
            {
              href: '/dashboard/amenities',
              label: 'Quản lý dịch vụ',
              active: pathname === '/dashboard/amenities',
              key: 'amenities',
            },
            {
              href: '/dashboard/menu-items',
              label: 'Quản lý thực đơn',
              active: pathname === '/dashboard/menu-items',
              key: 'menu_items',
            },
          ],
        },
        {
          href: '/dashboard/employees',
          label: 'Quản lý nhân viên',
          active: pathname.includes('/employees'),
          icon: SquarePen,
          key: 'employees',
          submenus: [
            {
              href: '/dashboard/employees?page=1&size=10',
              label: 'Quản lý nhân viên',
              active: pathname === '/dashboard/employees',
              key: 'employee_list',
            },
            {
              href: '/dashboard/labels?page=1&size=10',
              label: 'Quản lý nhãn',
              active: pathname === '/dashboard/labels',
              key: 'label',
            },
            {
              href: '/dashboard/working-shifts?page=1&size=10',
              label: 'Quản lý ca làm việc',
              active: pathname === '/dashboard/working-shifts',
              key: 'working_shift',
            },
            {
              href: '/dashboard/work-schedules',
              label: 'Quản lý lịch làm việc',
              active: pathname === '/dashboard/work-schedules',
              key: 'work_schedule',
            },
            {
              href: '/dashboard/leave-application',
              label: 'Quản lý đơn xin nghỉ phép',
              active: pathname === '/dashboard/leave-application',
              key: 'leave_application',
            },
          ],
        },
        {
          href: '/dashboard/tables',
          label: 'Bàn ăn',
          active: pathname.includes('/tables'),
          icon: Bookmark,
          key: 'tables',
          submenus: [
            {
              href: '/dashboard/tables',
              label: 'Quản lý bàn ăn',
              active: pathname === '/dashboard/tables',
              key: 'table_list',
            },
          ],
        },
        {
          href: '/dashboard/dishes',
          label: 'Món ăn',
          active: pathname.includes('/dishes'),
          icon: Salad,
          key: 'dishes',
          submenus: [
            {
              href: '/dashboard/dishes',
              label: 'Quản lý món ăn',
              active: pathname === '/dashboard/dishes',
              key: 'dish_list',
            },
            {
              href: '/dashboard/foods',
              label: 'Quản lý món ăn online',
              active: pathname === '/dashboard/foods',
              key: 'online_dish',
            },
            {
              href: '/dashboard/food-combos',
              label: 'Quản lý combo món ăn',
              active: pathname === '/dashboard/food-combos',
              key: 'food_combo',
            },
            {
              href: '/dashboard/special-offers',
              label: 'Quản lý ưu đãi',
              active: pathname === '/dashboard/special-offers',
              key: 'special_offer',
            },
          ],
        },
        {
          href: '/dashboard/guest',
          label: 'Khách hàng',
          active: pathname.includes('/guest'),
          icon: Users,
          key: 'guest',
          submenus: [
            {
              href: '/dashboard/guest',
              label: 'Danh sách khách hàng',
              active: pathname === '/dashboard/guest',
              key: 'guest_list',
            },
          ],
        },
        {
          href: '/dashboard/blogs',
          label: 'Blog',
          active: pathname.includes('/blogs'),
          icon: StickyNote,
          key: 'blog',
          submenus: [
            {
              href: '/dashboard/category-blog',
              label: 'Danh mục blog',
              active: pathname === '/dashboard/category-blog',
              key: 'category_blog',
            },
            {
              href: '/dashboard/article',
              label: 'Bài viết',
              active: pathname === '/dashboard/article',
              key: 'article',
            },
          ],
        },
        {
          href: '/dashboard/warehouse',
          label: 'Quản lý kho',
          active: pathname.includes('/warehouse'),
          icon: LayoutGrid,
          key: 'warehouse',
          submenus: [
            {
              href: '/dashboard/suppliers',
              label: 'Nhà cung cấp',
              active: pathname === '/dashboard/suppliers',
              key: 'supplier',
            },
            {
              href: '/dashboard/cat-ingredients',
              label: 'Danh mục nguyên liệu',
              active: pathname === '/dashboard/cat-ingredients',
              key: 'cat_ingredient',
            },
            {
              href: '/dashboard/units',
              label: 'Đơn vị đo',
              active: pathname === '/dashboard/units',
              key: 'unit',
            },
            {
              href: '/dashboard/ingredients',
              label: 'Nguyên liệu',
              active: pathname === '/dashboard/ingredients',
              key: 'ingredient',
            },
            {
              href: '/dashboard/stock-in',
              label: 'Nhập kho',
              active: pathname === '/dashboard/stock-in',
              key: 'stock_in',
            },
            {
              href: '/dashboard/stock-out',
              label: 'Xuất kho',
              active: pathname === '/dashboard/stock-out',
              key: 'stock_out',
            },
          ],
        },
        {
          href: '/dashboard/other',
          label: 'Quản lý nội bộ',
          active: pathname.includes('/other'),
          icon: EthernetPort,
          key: 'internal',
          submenus: [
            {
              href: '/dashboard/internal-note',
              label: 'Quản lý ghi chú',
              active: pathname === '/dashboard/internal-note',
              key: 'internal_note',
            },
            {
              href: '/dashboard/internal-proposal',
              label: 'Quản lý đề xuất',
              active: pathname === '/dashboard/internal-proposal',
              key: 'internal_proposal',
            },
            {
              href: '/dashboard/equipment-maintenance',
              label: 'Quản lý bảo trì thiết bị',
              active: pathname === '/dashboard/equipment-maintenance',
              key: 'equipment_maintenance',
            },
            {
              href: '/dashboard/operation-manual',
              label: 'Quản lý tài liệu vận hành',
              active: pathname === '/dashboard/operation-manual',
              key: 'operation_manual',
            },
            {
              href: '/dashboard/operational-costs',
              label: 'Quản lý chi phí vận hành',
              active: pathname === '/dashboard/operational-costs',
              key: 'operational_costs',
            },
          ],
        },
        {
          href: '/dashboard/policy',
          label: 'Phân quyền',
          active: pathname.includes('/policy'),
          icon: Settings,
          key: 'policy',
          submenus: [
            {
              href: '/dashboard/policy',
              label: 'Quyền chức năng',
              active: pathname === '/dashboard/policy',
              key: 'policy_list',
            },
            {
              href: '/dashboard/assign-policy',
              label: 'Phân quyền',
              active: pathname === '/dashboard/assign-policy',
              key: 'assign_policy',
            },
          ],
        },
      ],
    },
  ];
};

export function getMenuListEmployee(pathname: string, poly_key: string[]): Group[] {
  console.log('🚀 ~ getMenuListEmployee ~ pathname:', pathname);
  console.log('🚀 ~ getMenuListEmployee ~ poly_key:', poly_key);
  if (poly_key.length === 0) {
    console.warn('No permissions found in poly_key. Returning empty menu.');
    return [];
  }

  const filteredMenuList: Group[] = baseMenuList(pathname)
    .map((group: Group) => {
      const filteredMenus = group.menus
        .map((menu: Menu) => {
          const filteredSubmenus = menu.submenus.filter((submenu: Submenu) => {
            const hasAccess = hasPermissionForPath(submenu.href, submenu.key, poly_key, permissions);
            console.log(`🚀 ~ Checking submenu: ${submenu.href} (key: ${submenu.key}), hasAccess: ${hasAccess}`);
            return hasAccess;
          });
          const menuHasAccess = hasPermissionForPath(menu.href, menu.key, poly_key, permissions);
          console.log(`🚀 ~ Checking menu: ${menu.href} (key: ${menu.key}), hasAccess: ${menuHasAccess}, submenus: ${filteredSubmenus.length}`);
          return {
            ...menu,
            submenus: filteredSubmenus,
          };
        })
        .filter((menu: Menu) => menu.submenus.length > 0 || hasPermissionForPath(menu.href, menu.key, poly_key, permissions));
      return {
        ...group,
        menus: filteredMenus,
      };
    })
    .filter((group: Group) => {
      console.log(`🚀 ~ Group: ${group.groupLabel}, menus: ${group.menus.length}`);
      return group.menus.length > 0;
    });

  console.log(
    '🚀 ~ getMenuListEmployee ~ filteredMenuList:',
    JSON.stringify(
      filteredMenuList.map((group: Group) => ({
        ...group,
        menus: group.menus.map((menu: Menu) => ({
          ...menu,
          icon: undefined, // Skip icon in log
        })),
      })),
      null,
      2
    )
  );
  return filteredMenuList;
}

export function getMenuListRestaurant(pathname: string): Group[] {
  return baseMenuList(pathname);
}