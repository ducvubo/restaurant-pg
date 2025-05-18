export const permissions: Module[] = [
  {
    name: 'Đơn đặt hàng',
    key: 'order',
    functions: [
      {
        name: 'Danh sách đơn đặt hàng',
        key: 'order_dish',
        description: 'Quản lý danh sách đơn đặt hàng',
        actions: defaultActions('/dashboard/order/dish'),
      },
      {
        name: 'Đơn đặt theo bàn',
        key: 'order_table',
        description: 'Quản lý đơn đặt theo bàn',
        actions: defaultActions('/dashboard/order/table'),
      },
      {
        name: 'Danh sách đặt bàn',
        key: 'book_table',
        description: 'Quản lý danh sách đặt bàn',
        actions: defaultActions('/dashboard/book-table'),
      },
      {
        name: 'Danh sách đặt món ăn',
        key: 'order_food',
        description: 'Quản lý danh sách đặt món ăn',
        actions: defaultActions('/dashboard/order-food'),
      },
      {
        name: 'Danh sách đặt combo',
        key: 'order_combo',
        description: 'Quản lý danh sách đặt combo',
        actions: defaultActions('/dashboard/order-combo'),
      },
      {
        name: 'Danh sách đặt phòng',
        key: 'book_room',
        description: 'Quản lý danh sách đặt phòng',
        actions: defaultActions('/dashboard/book-room'),
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
        actions: defaultActions('/dashboard/ticket-guest'),
      },
      {
        name: 'Tin nhắn khách hàng',
        key: 'ticket_connect',
        description: 'Xem tin nhắn từ khách hàng',
        actions: defaultActions('/dashboard/connect'),
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
        actions: defaultActions('/dashboard/rooms'),
      },
      {
        name: 'Dịch vụ',
        key: 'amenities',
        description: 'Quản lý dịch vụ đi kèm',
        actions: defaultActions('/dashboard/amenities'),
      },
      {
        name: 'Thực đơn',
        key: 'menu_items',
        description: 'Quản lý thực đơn',
        actions: defaultActions('/dashboard/menu-items'),
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
        actions: defaultActions('/dashboard/employees'),
      },
      {
        name: 'Nhãn',
        key: 'label',
        description: 'Quản lý nhãn nhân viên',
        actions: defaultActions('/dashboard/labels'),
      },
      {
        name: 'Ca làm việc',
        key: 'working_shift',
        description: 'Quản lý ca làm việc',
        actions: defaultActions('/dashboard/working-shifts'),
      },
      {
        name: 'Lịch làm việc',
        key: 'work_schedule',
        description: 'Quản lý lịch làm việc',
        actions: defaultActions('/dashboard/work-schedules'),
      },
      {
        name: 'Đơn xin nghỉ phép',
        key: 'leave_application',
        description: 'Quản lý đơn xin nghỉ phép',
        actions: defaultActions('/dashboard/leave-application'),
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
        actions: defaultActions('/dashboard/tables'),
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
        actions: defaultActions('/dashboard/dishes'),
      },
      {
        name: 'Món ăn online',
        key: 'online_dish',
        description: 'Quản lý món ăn online',
        actions: defaultActions('/dashboard/foods'),
      },
      {
        name: 'Combo món ăn',
        key: 'food_combo',
        description: 'Quản lý combo món ăn',
        actions: defaultActions('/dashboard/food-combos'),
      },
      {
        name: 'Ưu đãi',
        key: 'special_offer',
        description: 'Quản lý ưu đãi',
        actions: defaultActions('/dashboard/special-offers'),
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
        actions: defaultActions('/dashboard/guest'),
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
        actions: defaultActions('/dashboard/category-blog'),
      },
      {
        name: 'Bài viết',
        key: 'article',
        description: 'Quản lý bài viết',
        actions: defaultActions('/dashboard/article'),
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
        actions: defaultActions('/dashboard/suppliers'),
      },
      {
        name: 'Danh mục nguyên liệu',
        key: 'cat_ingredient',
        description: 'Quản lý danh mục nguyên liệu',
        actions: defaultActions('/dashboard/cat-ingredients'),
      },
      {
        name: 'Đơn vị đo',
        key: 'unit',
        description: 'Quản lý đơn vị đo',
        actions: defaultActions('/dashboard/units'),
      },
      {
        name: 'Nguyên liệu',
        key: 'ingredient',
        description: 'Quản lý nguyên liệu',
        actions: defaultActions('/dashboard/ingredients'),
      },
      {
        name: 'Nhập kho',
        key: 'stock_in',
        description: 'Quản lý nhập kho',
        actions: defaultActions('/dashboard/stock-in'),
      },
      {
        name: 'Xuất kho',
        key: 'stock_out',
        description: 'Quản lý xuất kho',
        actions: defaultActions('/dashboard/stock-out'),
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
        actions: defaultActions('/dashboard/internal-note'),
      },
      {
        name: 'Đề xuất',
        key: 'internal_proposal',
        description: 'Quản lý đề xuất nội bộ',
        actions: defaultActions('/dashboard/internal-proposal'),
      },
      {
        name: 'Bảo trì thiết bị',
        key: 'equipment_maintenance',
        description: 'Quản lý bảo trì thiết bị',
        actions: defaultActions('/dashboard/equipment-maintenance'),
      },
      {
        name: 'Tài liệu vận hành',
        key: 'operation_manual',
        description: 'Quản lý tài liệu vận hành',
        actions: defaultActions('/dashboard/operation-manual'),
      },
      {
        name: 'Chi phí vận hành',
        key: 'operational_costs',
        description: 'Quản lý chi phí vận hành',
        actions: defaultActions('/dashboard/operational-costs'),
      },
    ],
  },
];

function defaultActions(path: string): ModuleAction[] {
  return [
    { method: 'Thêm', patchRequire: [`${[path]}/add`] },
    { method: 'Sửa', patchRequire: [`${[path]}/edit`] },
    { method: 'Xóa', patchRequire: [`${[path]}/delete`] },
    { method: 'Xem chi tiết', patchRequire: [`${[path]}/detail`] },
  ];
}
