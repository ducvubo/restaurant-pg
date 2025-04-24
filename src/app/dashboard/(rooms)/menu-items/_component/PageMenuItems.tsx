'use client';
import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePathname, useRouter } from 'next/navigation';
import { DataTableViewOptions } from '@/components/ColumnToggle';
import { DataTablePagination } from '@/components/PaginationTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext';
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { useEffect, useState, ChangeEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon } from '@radix-ui/react-icons';
import { getAllMenuItemsName, createMenuItems } from '../menu-items.api';
import { IMenuItems } from '../menu-items.interface';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: {
    current: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
}

export function PageMenuItems<TData, TValue>({ columns, data, meta }: DataTableProps<TData, TValue>) {
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname().split('/').pop();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = useState(meta.current);
  const [pageSize, setPageSize] = useState(meta.pageSize);
  const [newMenuItems, setNewMenuItems] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: boolean } }>({});

  // Lấy danh sách menu items
  const getListMenuItems = async () => {
    const res: IBackendRes<IMenuItems[]> = await getAllMenuItemsName();
    if (res.statusCode === 200 && res.data) {
      return res.data;
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive',
      });
      await deleteCookiesAndRedirect();
      return [];
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive',
      });
      return [];
    } else {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Xử lý import menu từ ảnh
  const handleImportMenu = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng chọn một file ảnh để import',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER_BOOK}/menu-items/import-menu-image`, {
        method: 'POST',
        body: formData,
        headers: {
          accept: '*/*',
        },
      });

      const result: IBackendRes<IMenuItems[]> = await response.json();

      if (result.statusCode === 201 && result.data) {
        const listMenuItems = await getListMenuItems();
        const newMenuItemsArray: any[] = [];
        result.data.forEach((item: IMenuItems) => {
          const exists = listMenuItems.some(
            (existingItem) => existingItem.mitems_name?.toLowerCase() === item.mitems_name?.toLowerCase()
          );
          if (!exists) {
            newMenuItemsArray.push({
              mitems_name: item.mitems_name || '-',
              mitems_price: item.mitems_price || 0,
              mitems_note: item.mitems_note || '-',
              mitems_description: item.mitems_description || '-',
              mitems_image: JSON.stringify({
                image_cloud: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
                image_custom: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
              }),
              mitems_status: 'enable',
            });
          }
        });

        if (newMenuItemsArray.length > 0) {
          setNewMenuItems(newMenuItemsArray);
          setIsDialogOpen(true);
        }

        toast({
          title: 'Thành công',
          description: `Đã bóc tách được ${result.data.length} món, trong đó có ${newMenuItemsArray.length} món mới`,
        });
      } else {
        toast({
          title: 'Thất bại',
          description: result.message || 'Đã có lỗi xảy ra khi import thực đơn',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  // Xử lý thay đổi input trong dialog
  const handleInputChange = (index: number, field: string, value: string | number) => {
    setNewMenuItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      if (!updatedErrors[index]) updatedErrors[index] = {};
      updatedErrors[index][field] = !value || value.toString().trim() === '';
      return updatedErrors;
    });
  };

  const handleDeleteMenuItem = (index: number) => {
    setNewMenuItems((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[index];
      const newErrors: { [key: number]: { [key: string]: boolean } } = {};
      Object.keys(updatedErrors).forEach((key) => {
        const oldIndex = Number(key);
        if (oldIndex > index) {
          newErrors[oldIndex - 1] = updatedErrors[oldIndex];
        } else if (oldIndex < index) {
          newErrors[oldIndex] = updatedErrors[oldIndex];
        }
      });
      return newErrors;
    });
  };

  const createNewMenuItem = async (item: Partial<IMenuItems>) => {
    const res: IBackendRes<IMenuItems> = await createMenuItems(item);
    if (res.statusCode === 201 || res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Thêm món ăn mới thành công',
        variant: 'default',
      });
    } else if (res.statusCode === 400) {
      if (Array.isArray(res.message)) {
        res.message.forEach((msg: string) => {
          toast({
            title: 'Thất bại',
            description: msg,
            variant: 'destructive',
          });
        });
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive',
        });
      }
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive',
      });
      await deleteCookiesAndRedirect();
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    const validationErrors: { [key: number]: { [key: string]: boolean } } = {};
    let hasError = false;

    newMenuItems.forEach((item, index) => {
      const itemErrors: { [key: string]: boolean } = {};
      if (!item.mitems_name || item.mitems_name.trim() === '') {
        itemErrors.mitems_name = true;
        hasError = true;
      }
      if (!item.mitems_price || item.mitems_price <= 0) {
        itemErrors.mitems_price = true;
        hasError = true;
      }
      if (Object.keys(itemErrors).length > 0) {
        validationErrors[index] = itemErrors;
      }
    });

    if (hasError) {
      setErrors(validationErrors);
      toast({
        title: 'Thất bại',
        description: 'Vui lòng điền đầy đủ các trường bắt buộc (Tên món, Giá)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const newMenuItemsToCreate = newMenuItems.map((item) => ({
      mitems_name: item.mitems_name,
      mitems_price: item.mitems_price,
      mitems_note: item.mitems_note,
      mitems_description: item.mitems_description,
      mitems_image: item.mitems_image, // Chuỗi JSON
      mitems_status: item.mitems_status || 'enable',
    }));

    for (const item of newMenuItemsToCreate) {
      await createNewMenuItem(item);
    }

    setNewMenuItems([]);
    setErrors({});
    setIsDialogOpen(false);
    router.refresh();
    setLoading(false);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handlePageChange = (index: number, size: number) => {
    if (pageIndex !== index || size !== pageSize) {
      setPageIndex(index);
      setPageSize(size);
    }
  };

  useEffect(() => {
    router.push(`/dashboard/menu-items/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`);
  }, [pageIndex, pageSize, router, pathname]);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
      <div className="flex justify-end gap-2 items-center py-4">
        <Button variant={'outline'}>
          <Link href={'/dashboard/menu-items/add'}>Thêm</Link>
        </Button>
        <Button variant={'outline'}>
          <Link href={'/dashboard/menu-items/recycle'}>Danh sách đã xóa</Link>
        </Button>
        <Button variant={'outline'} asChild>
          <label>
            Tải ảnh menu
            <input
              type="file"
              accept="image/*"
              onChange={handleImportMenu}
              style={{ display: 'none' }}
            />
          </label>
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border flex-1 overflow-hidden">
        <div className="overflow-y-auto h-full">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-[45px]">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-[5px]">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-10">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-[5px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-8">
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Không có dữ liệu!!!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination
          table={table}
          meta={meta}
          onPageChange={(pageIndex, pageSize) => handlePageChange(pageIndex + 1, pageSize)}
        />
      </div>

      {/* Dialog hiển thị danh sách món ăn mới */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-2xl max-h-[60vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-semibold mb-4">Danh sách món ăn mới</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Các món ăn dưới đây được bóc tách từ ảnh menu và chưa có trong danh sách hiện tại. Bạn có thể chỉnh sửa hoặc xóa trước khi lưu.
            </Dialog.Description>

            {/* Bảng hiển thị newMenuItems với khả năng chỉnh sửa và xóa */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên món</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="w-[50px]">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newMenuItems.length > 0 ? (
                    newMenuItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.mitems_name}
                            onChange={(e) => handleInputChange(index, 'mitems_name', e.target.value)}
                            className={errors[index]?.mitems_name ? 'border-red-500' : ''}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.mitems_price}
                            onChange={(e) => handleInputChange(index, 'mitems_price', Number(e.target.value))}
                            className={errors[index]?.mitems_price ? 'border-red-500' : ''}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.mitems_description}
                            onChange={(e) => handleInputChange(index, 'mitems_description', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Không có món ăn mới
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
              <Button onClick={handleSubmit} disabled={newMenuItems.length === 0}>
                Lưu danh sách
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}