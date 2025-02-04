'use client'
import * as React from 'react'
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
  VisibilityState
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePathname, useRouter } from 'next/navigation'
import { DataTableViewOptions } from '@/components/ColumnToggle'
import { DataTablePagination } from '@/components/PaginationTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
}

export function PageSupplier<TData, TValue>({ columns, meta, data }: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname().split('/').pop()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

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
      columnVisibility
    }
  })

  const [pageIndex, setPageIndex] = React.useState(meta.current)
  const [pageSize, setPageSize] = React.useState(meta.pageSize)

  const handlePageChange = (index: number, size: number) => {
    if (pageIndex !== index || size !== pageSize) {
      setPageIndex(index)
      setPageSize(size)
    }
  }

  React.useEffect(() => {
    router.push(`/dashboard/suppliers/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`)
  }, [pageIndex, pageSize, router])

  return (
    <div className='flex flex-col h-[570px]'>
     <div className='flex justify-end gap-2 items-center py-4'>
        <Button variant={'outline'}><Link href={'/dashboard/suppliers/add'}>Thêm</Link></Button>
        <Button variant={'outline'}><Link href={'/dashboard/suppliers/recycle'}  >Danh sách đã xóa</Link></Button>
        <DataTableViewOptions table={table} />
      </div>
      <div className='rounded-md border flex-1 overflow-hidden'>
        {/* Container for the table with fixed height */}
        <div className='overflow-y-auto h-full'>
          <Table className='min-w-full'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='h-[45px]'>
                  {/* Giảm chiều cao hàng */}
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='py-[5px] '>
                      {/* Giảm padding trong header */}
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className='h-10'>
                    {/* Giảm chiều cao hàng */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='py-[5px]'>
                        {/* Giảm padding trong ô */}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className='h-8'>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Không có dữ liệu!!!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination
          table={table}
          meta={meta}
          onPageChange={(pageIndex, pageSize) => handlePageChange(pageIndex + 1, pageSize)}
        />
      </div>
    </div>
  )
}
