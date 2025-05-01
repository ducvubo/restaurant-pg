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
  Component,
  EthernetPort
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
            },
            {
              href: '/dashboard/order-food',
              label: 'Danh sách đặt món ăn',
              active: pathname === '/dashboard/order-food'
            },
            {
              href: '/dashboard/order-combo',
              label: 'Danh sách đặt combo',
              active: pathname === '/dashboard/order-combo'
            },
            {
              href: '/dashboard/book-room',
              label: 'Danh sách đặt phòng',
              active: pathname === '/dashboard/book-room'
            },
          ]
        },
      ]
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          active: pathname.includes('/dashboard/ticket-guest'),
          href: '/dashboard/ticket-guest',
          icon: TicketCheck,
          label: 'Quản lý hỗ trợ',
          submenus: [
            {
              active: pathname === '/dashboard/ticket-guest',
              href: '/dashboard/ticket-guest',
              label: 'Danh sách hỏi đáp'
            },
            {
              active: pathname === '/dashboard/connect',
              href: '/dashboard/connect',
              label: 'Tin nhắn khách hàng'
            }
          ]
        },
        {
          active: pathname.includes('/dashboard/rooms'),
          href: '/dashboard/rooms',
          icon: Album,
          label: 'Quản lý phòng/sảnh',
          submenus: [
            {
              active: pathname === '/dashboard/rooms',
              href: '/dashboard/rooms',
              label: 'Quản lý phòng/sảnh'
            },
            {
              active: pathname === '/dashboard/amenities',
              href: '/dashboard/amenities',
              label: 'Quản lý dịch vụ'
            },
            {
              active: pathname === '/dashboard/menu-items',
              href: '/dashboard/menu-items',
              label: 'Quản lý thực đơn'
            }
          ]
        },
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
            },
            {
              href: '/dashboard/leave-application',
              label: 'Quản lý đơn xin nghỉ phép',
              active: pathname === '/dashboard/leave-application'
            },
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
            },
            {
              href: '/dashboard/special-offers',
              label: 'Quản lý ưu đãi',
              active: pathname === '/dashboard/special-offers'
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
              href: '/dashboard/category-blog',
              label: 'Danh mục blog',
              active: pathname === '/dashboard/category-blog'
            },
            {
              href: '/dashboard/article',
              label: 'Bài viết',
              active: pathname === '/dashboard/article'
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
        },
        {
          href: '/dashboard/other',
          label: 'Quản lý nội bộ',
          active: pathname.includes('/other'),
          icon: EthernetPort,
          submenus: [
            {
              href: '/dashboard/internal-note',
              label: 'Quản lý ghi chú',
              active: pathname === '/dashboard/internal-note'
            },
            {
              href: '/dashboard/internal-proposal',
              label: 'Quản lý đề xuất',
              active: pathname === '/dashboard/internal-proposal'
            },
            {
              href: '/dashboard/equipment-maintenance',
              label: 'Quản lý bảo trì thiết bị',
              active: pathname === '/dashboard/equipment-maintenance'
            },
            {
              href: '/dashboard/operation-manual',
              label: 'Quản lý tài liệu vận hành',
              active: pathname === '/dashboard/operation-manual'
            },
            //operational-costs
            {
              href: '/dashboard/operational-costs',
              label: 'Quản lý chi phí vận hành',
              active: pathname === '/dashboard/operational-costs'
            },
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
            },
            {
              href: '/dashboard/book-table',
              label: 'Danh sách đặt bàn',
              active: pathname === '/dashboard/book-table'
            },
            {
              href: '/dashboard/order-food',
              label: 'Danh sách đặt món ăn',
              active: pathname === '/dashboard/order-food'
            },
            {
              href: '/dashboard/order-combo',
              label: 'Danh sách đặt combo',
              active: pathname === '/dashboard/order-combo'
            },
          ]
        },
      ]
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          active: pathname.includes('/dashboard/ticket-guest'),
          href: '/dashboard/ticket-guest',
          icon: TicketCheck,
          label: 'Quản lý hỗ trợ',
          submenus: [
            {
              active: pathname === '/dashboard/ticket-guest',
              href: '/dashboard/ticket-guest',
              label: 'Danh sách hỏi đáp'
            },
            {
              active: pathname === '/dashboard/connect',
              href: '/dashboard/connect',
              label: 'Tin nhắn khách hàng'
            }
          ]
        },
        {
          active: pathname.includes('/dashboard/rooms'),
          href: '/dashboard/rooms',
          icon: Album,
          label: 'Quản lý phòng/sảnh',
          submenus: [
            {
              active: pathname === '/dashboard/rooms',
              href: '/dashboard/rooms',
              label: 'Quản lý phòng/sảnh'
            },
            {
              active: pathname === '/dashboard/amenities',
              href: '/dashboard/amenities',
              label: 'Quản lý dịch vụ'
            },
            {
              active: pathname === '/dashboard/menu-category',
              href: '/dashboard/menu-category',
              label: 'Quản lý danh mục thực đơn'
            },
            {
              active: pathname === '/dashboard/menu-items',
              href: '/dashboard/menu-items',
              label: 'Quản lý thực đơn'
            }
          ]
        },
        {
          href: 'dashboard/employees',
          label: 'Quản lý nhân viên',
          active: pathname.includes('/employees'),
          icon: SquarePen,
          submenus: [
            {
              href: '/dashboard/work-schedules',
              label: 'Quản lý lịch làm việc',
              active: pathname === '/dashboard/work-schedules'
            },
            {
              href: '/dashboard/leave-application',
              label: 'Quản lý đơn xin nghỉ phép',
              active: pathname === '/dashboard/leave-application'
            },
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
            // {
            //   href: '/dashboard/categories',
            //   label: 'Quản lý danh mục',
            //   active: pathname === '/dashboard/categories'
            // },
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
            },
            {
              href: '/dashboard/special-offers',
              label: 'Quản lý ưu đãi',
              active: pathname === '/dashboard/special-offers'
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
              href: '/dashboard/category-blog',
              label: 'Danh mục blog',
              active: pathname === '/dashboard/category-blog'
            },
            {
              href: '/dashboard/article',
              label: 'Bài viết',
              active: pathname === '/dashboard/article'
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
