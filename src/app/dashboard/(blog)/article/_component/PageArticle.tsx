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
import ListAddArticle from './ListAddArticle'
import { autoGenArticleDefault } from '../article.api'
import { toast } from '@/hooks/use-toast'
import { el } from 'date-fns/locale'

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

export function PageArticle<TData, TValue>({ columns, meta, data }: DataTableProps<TData, TValue>) {
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

  const handleAutoGenArticle = async () => {
    try {
      const res = await autoGenArticleDefault()
      if (res.message === 'Workflow was started') {
        toast({
          title: 'Thành công',
          description: 'Kích hoạt tự động tạo bài viết thành công, vui lòng đợi trong giây lát',
          variant: 'default'
        })
      } else {
        toast({
          title: 'Thất bại',
          description: 'Kích hoạt tự động tạo bài viết thất bại, vui lòng thử lại sau',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log('🚀 ~ handleAutoGenArticle ~ error:', error)
      toast({
        title: 'Thất bại',
        description: 'Kích hoạt tự động tạo bài viết thất bại, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  React.useEffect(() => {
    router.push(`/dashboard/article/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`)
  }, [pageIndex, pageSize, router])

  return (
    <div className='flex flex-col' style={{ height: 'calc(100vh - 7rem)' }}>
      <div className='flex justify-end gap-2 items-center py-4'>
        <ListAddArticle />
        <Button variant={'outline'} onClick={handleAutoGenArticle}>
          Tạo bài viết tự động
        </Button>
        {
          pathname === 'recycle' ? (
            <Button variant={'outline'}>
              <Link href={'/dashboard/article'}>Danh sách</Link>
            </Button>
          ) : (
            <Button variant={'outline'}>
              <Link href={'/dashboard/article/recycle'}>Danh sách đã xóa</Link>
            </Button>
          )
        }
        <DataTableViewOptions table={table} />
      </div>
      <div className='rounded-md border flex-1 overflow-hidden'>
        <div className='overflow-y-auto h-full'>
          <Table className='min-w-full'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='h-[45px]'>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='py-[5px] '>
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='py-[5px]'>
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
