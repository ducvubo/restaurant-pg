'use client'
import React from 'react'
import { IOrderRestaurant } from '../order.interface'
import { Button } from '@/components/ui/button'
import { RobotoMediumnormal } from '@/app/fonts/RobotoMediumnormal'
import jsPDF from 'jspdf'
import { calculateFinalPrice } from '@/app/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
interface Props {
  order_summary: IOrderRestaurant
}
export default function ExportBill({ order_summary }: Props) {
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  console.log('inforEmployee', inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);
  const infor = inforRestaurant._id ? inforRestaurant : inforEmployee;
  const name = infor.restaurant_name;
  const address = infor.restaurant_address.address_specific + ', ' + infor.restaurant_address.address_district.name + ', ' + infor.restaurant_address.address_province.name;
  const phone = infor.restaurant_phone;
  const email = infor.restaurant_email;

  const handleExportBill = () => {
    const doc = new jsPDF();
    // Thêm font
    doc.addFileToVFS("Roboto-Medium.ttf", RobotoMediumnormal);
    doc.addFont("Roboto-Medium.ttf", "Roboto-Medium", "normal");
    doc.setFont("Roboto-Medium", "normal");
    doc.setFontSize(25);
    doc.addImage('/images/logo.png', 'PNG', 10, 10, 50, 25);
    doc.text(`Hóa đơn`, 100, 26);


    doc.setFontSize(10);
    doc.text(`Tên nhà hàng: ${name}`, 20, 40);
    doc.text(`Địa chỉ: ${address}`, 20, 45);
    doc.text(`Số điện thoại: ${phone}`, 20, 50);

    // Vẽ đường kẻ ngang
    doc.setLineWidth(0.5);
    doc.line(20, 52, 200, 52);

    // Thông tin đơn hàng
    doc.setFontSize(10);
    doc.text(`Mã đơn hàng: ${order_summary._id}`, 20, 57);
    doc.text(`Khách hàng: ${order_summary.od_dish_smr_guest_id.guest_name}`, 20, 62);
    doc.text(`Bàn: ${order_summary.od_dish_smr_table_id.tbl_name}`, 20, 67);
    doc.text(`Thời gian: ${new Date(order_summary.createdAt).toLocaleString('vi-VN')}`, 20, 72);

    // Tiêu đề bảng món ăn
    doc.setFontSize(12);
    doc.text('STT', 20, 80);
    doc.text('Món ăn', 40, 80);
    doc.text('Số lượng', 100, 80);
    doc.text('Đơn giá', 130, 80);
    doc.text('Giảm giá', 160, 80);
    doc.text('Thành tiền', 180, 80);

    doc.line(20, 82, 200, 82);

    let y = 92;
    let total = 0;
    order_summary.or_dish.forEach((dish, index) => {
      if (dish.od_dish_status === 'delivered') {
        const price = dish.od_dish_duplicate_id.dish_duplicate_price;
        const quantity = dish.od_dish_quantity;
        const sale = dish.od_dish_duplicate_id.dish_duplicate_sale;
        const finalPrice = Math.floor(calculateFinalPrice(price, sale));
        const discount = price - finalPrice;
        const subtotal = finalPrice * quantity;


        doc.text(`${index + 1}`, 20, y);
        doc.text(dish.od_dish_duplicate_id.dish_duplicate_name, 40, y);
        doc.text(`${quantity}`, 100, y);
        doc.text(`${price.toLocaleString('vi-VN')} đ`, 130, y);
        doc.text(`${discount.toLocaleString('vi-VN')} đ`, 160, y);
        doc.text(`${subtotal.toLocaleString('vi-VN')} đ`, 180, y);
        total += subtotal;
        y += 10;
      }
    });

    doc.line(20, y, 200, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Tổng tiền: ${total.toLocaleString('vi-VN')} VNĐ`, 180, y, { align: 'right' });

    // Lời cảm ơn
    doc.setFontSize(12);
    doc.text('Cảm ơn quý khách đã ủng hộ nhà hàng!', 105, y + 20, { align: 'center' });

    // Lưu file PDF
    doc.save(`hoa-don-${order_summary._id}.pdf`);

  }
  return (
    <Button variant='outline' onClick={handleExportBill}>Tải hóa đơn</Button>
  )
}