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
import buildPermissionSet from '@/app/dashboard/policy/buildPermissionSet';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  key: string;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  key: string;
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
  const cleanPath = path.split('?')[0]; // Bỏ query params
  const permissionSet = buildPermissionSet(poly_key, cleanPath, permissions);
  return permissionSet[key] || false;
};

const baseMenuList = (pathname: string): Group[] => {
  return [
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: '/dashboard/order',
          label: 'Đơn đặt hàng',
          active: pathname.includes('/order') || pathname === '/dashboard/book-table' || pathname === '/dashboard/book-room',
          icon: ListOrdered,
          key: 'order_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/order/dish',
              label: 'Danh sách đơn đặt hàng',
              active: pathname === '/dashboard/order/dish',
              key: 'order_dish', // Khớp với function.key
            },
            // {
            //   href: '/dashboard/order/table',
            //   label: 'Đơn đặt theo bàn',
            //   active: pathname === '/dashboard/order/table',
            //   key: 'order_table',
            // },
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
              key: 'order_combo', // Khớp với function.key
            },
            {
              href: '/dashboard/book-room',
              label: 'Danh sách đặt phòng',
              active: pathname === '/dashboard/book-room',
              key: 'book_room', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/ticket-guest',
          label: 'Quản lý hỗ trợ',
          active: pathname.includes('/ticket-guest') || pathname === '/dashboard/connect' || pathname === '/dashboard/chat-bot',
          icon: TicketCheck,
          key: 'ticket_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/ticket-guest',
              label: 'Danh sách hỏi đáp',
              active: pathname === '/dashboard/ticket-guest',
              key: 'ticket_list', // Khớp với function.key
            },
            {
              href: '/dashboard/connect',
              label: 'Tin nhắn khách hàng',
              active: pathname === '/dashboard/connect',
              key: 'ticket_connect_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/chat-bot',
              label: 'Chat bot khách hàng',
              active: pathname === '/dashboard/chat-bot',
              key: 'chat_bot_list', // Sửa thành khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/rooms',
          label: 'Quản lý phòng/sảnh',
          active: pathname.includes('/rooms') || pathname.includes('/amenities') || pathname.includes('/menu-items'),
          icon: Album,
          key: 'rooms_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/rooms',
              label: 'Quản lý phòng/sảnh',
              active: pathname === '/dashboard/rooms',
              key: 'room_list', // Khớp với function.key
            },
            {
              href: '/dashboard/amenities',
              label: 'Quản lý dịch vụ',
              active: pathname === '/dashboard/amenities',
              key: 'amenities_list', // Khớp với function.key
            },
            {
              href: '/dashboard/menu-items',
              label: 'Quản lý thực đơn',
              active: pathname === '/dashboard/menu-items',
              key: 'menu_items_list', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/employees',
          label: 'Quản lý nhân viên',
          active: pathname.includes('/employees') || pathname.includes('/labels') || pathname.includes('/working-shifts') || pathname.includes('/work-schedules') || pathname.includes('/leave-application'),
          icon: SquarePen,
          key: 'employees_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/employees',
              label: 'Quản lý nhân viên',
              active: pathname === '/dashboard/employees',
              key: 'employee_list', // Khớp với function.key, bỏ query params
            },
            {
              href: '/dashboard/labels',
              label: 'Quản lý nhãn',
              active: pathname === '/dashboard/labels',
              key: 'label_list', // Sửa thành khớp với function.key, bỏ query params
            },
            {
              href: '/dashboard/working-shifts',
              label: 'Quản lý ca làm việc',
              active: pathname === '/dashboard/working-shifts',
              key: 'working_shift_list', // Sửa thành khớp với function.key, bỏ query params
            },
            {
              href: '/dashboard/work-schedules',
              label: 'Quản lý lịch làm việc',
              active: pathname === '/dashboard/work-schedules',
              key: 'work_schedule_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/leave-application',
              label: 'Quản lý đơn xin nghỉ phép',
              active: pathname === '/dashboard/leave-application',
              key: 'leave_application', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/tables',
          label: 'Bàn ăn',
          active: pathname.includes('/tables'),
          icon: Bookmark,
          key: 'tables_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/tables',
              label: 'Quản lý bàn ăn',
              active: pathname === '/dashboard/tables',
              key: 'table_list', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/dishes',
          label: 'Món ăn',
          active: pathname.includes('/dishes') || pathname.includes('/foods') || pathname.includes('/food-combos') || pathname.includes('/special-offers'),
          icon: Salad,
          key: 'dish_menu', // Sửa thành khớp với module.key
          submenus: [
            {
              href: '/dashboard/dishes',
              label: 'Quản lý món ăn',
              active: pathname === '/dashboard/dishes',
              key: 'dish_list', // Khớp với function.key
            },
            {
              href: '/dashboard/foods',
              label: 'Quản lý món ăn online',
              active: pathname === '/dashboard/foods',
              key: 'online_dish', // Khớp với function.key
            },
            {
              href: '/dashboard/food-combos',
              label: 'Quản lý combo món ăn',
              active: pathname === '/dashboard/food-combos',
              key: 'food_combo', // Khớp với function.key
            },
            {
              href: '/dashboard/special-offers',
              label: 'Quản lý ưu đãi',
              active: pathname === '/dashboard/special-offers',
              key: 'special_offer', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/guest',
          label: 'Khách hàng',
          active: pathname.includes('/guest'),
          icon: Users,
          key: 'guest_menu', // Sửa thành khớp với module.key
          submenus: [
            {
              href: '/dashboard/guest',
              label: 'Danh sách khách hàng',
              active: pathname === '/dashboard/guest',
              key: 'guest_list', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/blogs',
          label: 'Blog',
          active: pathname.includes('/blogs') || pathname.includes('/category-blog') || pathname.includes('/article'),
          icon: StickyNote,
          key: 'blog_menu', // Sửa thành khớp với module.key
          submenus: [
            {
              href: '/dashboard/category-blog',
              label: 'Danh mục blog',
              active: pathname === '/dashboard/category-blog',
              key: 'category_blog', // Khớp với function.key
            },
            {
              href: '/dashboard/article',
              label: 'Bài viết',
              active: pathname === '/dashboard/article',
              key: 'article', // Khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/warehouse',
          label: 'Quản lý kho',
          active: pathname.includes('/warehouse') || pathname.includes('/suppliers') || pathname.includes('/cat-ingredients') || pathname.includes('/units') || pathname.includes('/ingredients') || pathname.includes('/stock-in') || pathname.includes('/stock-out'),
          icon: LayoutGrid,
          key: 'warehouse_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/suppliers',
              label: 'Nhà cung cấp',
              active: pathname === '/dashboard/suppliers',
              key: 'supplier_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/cat-ingredients',
              label: 'Danh mục nguyên liệu',
              active: pathname === '/dashboard/cat-ingredients',
              key: 'cat_ingredient_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/units',
              label: 'Đơn vị đo',
              active: pathname === '/dashboard/units',
              key: 'unit_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/ingredients',
              label: 'Nguyên liệu',
              active: pathname === '/dashboard/ingredients',
              key: 'ingredient_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/stock-in',
              label: 'Nhập kho',
              active: pathname === '/dashboard/stock-in',
              key: 'stock_in_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/stock-out',
              label: 'Xuất kho',
              active: pathname === '/dashboard/stock-out',
              key: 'stock_out_list', // Sửa thành khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/other',
          label: 'Quản lý nội bộ',
          active: pathname.includes('/other') || pathname.includes('/internal-note') || pathname.includes('/internal-proposal') || pathname.includes('/equipment-maintenance') || pathname.includes('/operation-manual') || pathname.includes('/operational-costs'),
          icon: EthernetPort,
          key: 'internal_menu', // Sửa thành khớp với module.key
          submenus: [
            {
              href: '/dashboard/internal-note',
              label: 'Quản lý ghi chú',
              active: pathname === '/dashboard/internal-note',
              key: 'internal_note', // Khớp với function.key
            },
            {
              href: '/dashboard/internal-proposal',
              label: 'Quản lý đề xuất',
              active: pathname === '/dashboard/internal-proposal',
              key: 'internal_proposal_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/equipment-maintenance',
              label: 'Quản lý bảo trì thiết bị',
              active: pathname === '/dashboard/equipment-maintenance',
              key: 'equipment_maintenance_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/operation-manual',
              label: 'Quản lý tài liệu vận hành',
              active: pathname === '/dashboard/operation-manual',
              key: 'operation_manual_list', // Sửa thành khớp với function.key
            },
            {
              href: '/dashboard/operational-costs',
              label: 'Quản lý chi phí vận hành',
              active: pathname === '/dashboard/operational-costs',
              key: 'operational_costs_list', // Sửa thành khớp với function.key
            },
          ],
        },
        {
          href: '/dashboard/policy',
          label: 'Phân quyền',
          active: pathname.includes('/policy') || pathname.includes('/assign-policy'),
          icon: Settings,
          key: 'policy_menu', // Khớp với module.key
          submenus: [
            {
              href: '/dashboard/policy',
              label: 'Quyền chức năng',
              active: pathname === '/dashboard/policy',
              key: 'policy_list', // Khớp với function.key
            },
          ],
        },
      ],
    },
  ];
};

export function getMenuListEmployee(pathname: string, poly_key: string[]): Group[] {
  if (poly_key.length === 0) {
    return [];
  }

  const filteredMenuList: Group[] = baseMenuList(pathname)
    .map((group: Group) => {
      const filteredMenus = group.menus
        .map((menu: Menu) => {
          const filteredSubmenus = menu.submenus.filter((submenu: Submenu) => {
            const hasAccess = hasPermissionForPath(submenu.href, submenu.key, poly_key, permissions);
            return hasAccess;
          });
          const menuHasAccess = hasPermissionForPath(menu.href, menu.key, poly_key, permissions);
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
      return group.menus.length > 0;
    });
  return filteredMenuList;
}

export function getMenuListRestaurant(pathname: string): Group[] {
  return baseMenuList(pathname);
}