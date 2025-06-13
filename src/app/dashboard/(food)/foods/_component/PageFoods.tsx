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
import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon } from '@radix-ui/react-icons';
import { IFood } from '../food.interface';
import { getListFood } from '../../food-combos/food-combos.api';
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { createFood } from '../food.api';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { usePermission } from '@/app/auth/PermissionContext';
;

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

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function PageFoods<TData, TValue>({ columns, meta, data }: DataTableProps<TData, TValue>) {
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname().split('/').pop();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = React.useState(meta.current);
  const [pageSize, setPageSize] = React.useState(meta.pageSize);
  const [newFoods, setNewFoods] = React.useState<IFood[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: number]: { [key: string]: boolean } }>({});
  const [search, setSearch] = React.useState('')
  const { hasPermission } = usePermission()
  // Function to get the list of existing foods
  const getExistingFoods = async () => {
    const res: IBackendRes<IFood[]> = await getListFood();
    if (res.statusCode === 200 && res.data) {
      return res.data;
    } else {
      toast({
        title: 'Thất bại',
        description: 'Không thể lấy danh sách món ăn hiện tại',
        variant: 'destructive',
      });
      return [];
    }
  };

  const handleImportFood = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER_ORDER}/food-restaurant/import-food-image`, {
        method: 'POST',
        body: formData,
        headers: {
          accept: '*/*',
        },
      });
      setLoading(false);

      const result: IBackendRes<IFood[]> = await response.json();

      if (result.statusCode === 201 && result.data) {
        const existingFoods = await getExistingFoods();
        const newFoodsArray: any[] = [];
        result.data.forEach((item: IFood) => {
          const exists = existingFoods.some(
            (existingItem) => existingItem.food_name?.toLowerCase() === item.food_name?.toLowerCase()
          );
          if (!exists) {
            newFoodsArray.push({
              food_name: item.food_name || '-',
              food_price: item.food_price || 0,
              food_note: item.food_note || '-',
              food_description: item.food_description || '-',
              food_image: JSON.stringify([{
                image_cloud: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
                image_custom: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
              }]),
              food_status: 'enable',
            });
          }
        });

        if (newFoodsArray.length > 0) {
          setNewFoods(newFoodsArray);
          setIsDialogOpen(true);
        }

        toast({
          title: 'Thành công',
          description: `Đã bóc tách được ${result.data.length} món, trong đó có ${newFoodsArray.length} món mới`,
        });
      } else {
        toast({
          title: 'Thất bại',
          description: result.message || 'Đã có lỗi xảy ra khi import món ăn',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setLoading(false);
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

  // Handle input changes in the dialog
  const handleInputChange = (index: number, field: string, value: string | number) => {
    setNewFoods((prev) =>
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

  // Handle deleting a food item from the dialog
  const handleDeleteFood = (index: number) => {
    setNewFoods((prev) => prev.filter((_, i) => i !== index));
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

  const createNewFood = async (item: Partial<IFood>) => {
    const res: IBackendRes<IFood> = await createFood(item);
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

    newFoods.forEach((item, index) => {
      const itemErrors: { [key: string]: boolean } = {};
      if (!item.food_name || item.food_name.trim() === '') {
        itemErrors.food_name = true;
        hasError = true;
      }
      if (!item.food_price || item.food_price <= 0) {
        itemErrors.food_price = true;
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
    const foodsToCreate = newFoods.map((item) => ({
      food_name: item.food_name,
      food_price: item.food_price,
      food_note: item.food_note,
      food_description: item.food_description,
      food_image: item.food_image,
      food_sort: 1,
      food_open_time: '00:00:00',
      food_close_time: '23:59:00',
      food_options: []
    }));

    for (const item of foodsToCreate) {
      await createNewFood(item);
    }

    setNewFoods([]);
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

  React.useEffect(() => {
    router.push(`/dashboard/foods/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`);
  }, [pageIndex, pageSize, router, pathname]);

  const debouncedSearch = React.useCallback(
    debounce((value: string) => {
      router.push(
        `/dashboard/foods/${pathname === 'recycle' ? 'recycle' : ''
        }?page=${pageIndex}&size=${pageSize}&search=${value}`
      )
    }, 300),
    [pageIndex, pageSize, pathname, router]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
      <div className="flex justify-end gap-2 items-center py-4">
        <Input placeholder='Tìm kiếm' value={search} onChange={handleSearchChange} />
        <Button variant={'outline'} disabled={!hasPermission('online_food_create')}>
          <Link href={'/dashboard/foods/add'}>Thêm</Link>
        </Button>
        {
          pathname === 'recycle' ? (
            <Button variant={'outline'} disabled={!hasPermission('online_food_view_list')}>
              <Link href={'/dashboard/foods'}>Danh sách</Link>
            </Button>
          ) : (
            <Button variant={'outline'} disabled={!hasPermission('online_food_view_deleted')}>
              <Link href={'/dashboard/foods/recycle'}>Danh sách đã xóa</Link>
            </Button>
          )
        }
        <Button variant={'outline'} asChild disabled={!hasPermission('online_food_upload_image')} className={(!hasPermission('online_food_upload_image') ? 'opacity-50 cursor-not-allowed pointer-events-none' : '') + ' ' + 'hover:bg-gray-100'}>
          Tải ảnh món ăn
          <input
            disabled={!hasPermission('online_food_upload_image')}
            type="file"
            accept="image/*"
            onChange={handleImportFood}
            style={{ display: 'none' }}
            id="foood-upload-input"
          />
          <label
            htmlFor="foood-upload-input"
            className={(!hasPermission('online_food_upload_image') ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer')}
          >
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

      {/* Dialog to display new food items */}
      {/* <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-2xl max-h-[60vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-semibold mb-4">Danh sách món ăn mới</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Các món ăn dưới đây được bóc tách từ ảnh và chưa có trong danh sách hiện tại. Bạn có thể chỉnh sửa hoặc xóa trước khi lưu.
            </Dialog.Description>
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
                  {newFoods.length > 0 ? (
                    newFoods.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.food_name}
                            onChange={(e) => handleInputChange(index, 'food_name', e.target.value)}
                            className={errors[index]?.food_name ? 'border-red-500' : ''}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.food_price}
                            onChange={(e) => handleInputChange(index, 'food_price', Number(e.target.value))}
                            className={errors[index]?.food_price ? 'border-red-500' : ''}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.food_description}
                            onChange={(e) => handleInputChange(index, 'food_description', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFood(index)}
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
              <Button onClick={handleSubmit} disabled={newFoods.length === 0}>Lưu danh sách</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[90vw] max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Danh sách món ăn mới
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Các món ăn dưới đây được bóc tách từ ảnh và chưa có trong danh sách hiện tại. Bạn có thể chỉnh sửa hoặc xóa trước khi lưu.
            </AlertDialogDescription>
          </AlertDialogHeader>
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
                {newFoods.length > 0 ? (
                  newFoods.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.food_name}
                          onChange={(e) => handleInputChange(index, 'food_name', e.target.value)}
                          className={errors[index]?.food_name ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.food_price}
                          onChange={(e) => handleInputChange(index, 'food_price', Number(e.target.value))}
                          className={errors[index]?.food_price ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.food_description}
                          onChange={(e) => handleInputChange(index, 'food_description', e.target.value)}
                          className={errors[index]?.food_description ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFood(index)}
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
          <AlertDialogFooter className="mt-4">
            <div className='flex gap-2 justify-end'>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
              <Button onClick={handleSubmit} disabled={newFoods.length === 0}>
                Lưu danh sách
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}