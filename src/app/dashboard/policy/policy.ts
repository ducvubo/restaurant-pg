import { Module, ModuleAction } from './policy.interface';

function defaultActions(key: string, path: string, excludeRecycle: boolean = false): ModuleAction[] {
  return [
    { method: 'Thêm', key: `${key}_create`, patchRequire: [`${path}/add`] },
    { method: 'Sửa', key: `${key}_update`, patchRequire: [`${path}/:id`] },
    { method: 'Xóa', key: `${key}_delete`, patchRequire: [`${path}/delete`] },
    {
      method: 'Xem chi tiết',
      key: `${key}_view`,
      patchRequire: [
        `${path}/detail`,
        path,
        ...(excludeRecycle ? [] : [`${path}/recycle`]),
      ],
    },
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
        actions: [
          {
            method: 'Xem danh sách',
            key: 'order_dish_view_list',
            patchRequire: ['/dashboard/order/dish']
          }, {
            method: 'Thêm hóa đơn',
            key: 'order_dish_create',
            patchRequire: []
          }, {
            method: "Cập nhật trạng thái hóa đơn",
            key: "order_dish_update_status",
            patchRequire: []
          }, {
            method: 'Gọi món',
            key: 'order_dish_call_food',
            patchRequire: []
          }, {
            method: 'Tạo QR Order',
            key: 'order_dish_create_qr',
            patchRequire: []
          }, {
            method: 'Cập nhật trạng thái món ăn',
            key: 'order_dish_update_food_status',
            patchRequire: []
          }
        ],
      },
      {
        name: 'Danh sách đặt bàn',
        key: 'book_table',
        description: 'Quản lý danh sách đặt bàn',
        actions: [
          {
            method: 'Xem danh sách',
            key: 'book_table_view_list',
            patchRequire: ['/dashboard/book-table']
          }, {
            method: 'Cập nhật trạng thái',
            key: 'book_table_update_status',
            patchRequire: []
          }
        ],
      },
      {
        name: 'Danh sách đặt món ăn',
        key: 'order_food',
        description: 'Quản lý danh sách đặt món ăn',
        actions: [
          {
            method: 'Xem danh sách',
            key: 'order_food_view_list',
            patchRequire: ['/dashboard/order-food']
          }, {
            method: 'Cập nhật trạng thái',
            key: 'order_food_update_status',
            patchRequire: []
          }
        ],
      },
      {
        name: 'Danh sách đặt combo',
        key: 'order_combo',
        description: 'Quản lý danh sách đặt combo',
        actions: [
          {
            method: 'Xem danh sách',
            key: 'order_combo_view_list',
            patchRequire: ['/dashboard/order-combo']
          }, {
            method: 'Cập nhật trạng thái',
            key: 'order_combo_update_status',
            patchRequire: []
          }
        ],
      },
      {
        name: 'Danh sách đặt phòng',
        key: 'book_room',
        description: 'Quản lý danh sách đặt phòng',
        actions: [
          {
            method: 'Xem danh sách',
            key: 'book_room_view_list',
            patchRequire: ['/dashboard/book-room']
          }, {
            method: 'Cập nhật trạng thái',
            key: 'book_room_update_status',
            patchRequire: []
          }
        ]
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
        actions: [
          {
            method: 'Xem danh sách',
            key: 'ticket_list_view_list',
            patchRequire: ['/dashboard/ticket-guest'],
          },
          {
            method: 'Xem chi tiết',
            key: 'ticket_list_view_detail',
            patchRequire: ['/dashboard/ticket-guest/view'],
          },
        ],
      },
      {
        name: 'Tin nhắn khách hàng',
        key: 'ticket_connect_list',
        description: 'Xem tin nhắn từ khách hàng',
        actions: [
          {
            method: 'Xem danh sách',
            key: 'ticket_connect_view_list',
            patchRequire: ['/dashboard/connect']
          },
        ],
      },
      {
        name: 'Chat bot khách hàng',
        key: 'chat_bot_list',
        description: 'Quản lý chat bot khách hàng',
        actions: [
          {
            method: 'Xem danh sách',
            key: 'chat_bot_view_list',
            patchRequire: ['/dashboard/chat-bot']
          },
        ],
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
        actions: [
          {
            method: "Xem danh sách",
            key: "room_list_view_list",
            patchRequire: ['/dashboard/rooms']
          }, {
            method: "Thêm phòng",
            key: "room_list_create",
            patchRequire: ['/dashboard/rooms/add']
          },
          {
            method: "Sửa phòng",
            key: "room_list_update",
            patchRequire: ['/dashboard/rooms/edit']
          }, {
            method: "Xóa phòng",
            key: "room_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "room_list_view_deleted",
            patchRequire: ['/dashboard/rooms/recycle']
          }, {
            method: "Cập nhật trạng thái",
            key: "room_list_update_status",
            patchRequire: []
          }, {
            method: "Khôi phục",
            key: "room_list_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Dịch vụ',
        key: 'amenities_list',
        description: 'Quản lý dịch vụ đi kèm',
        actions: [
          {
            method: "Xem danh sách",
            key: "amenities_list_view_list",
            patchRequire: ['/dashboard/amenities']
          }, {
            method: "Thêm phòng",
            key: "amenities_list_create",
            patchRequire: ['/dashboard/amenities/add']
          },
          {
            method: "Sửa phòng",
            key: "amenities_list_update",
            patchRequire: ['/dashboard/amenities/edit']
          }, {
            method: "Xóa phòng",
            key: "amenities_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "amenities_list_view_deleted",
            patchRequire: ['/dashboard/amenities/recycle']
          }, {
            method: "Cập nhật trạng thái",
            key: "amenities_list_update_status",
            patchRequire: []
          }, {
            method: "Khôi phục",
            key: "amenities_list_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Thực đơn',
        key: 'menu_items_list',
        description: 'Quản lý thực đơn',
        actions: [
          {
            method: "Xem danh sách",
            key: "menu_items_list_view_list",
            patchRequire: ['/dashboard/menu-items']
          },
          {
            method: "Thêm món ăn",
            key: "menu_items_list_create",
            patchRequire: ['/dashboard/menu-items/add']
          },
          {
            method: "Sửa món ăn",
            key: "menu_items_list_update",
            patchRequire: ['/dashboard/menu-items/edit']
          },
          {
            method: "Xóa món ăn",
            key: "menu_items_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "menu_items_list_view_deleted",
            patchRequire: ['/dashboard/menu-items/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "menu_items_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "menu_items_list_restore",
            patchRequire: []
          },
          {
            method: "Tải ảnh menu",
            key: "menu_items_list_upload_image_menu",
            patchRequire: []
          }
        ],
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
        actions: [
          {
            method: "Xem danh sách",
            key: "employee_list_view_list",
            patchRequire: ['/dashboard/employees']
          },
          {
            method: "Thêm nhân viên",
            key: "employee_list_create",
            patchRequire: ['/dashboard/employees/add']
          },
          {
            method: "Sửa nhân viên",
            key: "employee_list_update",
            patchRequire: ['/dashboard/employees/edit']
          },
          {
            method: "Xóa nhân viên",
            key: "employee_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "employee_list_view_deleted",
            patchRequire: ['/dashboard/employees/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "employee_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "employee_list_restore",
            patchRequire: []
          },
          {
            method: "Chấm công",
            key: "employee_list_check_in",
            patchRequire: []
          },
        ],
      },
      {
        name: 'Nhãn',
        key: 'label_list',
        description: 'Quản lý nhãn nhân viên',
        actions: [
          {
            method: "Xem danh sách",
            key: "label_list_view_list",
            patchRequire: ['/dashboard/labels']
          },
          {
            method: "Thêm nhãn",
            key: "label_list_create",
            patchRequire: ['/dashboard/labels/add']
          },
          {
            method: "Sửa nhãn",
            key: "label_list_update",
            patchRequire: ['/dashboard/labels/edit']
          },
          {
            method: "Xóa nhãn",
            key: "label_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "label_list_view_deleted",
            patchRequire: ['/dashboard/labels/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "label_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "label_list_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Ca làm việc',
        key: 'working_shift_list',
        description: 'Quản lý ca làm việc',
        actions: [
          {
            method: "Xem danh sách",
            key: "working_shift_list_view_list",
            patchRequire: ['/dashboard/working-shifts']
          },
          {
            method: "Thêm ca làm việc",
            key: "working_shift_list_create",
            patchRequire: ['/dashboard/working-shifts/add']
          },
          {
            method: "Sửa ca làm việc",
            key: "working_shift_list_update",
            patchRequire: ['/dashboard/working-shifts/edit']
          },
          {
            method: "Xóa ca làm việc",
            key: "working_shift_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "working_shift_list_view_deleted",
            patchRequire: ['/dashboard/working-shifts/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "working_shift_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "working_shift_list_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Lịch làm việc',
        key: 'work_schedule_list',
        description: 'Không cần check quyền trang này',
        actions: [
        ],
      },
      {
        name: 'Đơn xin nghỉ phép',
        key: 'leave_application',
        description: 'Không cần check quyền trang này',
        actions: [],
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
        actions: [
          {
            method: "Xem danh sách",
            key: "table_list_view_list",
            patchRequire: ['/dashboard/tables']
          },
          {
            method: "Thêm bàn ăn",
            key: "table_list_create",
            patchRequire: ['/dashboard/tables/add']
          },
          {
            method: "Sửa bàn ăn",
            key: "table_list_update",
            patchRequire: ['/dashboard/tables/edit']
          },
          {
            method: "Xóa bàn ăn",
            key: "table_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "table_list_view_deleted",
            patchRequire: ['/dashboard/tables/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "table_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "table_list_restore",
            patchRequire: []
          }, {
            method: "Đổi mã QR",
            key: "table_list_change_qr",
            patchRequire: []
          },
          {
            method: "Tải mã QR",
            key: "table_list_download_qr",
            patchRequire: []
          }
        ],
      },
    ],
  },
  {
    name: 'Món ăn',
    key: 'dish_list',
    functions: [
      {
        name: 'Món ăn',
        key: 'dish_list',
        description: 'Quản lý món ăn',
        actions: [
          {
            method: "Xem danh sách",
            key: "dish_list_view_list",
            patchRequire: ['/dashboard/dishes']
          },
          {
            method: "Thêm món ăn",
            key: "dish_list_create",
            patchRequire: ['/dashboard/dishes/add']
          },
          {
            method: "Sửa món ăn",
            key: "dish_list_update",
            patchRequire: ['/dashboard/dishes/edit']
          },
          {
            method: "Xóa món ăn",
            key: "dish_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "dish_list_view_deleted",
            patchRequire: ['/dashboard/dishes/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "dish_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "dish_list_restore",
            patchRequire: []
          },
          {
            method: "Tải ảnh món ăn",
            key: "dish_list_upload_image",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Món ăn online',
        key: 'online_dish',
        description: 'Quản lý món ăn online',
        actions: [
          {
            method: "Xem danh sách",
            key: "online_dish_view_list",
            patchRequire: ['/dashboard/foods']
          },
          {
            method: "Thêm món ăn online",
            key: "online_dish_create",
            patchRequire: ['/dashboard/foods/add']
          },
          {
            method: "Sửa món ăn online",
            key: "online_dish_update",
            patchRequire: ['/dashboard/foods/edit']
          },
          {
            method: "Xóa món ăn online",
            key: "online_dish_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "online_dish_view_deleted",
            patchRequire: ['/dashboard/foods/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "online_dish_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "online_dish_restore",
            patchRequire: []
          },
          {
            method: "Tải ảnh món ăn online",
            key: "online_dish_upload_image",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Combo món ăn',
        key: 'food_combo',
        description: 'Quản lý combo món ăn',
        actions: [
          {
            method: "Xem danh sách",
            key: "food_combo_view_list",
            patchRequire: ['/dashboard/food-combos']
          },
          {
            method: "Thêm combo món ăn",
            key: "food_combo_create",
            patchRequire: ['/dashboard/food-combos/add']
          },
          {
            method: "Sửa combo món ăn",
            key: "food_combo_update",
            patchRequire: ['/dashboard/food-combos/edit']
          },
          {
            method: "Xóa combo món ăn",
            key: "food_combo_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "food_combo_view_deleted",
            patchRequire: ['/dashboard/food-combos/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "food_combo_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "food_combo_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Ưu đãi',
        key: 'special_offer',
        description: 'Quản lý ưu đãi',
        actions: [
          {
            method: "Xem danh sách",
            key: "special_offer_view_list",
            patchRequire: ['/dashboard/special-offers']
          },
          {
            method: "Thêm ưu đãi",
            key: "special_offer_create",
            patchRequire: ['/dashboard/special-offers/add']
          },
          {
            method: "Sửa ưu đãi",
            key: "special_offer_update",
            patchRequire: ['/dashboard/special-offers/edit']
          },
          {
            method: "Xóa ưu đãi",
            key: "special_offer_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "special_offer_view_deleted",
            patchRequire: ['/dashboard/special-offers/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "special_offer_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "special_offer_restore",
            patchRequire: []
          }
        ],
      },
    ],
  },
  {
    name: 'Khách hàng',
    key: 'guest_list',
    functions: [
      {
        name: 'Khách hàng',
        key: 'guest_list',
        description: 'Quản lý khách hàng',
        actions: [
          {
            method: "Xem danh sách",
            key: "guest_list_view_list",
            patchRequire: ['/dashboard/guest']
          },
        ],
      },
    ],
  },
  {
    name: 'Blog',
    key: 'blog_list',
    functions: [
      {
        name: 'Danh mục blog',
        key: 'category_blog',
        description: 'Quản lý danh mục blog',
        actions: [
          {
            method: "Xem danh sách",
            key: "category_blog_view_list",
            patchRequire: ['/dashboard/category-blog']
          },
          {
            method: "Thêm danh mục blog",
            key: "category_blog_create",
            patchRequire: ['/dashboard/category-blog/add']
          },
          {
            method: "Sửa danh mục blog",
            key: "category_blog_update",
            patchRequire: ['/dashboard/category-blog/edit']
          },
          {
            method: "Xóa danh mục blog",
            key: "category_blog_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "category_blog_view_deleted",
            patchRequire: ['/dashboard/category-blog/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "category_blog_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "category_blog_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Bài viết',
        key: 'article',
        description: 'Quản lý bài viết',
        actions: [
          {
            method: "Xem danh sách",
            key: "article_view_list",
            patchRequire: ['/dashboard/article']
          },
          {
            method: "Thêm bài viết",
            key: "article_create",
            patchRequire: ['/dashboard/article/add']
          },
          {
            method: "Sửa bài viết",
            key: "article_update",
            patchRequire: ['/dashboard/article/edit']
          },
          {
            method: "Duyệt bài",
            key: "article_approve",
            patchRequire: []
          },
          {
            method: "Xuất bản",
            key: "article_publish",
            patchRequire: []
          },
          {
            method: "Xóa bài viết",
            key: "article_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "article_view_deleted",
            patchRequire: ['/dashboard/article/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "article_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "article_restore",
            patchRequire: []
          }
        ],
      },
    ],
  },
  {
    name: 'Kho',
    key: 'warehouse',
    functions: [
      {
        name: 'Nhà cung cấp',
        key: 'supplier_list',
        description: 'Quản lý nhà cung cấp',
        actions: [
          {
            method: "Xem danh sách",
            key: "supplier_view_list",
            patchRequire: ['/dashboard/suppliers']
          },
          {
            method: "Thêm nhà cung cấp",
            key: "supplier_create",
            patchRequire: ['/dashboard/suppliers/add']
          },
          {
            method: "Sửa nhà cung cấp",
            key: "supplier_update",
            patchRequire: ['/dashboard/suppliers/edit']
          },
          {
            method: "Xóa nhà cung cấp",
            key: "supplier_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "supplier_view_deleted",
            patchRequire: ['/dashboard/suppliers/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "supplier_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "supplier_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Danh mục nguyên liệu',
        key: 'cat_ingredient_list',
        description: 'Quản lý danh mục nguyên liệu',
        actions: [
          {
            method: "Xem danh sách",
            key: "cat_ingredient_view_list",
            patchRequire: ['/dashboard/cat-ingredients']
          },
          {
            method: "Thêm danh mục nguyên liệu",
            key: "cat_ingredient_create",
            patchRequire: ['/dashboard/cat-ingredients/add']
          },
          {
            method: "Sửa danh mục nguyên liệu",
            key: "cat_ingredient_update",
            patchRequire: ['/dashboard/cat-ingredients/edit']
          },
          {
            method: "Xóa danh mục nguyên liệu",
            key: "cat_ingredient_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "cat_ingredient_view_deleted",
            patchRequire: ['/dashboard/cat-ingredients/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "cat_ingredient_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "cat_ingredient_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Đơn vị đo',
        key: 'unit_list',
        description: 'Quản lý đơn vị đo',
        actions: [
          {
            method: "Xem danh sách",
            key: "unit_view_list",
            patchRequire: ['/dashboard/units']
          },
          {
            method: "Thêm đơn vị đo",
            key: "unit_create",
            patchRequire: ['/dashboard/units/add']
          },
          {
            method: "Sửa đơn vị đo",
            key: "unit_update",
            patchRequire: ['/dashboard/units/edit']
          },
          {
            method: "Xóa đơn vị đo",
            key: "unit_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "unit_view_deleted",
            patchRequire: ['/dashboard/units/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "unit_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "unit_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Nguyên liệu',
        key: 'ingredient_list',
        description: 'Quản lý nguyên liệu',
        actions: [
          {
            method: "Xem danh sách",
            key: "ingredient_view_list",
            patchRequire: ['/dashboard/ingredients']
          },
          {
            method: "Thêm nguyên liệu",
            key: "ingredient_create",
            patchRequire: ['/dashboard/ingredients/add']
          },
          {
            method: "Sửa nguyên liệu",
            key: "ingredient_update",
            patchRequire: ['/dashboard/ingredients/edit'],
          },
          {
            method: "Xóa nguyên liệu",
            key: "ingredient_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "ingredient_view_deleted",
            patchRequire: ['/dashboard/ingredients/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "ingredient_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "ingredient_restore",
            patchRequire: []
          },
        ],
      },
      {
        name: 'Nhập kho',
        key: 'stock_in_list',
        description: 'Quản lý nhập kho',
        actions: [
          {
            method: "Xem danh sách",
            key: "stock_in_view_list",
            patchRequire: ['/dashboard/stock-in']
          },
          {
            method: "Thêm nhập kho",
            key: "stock_in_create",
            patchRequire: ['/dashboard/stock-in/add']
          },
          {
            method: "Sửa nhập kho",
            key: "stock_in_update",
            patchRequire: ['/dashboard/stock-in/edit'],
          },
          {
            method: "Xóa nhập kho",
            key: "stock_in_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "stock_in_view_deleted",
            patchRequire: ['/dashboard/stock-in/recycle']
          },
          {
            method: "Khôi phục",
            key: "stock_in_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Xuất kho',
        key: 'stock_out_list',
        description: 'Quản lý xuất kho',
        actions: [
          {
            method: "Xem danh sách",
            key: "stock_out_view_list",
            patchRequire: ['/dashboard/stock-out']
          },
          {
            method: "Thêm xuất kho",
            key: "stock_out_create",
            patchRequire: ['/dashboard/stock-out/add']
          },
          {
            method: "Sửa xuất kho",
            key: "stock_out_update",
            patchRequire: ['/dashboard/stock-out/edit'],
          },
          {
            method: "Xóa xuất kho",
            key: "stock_out_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "stock_out_view_deleted",
            patchRequire: ['/dashboard/stock-out/recycle']
          },
          {
            method: "Khôi phục",
            key: "stock_out_restore",
            patchRequire: []
          }
        ],
      },
    ],
  },
  {
    name: 'Nội bộ',
    key: 'internal_list',
    functions: [
      {
        name: 'Ghi chú',
        key: 'internal_note',
        description: 'Quản lý ghi chú nội bộ',
        actions: [
          {
            method: "Xem danh sách",
            key: "internal_note_view_list",
            patchRequire: ['/dashboard/internal-note']
          },
          {
            method: "Thêm ghi chú",
            key: "internal_note_create",
            patchRequire: ['/dashboard/internal-note/add']
          },
          {
            method: "Sửa ghi chú",
            key: "internal_note_update",
            patchRequire: ['/dashboard/internal-note/edit'],
          },
          {
            method: "Xóa ghi chú",
            key: "internal_note_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "internal_note_view_deleted",
            patchRequire: ['/dashboard/internal-note/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "internal_note_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "internal_note_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Đề xuất',
        key: 'internal_proposal_list',
        description: 'Quản lý đề xuất nội bộ',
        actions: [
          {
            method: "Xem danh sách",
            key: "internal_proposal_view_list",
            patchRequire: ['/dashboard/internal-proposal']
          },
          {
            method: "Thêm đề xuất",
            key: "internal_proposal_create",
            patchRequire: ['/dashboard/internal-proposal/add']
          },
          {
            method: "Sửa đề xuất",
            key: "internal_proposal_update",
            patchRequire: ['/dashboard/internal-proposal/edit']
          },
          {
            method: "Xóa đề xuất",
            key: "internal_proposal_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "internal_proposal_view_deleted",
            patchRequire: ['/dashboard/internal-proposal/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "internal_proposal_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "internal_proposal_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Bảo trì thiết bị',
        key: 'equipment_maintenance_list',
        description: 'Quản lý bảo trì thiết bị',
        actions: [
          {
            method: "Xem danh sách",
            key: "equipment_maintenance_view_list",
            patchRequire: ['/dashboard/equipment-maintenance']
          },
          {
            method: "Thêm bảo trì thiết bị",
            key: "equipment_maintenance_create",
            patchRequire: ['/dashboard/equipment-maintenance/add']
          },
          {
            method: "Sửa bảo trì thiết bị",
            key: "equipment_maintenance_update",
            patchRequire: ['/dashboard/equipment-maintenance/edit']
          },
          {
            method: "Xóa bảo trì thiết bị",
            key: "equipment_maintenance_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "equipment_maintenance_view_deleted",
            patchRequire: ['/dashboard/equipment-maintenance/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "equipment_maintenance_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "equipment_maintenance_restore",
            patchRequire: []
          }
        ],
      },
      {
        name: 'Tài liệu vận hành',
        key: 'operation_manual_list',
        description: 'Quản lý tài liệu vận hành',
        actions: [
          {
            method: "Xem danh sách",
            key: "operation_manual_view_list",
            patchRequire: ['/dashboard/operation-manual']
          },
          {
            method: "Thêm tài liệu vận hành",
            key: "operation_manual_create",
            patchRequire: ['/dashboard/operation-manual/add']
          },
          {
            method: "Sửa tài liệu vận hành",
            key: "operation_manual_update",
            patchRequire: ['/dashboard/operation-manual/edit']
          },
          {
            method: "Xóa tài liệu vận hành",
            key: "operation_manual_delete",
            patchRequire: [],
          },
          {
            method: "Xem danh sách đã xóa",
            key: "operation_manual_view_deleted",
            patchRequire: ['/dashboard/operation-manual/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "operation_manual_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "operation_manual_restore",
            patchRequire: []
          },
        ],
      },
      {
        name: 'Chi phí vận hành',
        key: 'operational_costs_list',
        description: 'Quản lý chi phí vận hành',
        actions: [
          {
            method: "Xem danh sách",
            key: "operational_costs_view_list",
            patchRequire: ['/dashboard/operational-costs']
          },
          {
            method: "Thêm chi phí vận hành",
            key: "operational_costs_create",
            patchRequire: ['/dashboard/operational-costs/add']
          },
          {
            method: "Sửa chi phí vận hành",
            key: "operational_costs_update",
            patchRequire: ['/dashboard/operational-costs/edit']
          },
          {
            method: "Xóa chi phí vận hành",
            key: "operational_costs_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "operational_costs_view_deleted",
            patchRequire: ['/dashboard/operational-costs/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "operational_costs_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "operational_costs_restore",
            patchRequire: []
          }
        ],
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
        actions: [
          {
            method: "Xem danh sách",
            key: "policy_list_view_list",
            patchRequire: ['/dashboard/policy']
          },
          {
            method: "Thêm quyền chức năng",
            key: "policy_list_create",
            patchRequire: ['/dashboard/policy/add']
          },
          {
            method: "Sửa quyền chức năng",
            key: "policy_list_update",
            patchRequire: ['/dashboard/policy/edit']
          },
          {
            method: "Xóa quyền chức năng",
            key: "policy_list_delete",
            patchRequire: []
          },
          {
            method: "Xem danh sách đã xóa",
            key: "policy_list_view_deleted",
            patchRequire: ['/dashboard/policy/recycle']
          },
          {
            method: "Cập nhật trạng thái",
            key: "policy_list_update_status",
            patchRequire: []
          },
          {
            method: "Khôi phục",
            key: "policy_list_restore",
            patchRequire: []
          }
        ],
      },
    ],
  },
];