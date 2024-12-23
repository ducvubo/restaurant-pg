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
  StickyNote
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
              href: '/dashboard/employees/add',
              label: 'Thêm nhân viên',
              active: pathname === '/dashboard/employees/add'
            },
            {
              href: '/dashboard/employees?page=1&size=10',
              label: 'Danh sách nhân viên',
              active: pathname === '/dashboard/employees'
            },
            {
              href: '/dashboard/employees/recycle?page=1&size=10',
              label: 'Danh sách đã xóa',
              active: pathname === '/dashboard/employees/recycle'
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
          href: '/dashboard/book-table',
          label: 'Đặt bàn',
          active: pathname.includes('/book-table'),
          icon: TicketCheck,
          submenus: [
            {
              href: '/dashboard/book-table',
              label: 'Danh sách đặt bàn',
              active: pathname === '/dashboard/book-table'
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
          href: '/dashboard/blogs',
          label: 'Blog',
          active: pathname.includes('/blogs'),
          icon: StickyNote,
          submenus: [
            {
              href: '/dashboard/blogs/add',
              label: 'Viết blog',
              active: pathname === '/dashboard/blogs/add'
            },
            {
              href: '/dashboard/blogs',
              label: 'Danh sách blog',
              active: pathname === '/dashboard/blogs'
            },
            {
              href: '/dashboard/blogs/recycle',
              label: 'Danh sách đã xóa',
              active: pathname === '/dashboard/blogs/recycle'
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
