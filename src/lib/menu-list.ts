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
  Pizza,
  Component
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
  submenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuListRestaurant(pathname: string): Group[] {
  return [
    {
      groupLabel: 'Đơn hàng',
      menus: [
        {
          href: '/dashboard/order',
          label: 'Đơn đặt hàng',
          active: pathname.includes('/order'),
          icon: ListOrdered,
          submenus: [
            {
              href: '/dashboard/order/dish',
              label: 'Danh sách đơn đặt hàng',
              active: pathname === '/dashboard/order/dish'
            },
            {
              href: '/dashboard/order/table',
              label: 'Đơn đặt theo bàn',
              active: pathname === '/dashboard/order'
            },
            {
              href: '/dashboard/book-table',
              label: 'Danh sách đặt bàn',
              active: pathname === '/dashboard/book-table'
            }
          ]
        }
      ]
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: 'dashboard/employees',
          label: 'Quản lý nhân viên',
          active: pathname.includes('/employees'),
          icon: SquarePen,
          submenus: [
            {
              href: '/dashboard/employees?page=1&size=10',
              label: 'Quản lý nhân viên',
              active: pathname === '/dashboard/employees'
            },
            {
              href: '/dashboard/labels?page=1&size=10',
              label: 'Quản lý nhãn',
              active: pathname === '/dashboard/labels'
            },
            {
              href: '/dashboard/working-shifts?page=1&size=10',
              label: 'Quản lý ca làm việc',
              active: pathname === '/dashboard/working-shifts'
            },
            {
              href: '/dashboard/work-schedules',
              label: 'Quản lý lịch làm việc',
              active: pathname === '/dashboard/work-schedules'
            }
          ]
        },
        {
          href: '/dashboard/tables',
          label: 'Bàn ăn',
          active: pathname.includes('/tables'),
          icon: Bookmark,
          submenus: [
            {
              href: '/dashboard/tables',
              label: 'Quản lý bàn ăn',
              active: pathname === '/dashboard/tables'
            }
          ]
        },
        {
          href: '/dashboard/dishes',
          label: 'Món ăn',
          active: pathname.includes('/dishes'),
          icon: Salad,
          submenus: [
            {
              href: '/dashboard/categories',
              label: 'Quản lý danh mục',
              active: pathname === '/dashboard/categories'
            },
            {
              href: '/dashboard/dishes',
              label: 'Quản lý món ăn',
              active: pathname === '/dashboard/dishes'
            },
            {
              href: '/dashboard/foods',
              label: 'Quản lý món ăn online',
              active: pathname === '/dashboard/foods'
            },
            {
              href: '/dashboard/food-combos',
              label: 'Quản lý combo món ăn',
              active: pathname === '/dashboard/food-combos'
            }
          ]
        },
        {
          href: '/dashboard/guest',
          label: 'Khách hàng',
          active: pathname.includes('/guest'),
          icon: Users,
          submenus: [
            {
              href: '/dashboard/guest',
              label: 'Danh sách khách hàng',
              active: pathname === '/dashboard/guest'
            }
          ]
        },
        {
          href: '/dashboard/blogs',
          label: 'Blog',
          active: pathname.includes('/blogs'),
          icon: StickyNote,
          submenus: [
            {
              href: '/dashboard/blogs',
              label: 'Danh sách blog',
              active: pathname === '/dashboard/blogs'
            }
          ]
        },
        {
          href: '/dashboard/warehouse',
          label: 'Quản lý kho',
          active: pathname.includes('/warehouse'),
          icon: LayoutGrid,
          submenus: [
            {
              href: '/dashboard/suppliers',
              label: 'Nhà cung cấp',
              active: pathname === '/dashboard/suppliers'
            },
            {
              href: '/dashboard/cat-ingredients',
              label: 'Danh mục nguyên liệu',
              active: pathname === '/dashboard/cat-ingredients'
            },
            {
              href: '/dashboard/units',
              label: 'Đơn vị đo',
              active: pathname === '/dashboard/units'
            },
            {
              href: '/dashboard/ingredients',
              label: 'Nguyên liệu',
              active: pathname === '/dashboard/ingredients'
            },
            {
              href: '/dashboard/stock-in',
              label: 'Nhập kho',
              active: pathname === '/dashboard/stock-in'
            },
            {
              href: '/dashboard/stock-out',
              label: 'Xuất kho',
              active: pathname === '/dashboard/stock-out'
            }
          ]
        }
      ]
    }
  ]
}

