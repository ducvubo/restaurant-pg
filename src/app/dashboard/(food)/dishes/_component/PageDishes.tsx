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
import { IDish } from '../dishes.interface';
import { createDish, getAllDishRestaurant } from '../dishes.api';
import { toast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext';
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { useEffect, useState, ChangeEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon } from '@radix-ui/react-icons';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
export function PageDishes<TData, TValue>({ columns, data, meta }: DataTableProps<TData, TValue>) {
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname().split('/').pop();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = React.useState(meta.current);
  const [pageSize, setPageSize] = React.useState(meta.pageSize);
  const [newDishes, setNewDishes] = useState<any[]>([]); // Lưu danh sách món ăn mới
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Trạng thái mở dialog
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: boolean } }>({}); // Lưu trạng thái lỗi của các trường
  const [search, setSearch] = React.useState('')
  const getListDish = async () => {
    const res: IBackendRes<IDish[]> = await getAllDishRestaurant();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_URLAPI_ENDPOINT}/api/v1/dishes/import-menu-image`, {
        method: 'POST',
        body: formData,
        headers: {
          accept: '*/*',
        },
      });
      setLoading(false);
      const result: IBackendRes<IDish[]> = await response.json();

      if (result.statusCode === 201 && result.data ) {
        const listDish = await getListDish();
        const newDishesArray: any[] = [];
        result.data.forEach((dish: IDish) => {
          const exists = listDish.some(
            (existingDish) => existingDish.dish_name.toLowerCase() === dish.dish_name.toLowerCase()
          );
          if (!exists) {
            newDishesArray.push({
              dish_name: dish.dish_name || '-',
              dish_image: {
                image_cloud: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
                image_custom: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
              },
              dish_price: dish.dish_price || 0,
              dish_priority: dish.dish_priority || 0,
              dish_note: dish.dish_note || '-',
              dish_short_description: dish.dish_short_description || dish.dish_name || '-',
              dish_description: dish.dish_description || '-',
            });
          }
        });


        if (newDishesArray.length > 0) {
          setNewDishes(newDishesArray);
          setIsDialogOpen(true);
        }

        toast({
          title: 'Thành công',
          description: `Đã bóc tách được ${result.data.length} món, trong đó có ${newDishesArray.length} món mới`,
        });
      } else {
        toast({
          title: 'Thất bại',
          description: result.message || 'Đã có lỗi xảy ra khi import thực đơn',
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
      event.target.value = ''; // Reset input file sau khi upload
    }
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    setNewDishes((prev) =>
      prev.map((dish, i) =>
        i === index
          ? {
            ...dish,
            [field]: value,
          }
          : dish
      )
    );

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      if (!updatedErrors[index]) updatedErrors[index] = {};
      updatedErrors[index][field] = !value || value.toString().trim() === '';
      return updatedErrors;
    });
  };

  const handleDeleteDish = (index: number) => {
    setNewDishes((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[index];
      // Cập nhật lại các index của errors sau khi xóa
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

  const createNewDish = async (dish: any) => {
    const res: IBackendRes<IDish> = await createDish(dish);
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false);
      toast({
        title: 'Thành công',
        description: 'Thêm món ăn mới thành công',
        variant: 'default',
      });
    } else if (res.statusCode === 400) {
      setLoading(false);
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
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
      setLoading(false);
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive',
      });
      await deleteCookiesAndRedirect();
    } else if (res.code === -11) {
      setLoading(false);
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive',
      });
    } else {
      setLoading(false);
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

    newDishes.forEach((dish, index) => {
      const dishErrors: { [key: string]: boolean } = {};
      if (!dish.dish_name || dish.dish_name.trim() === '') {
        dishErrors.dish_name = true;
        hasError = true;
      }
      if (!dish.dish_price || dish.dish_price <= 0) {
        dishErrors.dish_price = true;
        hasError = true;
      }
      if (!dish.dish_short_description || dish.dish_short_description.trim() === '') {
        dishErrors.dish_short_description = true;
        hasError = true;
      }
      if (Object.keys(dishErrors).length > 0) {
        validationErrors[index] = dishErrors;
      }
    });

    if (hasError) {
      setErrors(validationErrors);
      toast({
        title: 'Thất bại',
        description: 'Vui lòng điền đầy đủ các trường bắt buộc (Tên món, Giá, Mô tả ngắn)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const newDishesToCreate = newDishes.map((dish) => ({
      dish_name: dish.dish_name,
      dish_price: dish.dish_price,
      dish_short_description: dish.dish_short_description,
      dish_image: {
        image_cloud: dish.dish_image.image_cloud,
        image_custom: dish.dish_image.image_custom,
      },
      dish_priority: dish.dish_priority,
      dish_note: dish.dish_note,
      dish_description: dish.dish_description,
    }));

    for (const dish of newDishesToCreate) {
      await createNewDish(dish);
    }

    setNewDishes([]);
    setErrors({});
    setIsDialogOpen(false);
    router.refresh();
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
    router.push(`/dashboard/dishes/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`);
  }, [pageIndex, pageSize, router, pathname]);
  const debouncedSearch = React.useCallback(
    debounce((value: string) => {
      router.push(
        `/dashboard/dishes/${pathname === 'recycle' ? 'recycle' : ''
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
        <Button variant={'outline'}>
          <Link href={'/dashboard/dishes/add'}>Thêm</Link>
        </Button>
        {
          pathname === 'recycle' ? (
            <Button variant={'outline'}>
              <Link href={'/dashboard/dishes'}>Danh sách</Link>
            </Button>
          ) : (
            <Button variant={'outline'}>
              <Link href={'/dashboard/dishes/recycle'}>Danh sách đã xóa</Link>
            </Button>
          )
        }
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
      {/* <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-lg p-6 w-[90vw] max-w-2xl max-h-[60vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Danh sách món ăn mới
          </Dialog.Title>
          <Dialog.Description className="text-sm mb-4">
            Các món ăn dưới đây được bóc tách từ ảnh menu và chưa có trong danh sách hiện tại. Bạn có thể chỉnh sửa hoặc xóa trước khi lưu.
          </Dialog.Description>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên món</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Mô tả ngắn</TableHead>
                  <TableHead className="w-[50px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newDishes.length > 0 ? (
                  newDishes.map((dish, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={dish.dish_name}
                          onChange={(e) =>
                            handleInputChange(index, 'dish_name', e.target.value)
                          }
                          className={errors[index]?.dish_name ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={dish.dish_price}
                          onChange={(e) =>
                            handleInputChange(index, 'dish_price', Number(e.target.value))
                          }
                          className={errors[index]?.dish_price ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={dish.dish_short_description}
                          onChange={(e) =>
                            handleInputChange(index, 'dish_short_description', e.target.value)
                          }
                          className={errors[index]?.dish_short_description ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDish(index)}
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
            <Button onClick={handleSubmit} disabled={newDishes.length === 0}>
              Lưu danh sách
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root> */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* <AlertDialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" /> */}
        <AlertDialogContent className="w-[90vw] max-w-2xl max-h-[60vh] overflow-y-auto rounded-lg p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Danh sách món ăn mới
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Các món ăn dưới đây được bóc tách từ ảnh menu và chưa có trong danh sách hiện tại. Bạn có thể chỉnh sửa hoặc xóa trước khi lưu.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Bảng hiển thị newDishes với khả năng chỉnh sửa và xóa */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên món</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Mô tả ngắn</TableHead>
                  <TableHead className="w-[50px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newDishes.length > 0 ? (
                  newDishes.map((dish, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={dish.dish_name}
                          onChange={(e) =>
                            handleInputChange(index, 'dish_name', e.target.value)
                          }
                          className={errors[index]?.dish_name ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={dish.dish_price}
                          onChange={(e) =>
                            handleInputChange(index, 'dish_price', Number(e.target.value))
                          }
                          className={errors[index]?.dish_price ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={dish.dish_short_description}
                          onChange={(e) =>
                            handleInputChange(index, 'dish_short_description', e.target.value)
                          }
                          className={errors[index]?.dish_short_description ? 'border-red-500' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDish(index)}
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
              {/* <AlertDialogAction asChild> */}
              <Button onClick={handleSubmit} disabled={newDishes.length === 0}>
                Lưu danh sách
              </Button>
              {/* </AlertDialogAction> */}
            </div>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}