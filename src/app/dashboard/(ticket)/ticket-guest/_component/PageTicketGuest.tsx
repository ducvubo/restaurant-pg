'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'
import { getTicketGuest } from '../ticket-guest.api'
import { toast } from '@/hooks/use-toast'
import { ITicketGuestRestaurant } from '../ticket-guest.interface'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { TableCompnonent } from '@/components/Table'
import { columns } from './Columns'

export default function PageTicketGuest() {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent' | ''>('')
  const [type, setType] = useState<'book_table' | 'order_dish' | 'Q&A' | 'complain' | 'other' | ''>('')
  const [status, setStatus] = useState<'open' | 'in_progress' | 'close' | 'resolved' | ''>('')
  const [q, setQ] = useState('')
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    totalPage: 0,
    totalItem: 0
  })
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [listTicket, setListTicket] = useState<ITicketGuestRestaurant[]>([])

  const findListTicket = async () => {
    const res = await getTicketGuest({
      current: pageIndex.toString(),
      pageSize: pageSize.toString(),
      q,
      tkgr_priority: priority,
      tkgr_status: status,
      tkgr_type: type
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setListTicket(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setListTicket([])
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListTicket([])
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListTicket([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  React.useEffect(() => {
    findListTicket()
  }, [pageIndex, pageSize, priority, type, status, q])

  return (
    <section>
      <div className='flex gap-3 w-full mb-3'>
        <div className='w-1/2'>
          <Label>Tìm kiếm</Label>
          <Input
            type='text'
            className='input w-full'
            placeholder='Tìm kiếm'
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className='w-1/2'>
          <Label>Loại yêu cầu</Label>
          <Select
            value={type}
            onValueChange={(e: 'book_table' | 'order_dish' | 'Q&A' | 'complain' | 'other') => setType(e)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Loại câu hỏi' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='book_table'>Đặt bàn</SelectItem>
                <SelectItem value='order_dish'>Gọi món</SelectItem>
                <SelectItem value='Q&A'>Hỏi đáp</SelectItem>
                <SelectItem value='complain'>Khiếu nại</SelectItem>
                <SelectItem value='other'>Khác</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='w-1/2'>
          <Label>Độ ưu tiên</Label>
          <Select value={priority} onValueChange={(e: 'low' | 'medium' | 'high' | 'urgent') => setPriority(e)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Độ ưu tiên' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='low'>Thấp</SelectItem>
                <SelectItem value='medium'>Trung bình</SelectItem>
                <SelectItem value='high'>Cao</SelectItem>
                <SelectItem value='urgent'>Khẩn cấp</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='w-1/2'>
          <Label>Trạng thái</Label>
          <Select value={status} onValueChange={(e: 'open' | 'in_progress' | 'close' | 'resolved') => setStatus(e)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='open'>Mở</SelectItem>
                <SelectItem value='in_progress'>Đang xử lý</SelectItem>
                <SelectItem value='close'>Đóng</SelectItem>
                <SelectItem value='resolved'>Đã giải quyết</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TableCompnonent
        columns={columns}
        data={listTicket}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        meta={meta}
        height='10.7rem'
      />
    </section>
  )
}
