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
export function PagePolicyes<TData, TValue>({ columns, data, meta }: DataTableProps<TData, TValue>) {
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
    router.push(`/dashboard/policy/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`);
  }, [pageIndex, pageSize, router, pathname]);
  const debouncedSearch = React.useCallback(
    debounce((value: string) => {
      router.push(
        `/dashboard/policy/${pathname === 'recycle' ? 'recycle' : ''
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
          <Link href={'/dashboard/policy/add'}>Thêm</Link>
        </Button>
        {
          pathname === 'recycle' ? (
            <Button variant={'outline'}>
              <Link href={'/dashboard/policy'}>Danh sách</Link>
            </Button>
          ) : (
            <Button variant={'outline'}>
              <Link href={'/dashboard/policy/recycle'}>Danh sách đã xóa</Link>
            </Button>
          )
        }
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
    </div>
  );
}