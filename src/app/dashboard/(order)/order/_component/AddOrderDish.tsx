import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IDish } from '../../../(food)/dishes/dishes.interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { lishDishOrder } from '@/app/guest/guest.api'
import { calculateFinalPrice } from '@/app/utils'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState } from 'react'
import { IOrderRestaurant, IRestaurantCreateOrderDish } from '../order.interface'
import { useLoading } from '@/context/LoadingContext'
import { toast } from '@/hooks/use-toast'
import { restaurantCreateOrderDist } from '../order.api'
import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirect } from '@/app/actions/action'

interface Props {
  order_summary: IOrderRestaurant
}
export default function AddOrderDish({ order_summary }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const [listDish, setListDish] = useState<Omit<IDish, 'dish_status' | 'isDeleted'>[]>([])
  const [selectedDishes, setSelectedDishes] = useState<{ [key: string]: number }>({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getListDish = async () => {
    try {
      const res: IBackendRes<Omit<IDish, 'dish_status' | 'isDeleted'>[]> = await lishDishOrder({
        guest_restaurant_id: inforEmployee.epl_restaurant_id ? inforEmployee.epl_restaurant_id : inforRestaurant._id
      })
      if (res.statusCode === 200 && res.data) {
        setListDish(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      getListDish()
    }
  }, [inforEmployee, inforRestaurant, isModalOpen])

  const handleQuantityChange = (id: string, change: number) => {
    setSelectedDishes((prev) => {
      const updatedQuantity = (prev[id] || 0) + change
      if (updatedQuantity < 0) return prev
      return { ...prev, [id]: updatedQuantity }
    })
  }
  const totalQuantity = Object.values(selectedDishes).reduce((sum, quantity) => sum + quantity, 0)

  const totalPrice = listDish.reduce((total, dish) => {
    const quantity = selectedDishes[dish._id] || 0
    return total + quantity * calculateFinalPrice(dish.dish_price, dish.dish_sale)
  }, 0)

  const handleOrderDish = async () => {
    setLoading(true)
    const dishOrderArray = Object.entries(selectedDishes)
      .filter(([_, quantity]) => quantity > 0) // Only include dishes with quantity > 0
      .map(([dishId, quantity]) => ({ od_dish_id: dishId, od_dish_quantity: quantity }))

    const payload: IRestaurantCreateOrderDish = {
      od_dish_summary_id: order_summary._id,
      order_dish: dishOrderArray
    }

    const res: IBackendRes<any> = await restaurantCreateOrderDist(payload)
    if (res.statusCode === 201) {
      setLoading(false)
      setIsModalOpen(false)
      setSelectedDishes({})
      toast({
        title: 'Thành công',
        description: 'Đặt món ăn cho bàn thành công',
        variant: 'default'
      })
      const currentPath = window.location.pathname
      router.push(`${currentPath}?a=${Math.floor(Math.random() * 100000) + 1}`)
    } else if (res?.statusCode === 400) {
      setLoading(false)
      setIsModalOpen(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
            variant: 'destructive'
          })
        })
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive'
        })
      }
      return
    } else if (res.code === -10) {
      setIsModalOpen(false)
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại, hoặc liên hệ nhân viên',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else {
      setIsModalOpen(false)
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau ít phút hoặc liên hệ nhân viên',
        variant: 'destructive'
      })
    }
  }

  return (
    <div>
      <Dialog onOpenChange={(isOpen) => setIsModalOpen(isOpen)} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='-ml-16 mr-[130px] w-32'
            disabled={order_summary.od_dish_smr_status === 'ordering' ? false : true}
          >
            Gọi món
          </Button>
        </DialogTrigger>
        <DialogContent className='w-auto'>
          <DialogHeader>
            <DialogTitle>Gọi món</DialogTitle>
            <DialogDescription>Khi bạn gọi món ở đây, tên khách sẽ là "Nhân viên order"</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col justify-between gap-3'>
            <ScrollArea className='max-h-80 min-h-80 pr-3'>
              {listDish?.map((dish, index) => (
                <div key={index} className='flex gap-2'>
                  <Image
                    src={dish.dish_image.image_cloud}
                    width={100}
                    height={100}
                    alt={dish.dish_name}
                    className='w-20 h-20 min-h-20 min-w-20 object-cover rounded-lg'
                  />
                  <div className='flex flex-col justify-between gap-1 w-full'>
                    <Label className='font-bold text-lg min-h-[10px] line-clamp-1'>{dish.dish_name}</Label>
                    <span className='min-h-[10px] line-clamp-2 overflow-hidden'>{dish.dish_short_description}</span>
                    <span>Giá: {calculateFinalPrice(dish.dish_price, dish.dish_sale).toLocaleString()} đ</span>
                  </div>
                  <div className='flex flex-col justify-center gap-2'>
                    {dish.dish_sale && (
                      <div className='flex'>
                        Giảm:
                        {dish.dish_sale?.sale_type === 'percentage'
                          ? ` ${dish.dish_sale.sale_value}%`
                          : ` ${dish.dish_sale?.sale_value}đ`}
                      </div>
                    )}
                    <div className='flex gap-2 items-end'>
                      <Button
                        className='h-6 w-6'
                        onClick={() => handleQuantityChange(dish._id, -1)}
                        variant={'secondary'}
                      >
                        -
                      </Button>
                      <Input disabled className='w-11 h-6 text-center' value={selectedDishes[dish._id] || 0} />
                      <Button
                        className='h-6 w-6'
                        onClick={() => handleQuantityChange(dish._id, 1)}
                        variant={'secondary'}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <DialogFooter>
            <div className='w-full sticky bottom-0 z-10 mt-2'>
              <Button className='w-full' disabled={totalQuantity === 0} onClick={handleOrderDish}>
                {totalQuantity === 0 && totalPrice === 0
                  ? 'Chọn món trước khi đặt hàng'
                  : `Đặt ${totalQuantity} món với giá ${totalPrice.toLocaleString()} đ`}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