export function getMenuListEmployee(pathname: string): Group[] {
  return [
    {
      groupLabel: 'Đơn hàng',
      menus: [
        {
          href: '/dashboard/order',
          label: 'Đơn đặt hàng',
          active: pathname.includes('/order'),
          icon: ListOrdered,
          submenus: [
            {
              href: '/dashboard/order/dish',
              label: 'Danh sách đơn đặt hàng',
              active: pathname === '/dashboard/order/dish'
            },
            {
              href: '/dashboard/order/table',
              label: 'Đơn đặt theo bàn',
              active: pathname === '/dashboard/order'
            }
          ]
        }
      ]
    },
    {
      groupLabel: 'Quan lý',
      menus: [
        {
          href: '/dashboard/tables',
          label: 'Bàn ăn',
          active: pathname.includes('/tables'),
          icon: Bookmark,
          submenus: [
            {
              href: '/dashboard/tables',
              label: 'Danh sách bàn ăn',
              active: pathname === '/dashboard/tables'
            },
            {
              href: '/dashboard/tables/add',
              label: 'Thêm bàn ăn',
              active: pathname === '/dashboard/tables/add'
            },
            {
              href: '/dashboard/tables/recycle?page=1&size=10',
              label: 'Danh sách đã xóa',
              active: pathname === '/dashboard/tables/recycle'
            }
          ]
        },
        {
          href: '/dashboard/categories',
          label: 'Danh mục',
          active: pathname.includes('/categories'),
          icon: HandPlatter,
          submenus: [
            {
              href: '/dashboard/categories',
              label: 'Danh sách danh mục',
              active: pathname === '/dashboard/categories'
            },
            {
              href: '/dashboard/categories/add',
              label: 'Thêm danh mục',
              active: pathname === '/dashboard/categories/add'
            },
            {
              href: '/dashboard/categories/recycle?page=1&size=10',
              label: 'Danh sách đã xóa',
              active: pathname === '/dashboard/categories/recycle'
            }
          ]
        },
        {
          href: '/dashboard/dishes',
          label: 'Món ăn',
          active: pathname.includes('/dishes'),
          icon: Salad,
          submenus: [
            {
              href: '/dashboard/dishes',
              label: 'Danh sách món ăn',
              active: pathname === '/dashboard/dishes'
            },
            {
              href: '/dashboard/dishes/add',
              label: 'Thêm món ăn',
              active: pathname === '/dashboard/dishes/add'
            },
            {
              href: '/dashboard/dishes/recycle?page=1&size=10',
              label: 'Danh sách đã xóa',
              active: pathname === '/dashboard/dishes/recycle'
            }
          ]
        },
        {
          href: '/dashboard/foods',
          label: 'Món ăn online',
          active: pathname.includes('/foods'),
          icon: Salad,
          submenus: [
            {
              href: '/dashboard/foods/add',
              label: 'Thêm món mới',
              active: pathname === '/dashboard/foods/add'
            },
            {
              href: '/dashboard/foods',
              label: 'Danh sách món ăn',
              active: pathname === '/dashboard/foods'
            },
            {
              href: '/dashboard/foods/recycle',
              label: 'Danh sách đã xóa',
              active: pathname === '/dashboard/foods/recycle'
            }
          ]
        },
        {
          href: '/dashboard/guest',
          label: 'Khách hàng',
          active: pathname.includes('/guest'),
          icon: Users,
          submenus: [
            {
              href: '/dashboard/guest',
              label: 'Danh sách khách hàng',
              active: pathname === '/dashboard/guest'
            }
          ]
        }
      ]
    }
  ]
}
