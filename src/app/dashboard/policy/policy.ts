// import { Module, ModuleAction } from "./policy.interface";

// export const permissions: Module[] = [
//   {
//     name: 'Đơn đặt hàng',
//     key: 'order',
//     functions: [
//       {
//         name: 'Danh sách đơn đặt hàng',
//         key: 'order_dish',
//         description: 'Quản lý danh sách đơn đặt hàng',
//         actions: defaultActions('order_dish', '/dashboard/order/dish'),
//       },
//       {
//         name: 'Đơn đặt theo bàn',
//         key: 'order_table',
//         description: 'Quản lý đơn đặt theo bàn',
//         actions: defaultActions('order_table', '/dashboard/order/table'),
//       },
//       {
//         name: 'Danh sách đặt bàn',
//         key: 'book_table',
//         description: 'Quản lý danh sách đặt bàn',
//         actions: defaultActions('book_table', '/dashboard/book-table'),
//       },
//       {
//         name: 'Danh sách đặt món ăn',
//         key: 'order_food',
//         description: 'Quản lý danh sách đặt món ăn',
//         actions: defaultActions('order_food', '/dashboard/order-food'),
//       },
//       {
//         name: 'Danh sách đặt combo',
//         key: 'order_combo',
//         description: 'Quản lý danh sách đặt combo',
//         actions: defaultActions('order_combo', '/dashboard/order-combo'),
//       },
//       {
//         name: 'Danh sách đặt phòng',
//         key: 'book_room',
//         description: 'Quản lý danh sách đặt phòng',
//         actions: defaultActions('book_room', '/dashboard/book-room'),
//       },
//     ],
//   },
//   {
//     name: 'Quản lý hỗ trợ',
//     key: 'ticket_guest',
//     functions: [
//       {
//         name: 'Danh sách hỏi đáp',
//         key: 'ticket_list',
//         description: 'Quản lý hỏi đáp từ khách hàng',
//         actions: defaultActions('ticket_list', '/dashboard/ticket-guest'),
//       },
//       {
//         name: 'Tin nhắn khách hàng',
//         key: 'ticket_connect',
//         description: 'Xem tin nhắn từ khách hàng',
//         actions: defaultActions('ticket_connect', '/dashboard/connect'),
//       },
//     ],
//   },
//   {
//     name: 'Phòng/Sảnh',
//     key: 'rooms',
//     functions: [
//       {
//         name: 'Phòng/Sảnh',
//         key: 'room_list',
//         description: 'Quản lý phòng/sảnh',
//         actions: defaultActions('room_list', '/dashboard/rooms'),
//       },
//       {
//         name: 'Dịch vụ',
//         key: 'amenities',
//         description: 'Quản lý dịch vụ đi kèm',
//         actions: defaultActions('amenities', '/dashboard/amenities'),
//       },
//       {
//         name: 'Thực đơn',
//         key: 'menu_items',
//         description: 'Quản lý thực đơn',
//         actions: defaultActions('menu_items', '/dashboard/menu-items'),
//       },
//     ],
//   },
//   {
//     name: 'Nhân viên',
//     key: 'employees',
//     functions: [
//       {
//         name: 'Nhân viên',
//         key: 'employee_list',
//         description: 'Quản lý nhân viên',
//         actions: defaultActions('employee_list', '/dashboard/employees'),
//       },
//       {
//         name: 'Nhãn',
//         key: 'label',
//         description: 'Quản lý nhãn nhân viên',
//         actions: defaultActions('label', '/dashboard/labels'),
//       },
//       {
//         name: 'Ca làm việc',
//         key: 'working_shift',
//         description: 'Quản lý ca làm việc',
//         actions: defaultActions('working_shift', '/dashboard/working-shifts'),
//       },
//       {
//         name: 'Lịch làm việc',
//         key: 'work_schedule',
//         description: 'Quản lý lịch làm việc',
//         actions: defaultActions('work_schedule', '/dashboard/work-schedules'),
//       },
//       {
//         name: 'Đơn xin nghỉ phép',
//         key: 'leave_application',
//         description: 'Quản lý đơn xin nghỉ phép',
//         actions: defaultActions('leave_application', '/dashboard/leave-application'),
//       },
//     ],
//   },
//   {
//     name: 'Bàn ăn',
//     key: 'tables',
//     functions: [
//       {
//         name: 'Bàn ăn',
//         key: 'table_list',
//         description: 'Quản lý bàn ăn',
//         actions: defaultActions('table_list', '/dashboard/tables'),
//       },
//     ],
//   },
//   {
//     name: 'Món ăn',
//     key: 'dishes',
//     functions: [
//       {
//         name: 'Món ăn',
//         key: 'dish_list',
//         description: 'Quản lý món ăn',
//         actions: defaultActions('dish_list', '/dashboard/dishes'),
//       },
//       {
//         name: 'Món ăn online',
//         key: 'online_dish',
//         description: 'Quản lý món ăn online',
//         actions: defaultActions('online_dish', '/dashboard/foods'),
//       },
//       {
//         name: 'Combo món ăn',
//         key: 'food_combo',
//         description: 'Quản lý combo món ăn',
//         actions: defaultActions('food_combo', '/dashboard/food-combos'),
//       },
//       {
//         name: 'Ưu đãi',
//         key: 'special_offer',
//         description: 'Quản lý ưu đãi',
//         actions: defaultActions('special_offer', '/dashboard/special-offers'),
//       },
//     ],
//   },
//   {
//     name: 'Khách hàng',
//     key: 'guest',
//     functions: [
//       {
//         name: 'Khách hàng',
//         key: 'guest_list',
//         description: 'Quản lý khách hàng',
//         actions: defaultActions('guest_list', '/dashboard/guest'),
//       },
//     ],
//   },
//   {
//     name: 'Blog',
//     key: 'blog',
//     functions: [
//       {
//         name: 'Danh mục blog',
//         key: 'category_blog',
//         description: 'Quản lý danh mục blog',
//         actions: defaultActions('category_blog', '/dashboard/category-blog'),
//       },
//       {
//         name: 'Bài viết',
//         key: 'article',
//         description: 'Quản lý bài viết',
//         actions: defaultActions('article', '/dashboard/article'),
//       },
//     ],
//   },
//   {
//     name: 'Kho',
//     key: 'warehouse',
//     functions: [
//       {
//         name: 'Nhà cung cấp',
//         key: 'supplier',
//         description: 'Quản lý nhà cung cấp',
//         actions: defaultActions('supplier', '/dashboard/suppliers'),
//       },
//       {
//         name: 'Danh mục nguyên liệu',
//         key: 'cat_ingredient',
//         description: 'Quản lý danh mục nguyên liệu',
//         actions: defaultActions('cat_ingredient', '/dashboard/cat-ingredients'),
//       },
//       {
//         name: 'Đơn vị đo',
//         key: 'unit',
//         description: 'Quản lý đơn vị đo',
//         actions: defaultActions('unit', '/dashboard/units'),
//       },
//       {
//         name: 'Nguyên liệu',
//         key: 'ingredient',
//         description: 'Quản lý nguyên liệu',
//         actions: defaultActions('ingredient', '/dashboard/ingredients'),
//       },
//       {
//         name: 'Nhập kho',
//         key: 'stock_in',
//         description: 'Quản lý nhập kho',
//         actions: defaultActions('stock_in', '/dashboard/stock-in'),
//       },
//       {
//         name: 'Xuất kho',
//         key: 'stock_out',
//         description: 'Quản lý xuất kho',
//         actions: defaultActions('stock_out', '/dashboard/stock-out'),
//       },
//     ],
//   },
//   {
//     name: 'Nội bộ',
//     key: 'internal',
//     functions: [
//       {
//         name: 'Ghi chú',
//         key: 'internal_note',
//         description: 'Quản lý ghi chú nội bộ',
//         actions: defaultActions('internal_note', '/dashboard/internal-note'),
//       },
//       {
//         name: 'Đề xuất',
//         key: 'internal_proposal',
//         description: 'Quản lý đề xuất nội bộ',
//         actions: defaultActions('internal_proposal', '/dashboard/internal-proposal'),
//       },
//       {
//         name: 'Bảo trì thiết bị',
//         key: 'equipment_maintenance',
//         description: 'Quản lý bảo trì thiết bị',
//         actions: defaultActions('equipment_maintenance', '/dashboard/equipment-maintenance'),
//       },
//       {
//         name: 'Tài liệu vận hành',
//         key: 'operation_manual',
//         description: 'Quản lý tài liệu vận hành',
//         actions: defaultActions('operation_manual', '/dashboard/operation-manual'),
//       },
//       {
//         name: 'Chi phí vận hành',
//         key: 'operational_costs',
//         description: 'Quản lý chi phí vận hành',
//         actions: defaultActions('operational_costs', '/dashboard/operational-costs'),
//       },
//     ],
//   },
// ];

