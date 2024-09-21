import { Tag, Users, Settings, Bookmark, SquarePen, LayoutGrid, LucideIcon } from 'lucide-react'

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
