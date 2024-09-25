import { Tag, Users, Settings, Bookmark, SquarePen, LayoutGrid, LucideIcon, Salad } from 'lucide-react'

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
      groupLabel: 'Chủ cửa hàng',
      menus: [
        {
          href: '',
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
        }
      ]
    },

    {
      groupLabel: 'Nhân viên',
      menus: [
        {
          href: '/categories',
          label: 'Categories',
          active: pathname.includes('/categories'),
          icon: Bookmark,
          submenus: []
        },
        {
          href: '/tags',
          label: 'Tags',
          active: pathname.includes('/tags'),
          icon: Tag,
          submenus: []
        }
      ]
    }
  ]
}

export function getMenuListEmployee(pathname: string): Group[] {
  return [
    {
      groupLabel: 'Nhân viên',
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
          href: '/tags',
          label: 'Tags',
          active: pathname.includes('/tags'),
          icon: Tag,
          submenus: []
        }
      ]
    }
  ]
}
