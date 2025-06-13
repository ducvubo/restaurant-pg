'use client'
import React, { useState } from 'react';
import { IOrderRestaurant } from '../order.interface';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility';

export const calculateFinalPrice = (price: number, sale: { sale_type: string; sale_value: number } | undefined) => {
  if (!sale) return price;
  if (sale.sale_type === 'fixed') {
    return Math.max(0, price - sale.sale_value);
  }
  if (sale.sale_type === 'percentage') {
    return Math.max(0, price - (price * sale.sale_value) / 100);
  }
  console.log("🚀 ~ calculateFinalPrice ~ price:", price);
  return Math.round(price);
};

export const calculateOrderSummary = (orderSummary: IOrderRestaurant) => {
  let totalQuantity = 0;
  let totalPrice = 0;

  orderSummary.or_dish
    .filter((dish) => dish.od_dish_status === 'delivered')
    .forEach((dish) => {
      const price = dish.od_dish_duplicate_id.dish_duplicate_price;
      const sale = dish.od_dish_duplicate_id.dish_duplicate_sale;
      const quantity = dish.od_dish_quantity;
      const finalPrice = Math.floor(calculateFinalPrice(price, sale));

      totalQuantity += quantity;
      totalPrice += finalPrice * quantity;
    });

  return {
    totalQuantity,
    totalPrice,
  };
};

interface Props {
  order_summary: IOrderRestaurant;
}

export default function GetQrPayment({ order_summary }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);
  const infor = inforRestaurant._id ? inforRestaurant : inforEmployee;
  const bank = infor.restaurant_bank;
  const { totalQuantity, totalPrice } = calculateOrderSummary(order_summary);

  return (
    <>
      <Button disabled={order_summary.od_dish_smr_status === 'paid' || order_summary.od_dish_smr_status === 'refuse' || !hasPermissionKey('order_dish_create_qr_payment')} className="mr-2" variant="outline" onClick={() => setIsDialogOpen(true)}>
        Thanh toán
      </Button >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Xác nhận thanh toán</DialogTitle>
            <DialogDescription className="text-center">
              Vui lòng quét mã QR để thanh toán cho đơn hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {bank && (
              <Image
                src={`https://qr.sepay.vn/img?acc=${bank.account_number}&bank=${bank.bank}&amount=${totalPrice}&des=ORDERDISH ${order_summary._id}`}
                width={150}
                height={150}
                alt="QR Code Thanh toán"
                className="object-contain"
              />
            )}
            <p className="text-center text-sm">
              Bạn đang thanh toán cho đơn hàng gồm{' '}
              <span className="font-bold">{totalQuantity}</span> món với tổng giá trị{' '}
              <span className="font-bold">{totalPrice.toLocaleString('vi-VN')} đ</span>.
              Vui lòng quét mã QR để hoàn tất thanh toán (Lưu ý: Không sửa nội dung giao dịch).
            </p>
            {bank && (
              <div className="text-center text-sm">
                <p>Tên tài khoản: {bank.account_name}</p>
                <p>Số tài khoản: {bank.account_number}</p>
                <p>
                  Nội dung giao dịch:{' '}
                  <span className="font-bold">ORDERDISH {order_summary._id}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}