// function defaultActions(key: string, path: string): ModuleAction[] {
//   return [
//     { method: 'Thêm', key: `${key}_create`, patchRequire: [`${path}/add`] },
//     { method: 'Sửa', key: `${key}_update`, patchRequire: [`${path}/edit`] },
//     { method: 'Xóa', key: `${key}_delete`, patchRequire: [`${path}/delete`] },
//     { method: 'Xem chi tiết', key: `${key}_view`, patchRequire: [`${path}/detail`] },
//   ];
// }


import { Module, ModuleAction } from './policy.interface';

function defaultActions(key: string, path: string): ModuleAction[] {
  return [
    { method: 'Thêm', key: `${key}_create`, patchRequire: [`${path}/add`] },
    { method: 'Sửa', key: `${key}_update`, patchRequire: [`${path}/edit`] },
    { method: 'Xóa', key: `${key}_delete`, patchRequire: [`${path}/delete`] },
    { method: 'Xem chi tiết', key: `${key}_view`, patchRequire: [`${path}/detail`, path] },
  ];
}

export const permissions: Module[] = [
  {
    name: 'Đơn đặt hàng',
    key: 'order',
    functions: [
      {
        name: 'Danh sách đơn đặt hàng',
        key: 'order_dish',
        description: 'Quản lý danh sách đơn đặt hàng',
        actions: defaultActions('order_dish', '/dashboard/order/dish'),
      },
      {
        name: 'Đơn đặt theo bàn',
        key: 'order_table',
        description: 'Quản lý đơn đặt theo bàn',
        actions: defaultActions('order_table', '/dashboard/order/table'),
      },
      {
        name: 'Danh sách đặt bàn',
        key: 'book_table',
        description: 'Quản lý danh sách đặt bàn',
        actions: defaultActions('book_table', '/dashboard/book-table'),
      },
      {
        name: 'Danh sách đặt món ăn',
        key: 'order_food',
        description: 'Quản lý danh sách đặt món ăn',
        actions: defaultActions('order_food', '/dashboard/order-food'),
      },
      {
        name: 'Danh sách đặt combo',
        key: 'order_combo',
        description: 'Quản lý danh sách đặt combo',
        actions: defaultActions('order_combo', '/dashboard/order-combo'),
      },
      {
        name: 'Danh sách đặt phòng',
        key: 'book_room',
        description: 'Quản lý danh sách đặt phòng',
        actions: defaultActions('book_room', '/dashboard/book-room'),
      },
    ],
  },
  {
    name: 'Quản lý hỗ trợ',
    key: 'ticket_guest',
    functions: [
      {
        name: 'Danh sách hỏi đáp',
        key: 'ticket_list',
        description: 'Quản lý hỏi đáp từ khách hàng',
        actions: defaultActions('ticket_list', '/dashboard/ticket-guest'),
      },
      {
        name: 'Tin nhắn khách hàng',
        key: 'ticket_connect',
        description: 'Xem tin nhắn từ khách hàng',
        actions: defaultActions('ticket_connect', '/dashboard/connect'),
      },
      {
        name: 'Chat bot khách hàng',
        key: 'chat_bot',
        description: 'Quản lý chat bot khách hàng',
        actions: defaultActions('chat_bot', '/dashboard/chat-bot'),
      },
    ],
  },
  {
    name: 'Phòng/Sảnh',
    key: 'rooms',
    functions: [
      {
        name: 'Phòng/Sảnh',
        key: 'room_list',
        description: 'Quản lý phòng/sảnh',
        actions: defaultActions('room_list', '/dashboard/rooms'),
      },
      {
        name: 'Dịch vụ',
        key: 'amenities',
        description: 'Quản lý dịch vụ đi kèm',
        actions: defaultActions('amenities', '/dashboard/amenities'),
      },
      {
        name: 'Thực đơn',
        key: 'menu_items',
        description: 'Quản lý thực đơn',
        actions: defaultActions('menu_items', '/dashboard/menu-items'),
      },
    ],
  },
  {
    name: 'Nhân viên',
    key: 'employees',
    functions: [
      {
        name: 'Nhân viên',
        key: 'employee_list',
        description: 'Quản lý nhân viên',
        actions: defaultActions('employee_list', '/dashboard/employees'),
      },
      {
        name: 'Nhãn',
        key: 'label',
        description: 'Quản lý nhãn nhân viên',
        actions: defaultActions('label', '/dashboard/labels'),
      },
      {
        name: 'Ca làm việc',
        key: 'working_shift',
        description: 'Quản lý ca làm việc',
        actions: defaultActions('working_shift', '/dashboard/working-shifts'),
      },
      {
        name: 'Lịch làm việc',
        key: 'work_schedule',
        description: 'Quản lý lịch làm việc',
        actions: defaultActions('work_schedule', '/dashboard/work-schedules'),
      },
      {
        name: 'Đơn xin nghỉ phép',
        key: 'leave_application',
        description: 'Quản lý đơn xin nghỉ phép',
        actions: defaultActions('leave_application', '/dashboard/leave-application'),
      },
    ],
  },
  {
    name: 'Bàn ăn',
    key: 'tables',
    functions: [
      {
        name: 'Bàn ăn',
        key: 'table_list',
        description: 'Quản lý bàn ăn',
        actions: defaultActions('table_list', '/dashboard/tables'),
      },
    ],
  },
  {
    name: 'Món ăn',
    key: 'dishes',
    functions: [
      {
        name: 'Món ăn',
        key: 'dish_list',
        description: 'Quản lý món ăn',
        actions: defaultActions('dish_list', '/dashboard/dishes'),
      },
      {
        name: 'Món ăn online',
        key: 'online_dish',
        description: 'Quản lý món ăn online',
        actions: defaultActions('online_dish', '/dashboard/foods'),
      },
      {
        name: 'Combo món ăn',
        key: 'food_combo',
        description: 'Quản lý combo món ăn',
        actions: defaultActions('food_combo', '/dashboard/food-combos'),
      },
      {
        name: 'Ưu đãi',
        key: 'special_offer',
        description: 'Quản lý ưu đãi',
        actions: defaultActions('special_offer', '/dashboard/special-offers'),
      },
    ],
  },
  {
    name: 'Khách hàng',
    key: 'guest',
    functions: [
      {
        name: 'Khách hàng',
        key: 'guest_list',
        description: 'Quản lý khách hàng',
        actions: defaultActions('guest_list', '/dashboard/guest'),
      },
    ],
  },
  {
    name: 'Blog',
    key: 'blog',
    functions: [
      {
        name: 'Danh mục blog',
        key: 'category_blog',
        description: 'Quản lý danh mục blog',
        actions: defaultActions('category_blog', '/dashboard/category-blog'),
      },
      {
        name: 'Bài viết',
        key: 'article',
        description: 'Quản lý bài viết',
        actions: defaultActions('article', '/dashboard/article'),
      },
    ],
  },
  {
    name: 'Kho',
    key: 'warehouse',
    functions: [
      {
        name: 'Nhà cung cấp',
        key: 'supplier',
        description: 'Quản lý nhà cung cấp',
        actions: defaultActions('supplier', '/dashboard/suppliers'),
      },
      {
        name: 'Danh mục nguyên liệu',
        key: 'cat_ingredient',
        description: 'Quản lý danh mục nguyên liệu',
        actions: defaultActions('cat_ingredient', '/dashboard/cat-ingredients'),
      },
      {
        name: 'Đơn vị đo',
        key: 'unit',
        description: 'Quản lý đơn vị đo',
        actions: defaultActions('unit', '/dashboard/units'),
      },
      {
        name: 'Nguyên liệu',
        key: 'ingredient',
        description: 'Quản lý nguyên liệu',
        actions: defaultActions('ingredient', '/dashboard/ingredients'),
      },
      {
        name: 'Nhập kho',
        key: 'stock_in',
        description: 'Quản lý nhập kho',
        actions: defaultActions('stock_in', '/dashboard/stock-in'),
      },
      {
        name: 'Xuất kho',
        key: 'stock_out',
        description: 'Quản lý xuất kho',
        actions: defaultActions('stock_out', '/dashboard/stock-out'),
      },
    ],
  },
  {
    name: 'Nội bộ',
    key: 'internal',
    functions: [
      {
        name: 'Ghi chú',
        key: 'internal_note',
        description: 'Quản lý ghi chú nội bộ',
        actions: defaultActions('internal_note', '/dashboard/internal-note'),
      },
      {
        name: 'Đề xuất',
        key: 'internal_proposal',
        description: 'Quản lý đề xuất nội bộ',
        actions: defaultActions('internal_proposal', '/dashboard/internal-proposal'),
      },
      {
        name: 'Bảo trì thiết bị',
        key: 'equipment_maintenance',
        description: 'Quản lý bảo trì thiết bị',
        actions: defaultActions('equipment_maintenance', '/dashboard/equipment-maintenance'),
      },
      {
        name: 'Tài liệu vận hành',
        key: 'operation_manual',
        description: 'Quản lý tài liệu vận hành',
        actions: defaultActions('operation_manual', '/dashboard/operation-manual'),
      },
      {
        name: 'Chi phí vận hành',
        key: 'operational_costs',
        description: 'Quản lý chi phí vận hành',
        actions: defaultActions('operational_costs', '/dashboard/operational-costs'),
      },
    ],
  },
  {
    name: 'Phân quyền',
    key: 'policy',
    functions: [
      {
        name: 'Quyền chức năng',
        key: 'policy_list',
        description: 'Quản lý quyền chức năng',
        actions: defaultActions('policy_list', '/dashboard/policy'),
      },
      {
        name: 'Phân quyền',
        key: 'assign_policy',
        description: 'Quản lý phân quyền',
        actions: defaultActions('assign_policy', '/dashboard/assign-policy'),
      },
    ],
  },
];