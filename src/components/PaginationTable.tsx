'use client'
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
  defaultRow?: number
  onPageChange: (pageIndex: number, pageSize: number) => void 
}

export function DataTablePagination<TData>({ table, meta, onPageChange, defaultRow }: DataTablePaginationProps<TData>) {
  const [pageIndex, setPageIndex] = useState(meta.current - 1)
  const [pageSize, setPageSize] = useState(meta.pageSize)

  useEffect(() => {
    onPageChange(pageIndex, pageSize)
  }, [pageIndex, pageSize, onPageChange])

  useEffect(() => {
    setPageIndex(meta.current - 1)
    setPageSize(meta.pageSize)
    table.setPageSize(meta.pageSize)
  }, [meta, table])
  return (
    <div className='flex items-center justify-between px-2 -mb-10'>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Số bản ghi</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value)
              setPageSize(newPageSize)
              table.setPageSize(newPageSize)
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[defaultRow ? defaultRow : null, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Trang {pageIndex + 1} của {meta.totalPage}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0 }
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
            disabled={pageIndex === 0 }
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => setPageIndex((old) => Math.min(old + 1, meta.totalPage - 1))}
            disabled={pageIndex === meta.totalPage - 1 }
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => setPageIndex(meta.totalPage - 1)}
            disabled={pageIndex === meta.totalPage - 1 }
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
