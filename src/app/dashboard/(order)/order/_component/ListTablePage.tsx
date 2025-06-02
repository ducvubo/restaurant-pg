'use client'
import React, { useCallback, useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination } from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { IModelPaginateWithStatusCount, ITableOrderSummary } from '../order.interface'
import { getListTableOrder } from '../order.api'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { debounce } from 'lodash'
import { FiLoader } from 'react-icons/fi'
import { MdPaid } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa6'
import { Separator } from '@/components/ui/separator'
import { FiUsers } from 'react-icons/fi'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DialogDetailTable } from './DialogDetailTable'
export default function ListTablePage() {
  const [tableName, setTableName] = useState('')
  const [status, setStatus] = useState<'enable' | 'disable' | 'serving' | 'reserve' | 'all'>('all')
  const [pageIndex, setPageIndex] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [meta, setMeta] = useState<{
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0
  })
  const [listTable, setListTable] = useState<ITableOrderSummary[]>([])
  const [selectedTable, setSelectedTable] = useState<ITableOrderSummary | null>(null)

  const searchParam = useSearchParams().get('a')

  const findTableOrder = async () => {
    const res: IBackendRes<IModelPaginateWithStatusCount<ITableOrderSummary>> = await getListTableOrder({
      current: pageIndex,
      pageSize: pageSize,
      tbl_name: tableName ? tableName : undefined,
      tbl_status: status
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setListTable(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setListTable([])
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListTable([])
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListTable([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const debouncedFindListTable = useCallback(
    debounce(() => {
      findTableOrder()
    }, 300), // 500ms là thời gian delay cho debounce
    [tableName, status, pageIndex, pageSize] // Dependencies của debounce
  )

  useEffect(() => {
    debouncedFindListTable()
    return () => {
      debouncedFindListTable.cancel()
    }
  }, [tableName, status, pageIndex, pageSize, debouncedFindListTable])

  useEffect(() => {
    debouncedFindListTable()
    return () => {
      debouncedFindListTable.cancel()
    }
  }, [searchParam])

  useEffect(() => {
    // Kiểm tra nếu selectedTable đã có, tìm lại item trong listTable dựa trên _id
    if (selectedTable) {
      const updatedTable = listTable.find((table) => table._id === selectedTable._id)
      if (updatedTable) {
        setSelectedTable(updatedTable) // Cập nhật selectedTable với giá trị mới
      } else {
        setSelectedTable(null) // Nếu không tìm thấy, reset selectedTable
      }
    }
  }, [listTable])

  return (
    <section className='mt-2 h-[563px]'>
      <ScrollArea className='h-[593px] pr-2 relative'>
        <div className='flex gap-3 w-auto mt-2'>
          <Input placeholder='Tên bàn' className='w-[180px]' onChange={(e) => setTableName(e.target.value)} />
          <Select>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Chọn trạng thái</SelectLabel>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='enable'>Hoạt động</SelectItem>
                <SelectItem value='disable'>Vô hiệu hóa</SelectItem>
                <SelectItem value='serving'>Đã đặt trước</SelectItem>
                <SelectItem value='reserve'>Đang phục vụ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='mt-2 grid grid-cols-8 gap-3'>
          {listTable?.map((table, index) => {
            return (
              <Card className='h-28 cursor-pointer' key={index} onClick={() => setSelectedTable(table)}>
                <CardContent className='flex flex-col'>
                  <span className='my-1'>{table.tbl_name}</span>
                  <Separator orientation='horizontal' className='w-28 -ml-6' />
                  <div className='flex'>
                    <div className='flex items-center'>
                      <div className='flex gap-1 -ml-2 mr-2'>
                        <FiUsers fontSize={'1.0em'} />
                        <span className='text-sm'>{table.od_dish_smr_count.guest}</span>
                      </div>
                    </div>

                    <Separator orientation='vertical' className='h-20 w-[2px]' />

                    <div className='flex flex-col mt-1 gap-1 ml-1'>
                      <div className='flex gap-1'>
                        <FiLoader fontSize={'1.0em'} />
                        <span className='text-sm'>{table.od_dish_smr_count.ordering}</span>
                      </div>
                      <div className='flex gap-1'>
                        <FaTrash fontSize={'1.0em'} />
                        <span className='text-sm'>{table.od_dish_smr_count.refuse}</span>
                      </div>
                      <div className='flex gap-1 '>
                        <MdPaid fontSize={'1.0em'} />
                        <span className='text-sm'>{table.od_dish_smr_count.paid}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className='flex justify-end absolute bottom-10 right-0'>
          <Pagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            meta={meta}
          />
        </div>
      </ScrollArea>

      {selectedTable && <DialogDetailTable selectedTable={selectedTable} setSelectedTable={setSelectedTable} />}
    </section>
  )
}
