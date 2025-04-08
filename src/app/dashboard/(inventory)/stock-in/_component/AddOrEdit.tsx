'use client'
import React, { useEffect, useRef, useState } from 'react'
import { any, z } from 'zod'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createStockIn, findEmployeeName, findIngredientName, findSupplierName, updateStockIn } from '../stock-in.api'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { IStockIn, IStockInItem } from '../stock-in.interface'
import { ISupplier } from '../../suppliers/supplier.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { IEmployee } from '../../../(employee)/employees/employees.interface'
import { RootState } from '@/app/redux/store'
import { useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { IIngredient } from '../../ingredients/ingredient.interface'
import { InputNoBoder } from '@/components/CustomInputNoBoder'
import { IoMdCloudUpload } from 'react-icons/io'
import Image from 'next/image'
import { Loader2, TrashIcon } from 'lucide-react'
import { createIngredient, findAllUnits } from '../../ingredients/ingredient.api'
import { createSupplier } from '../../suppliers/supplier.api'
import { createUnit } from '../../units/unit.api'
import { createCatIngredient } from '../../cat-ingredients/cat-ingredient.api'

interface Props {
  id: string
  inforStockIn?: IStockIn
}
const FormSchema = z.object({
  stki_code: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  spli_id: z.string().nonempty({ message: 'Vui lòng chọn nhà cung cấp' }),
  stki_delivery_name: z.string().nonempty({ message: 'Vui lòng nhập tên người giao hàng' }),
  stki_delivery_phone: z.string().nonempty({ message: 'Vui lòng nhập số điện thoại người giao hàng' }),
  stki_date: z.date({ message: 'Vui lòng chọn ngày nhập' }),
  stki_note: z.string(),
  stki_payment_method: z.enum(['cash', 'transfer', 'credit_card'], { message: 'Vui lòng chọn phương thức thanh toán' }),
  stki_receiver: z.string().nonempty({ message: 'Vui lòng chọn người nhận' }),
  stki_image: z.string().optional()
})

export default function AddOrEdit({ id, inforStockIn }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee)
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
  const [listSuppliers, setListSuppliers] = useState<ISupplier[]>([])
  const [listEmployees, setListEmployees] = useState<IEmployee[]>([])
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([])
  const [stockInItems, setStockInItems] = useState<IStockInItem[]>([])
  const [selectedIngredient, setSelectedIngredient] = useState<IIngredient | null>(null)
  const [file_image, setFile_Image] = useState<File | null>(null)
  const inputRef_Image = useRef<HTMLInputElement | null>(null)
  const previousFileImageRef = useRef<Blob | null>(null)
  const [loading_upload_image, setLoading_upload_image] = useState(false)
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string }>({
    image_cloud: '',
    image_custom: ''
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [listUnits, setListUnits] = useState<any[]>([])
  const [listCatIngredients, setListCatIngredients] = useState<any[]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stki_code: inforStockIn?.stki_code || '',
      spli_id: inforStockIn?.spli_id || '',
      stki_delivery_name: inforStockIn?.stki_delivery_name || '',
      stki_delivery_phone: inforStockIn?.stki_delivery_phone || '',
      stki_receiver: inforStockIn?.stki_receiver || '',
      stki_date: inforStockIn?.stki_date ? new Date(inforStockIn.stki_date) : new Date(),
      stki_note: inforStockIn?.stki_note || '',
      stki_payment_method: inforStockIn?.stki_payment_method || 'cash'
    }
  })

  const findAllUnitsCom = async () => {
    const res = await findAllUnits();
    if (res.statusCode === 200 && res.data) {
      setListUnits(res.data);
    }
  }

  useEffect(() => {
    findAllSuppliers()
    findAllEmployees()
    findAllIngredient()
    findAllUnitsCom()
  }, [])

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforStockIn) {
        if (inforStockIn.items) {
          //tìm tên nguyên liệu và đơn vị đo cho từng item
          inforStockIn.items.forEach((item) => {
            const ingredient = listIngredients.find((ingredient) => ingredient.igd_id === item.igd_id)
            if (ingredient) {
              ; (item.igd_name = ingredient.igd_name),
                (item.unt_name = typeof ingredient.unt_id !== 'string' ? ingredient.unt_id?.unt_name || '' : '')
            }
          })
          setStockInItems(inforStockIn.items)
        }
        if (inforStockIn.stki_image) {
          setImage({
            image_cloud: JSON.parse(inforStockIn.stki_image).image_cloud,
            image_custom: JSON.parse(inforStockIn.stki_image).image_custom
          })
        }
      }
    }
  }, [inforStockIn, id, listIngredients])

  useEffect(() => {
    const infor = inforRestaurant?._id ? inforRestaurant : inforEmployee
    if (infor?.restaurant_id) {
      const listEpl = [...listEmployees]
      listEpl.push({
        _id: infor.restaurant_id,
        restaurant_id: infor.restaurant_id,
        epl_name: 'Chủ nhà hàng',
        epl_address: '',
        epl_email: '',
        epl_gender: 'Khác',
        epl_phone: '',
        epl_restaurant_id: '',
        epl_status: '',
        epl_avatar: {
          image_cloud: '',
          image_custom: ''
        }
      })
      setListEmployees(listEpl)
    }
  }, [inforEmployee, inforRestaurant])

  const findAllSuppliers = async () => {
    const res: IBackendRes<ISupplier[]> = await findSupplierName()
    if (res.statusCode === 200 && res.data) {
      setListSuppliers(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)

      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const findAllEmployees = async () => {
    const res: IBackendRes<IEmployee[]> = await findEmployeeName()
    if (res.statusCode === 200 && res.data) {
      setListEmployees(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const findAllIngredient = async () => {
    const res: IBackendRes<IIngredient[]> = await findIngredientName()
    if (res.statusCode === 200 && res.data) {
      setListIngredients(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const uploadImage = async (formData: FormData, type: string) => {
    setLoading_upload_image(true)
    try {
      const res = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`, {
          method: 'POST',
          headers: {
            folder_type: type
          },
          body: formData
        })
      ).json()

      if (res.statusCode === 201) {
        setLoading_upload_image(false)

        toast({
          title: 'Thành công',
          description: 'Tải ảnh lên thành công',
          variant: 'default'
        })
        setImage({
          image_cloud: res.data.image_cloud,
          image_custom: res.data.image_custom
        })
        return res.mataData
      }
      if (res.statusCode === 422 || res.statusCode === 400) {
        setLoading_upload_image(false)
        setFile_Image(null)
        setImage({
          image_cloud: '',
          image_custom: ''
        })

        toast({
          title: 'Thất bại',
          description: 'Chỉ được tải lên ảnh dưới 5 MB và ảnh phải có định dạng jpg, jpeg, png, webp',
          variant: 'destructive'
        })
      } else {
        setLoading_upload_image(false)
        setImage({
          image_cloud: '',
          image_custom: ''
        })
        toast({
          title: 'Thất bại',
          description: 'Lỗi khi tải ảnh lên, vui lòng thử lại sau ít phút',
          variant: 'default'
        })
      }
    } catch (error) {
      setLoading_upload_image(false)
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const uploadImageIngredient = async () => {
      const formData_icon = new FormData()
      formData_icon.append('file', file_image as Blob)
      try {
        await uploadImage(formData_icon, 'icon_res_category')
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    if (file_image && file_image !== previousFileImageRef.current) {
      previousFileImageRef.current = file_image
      uploadImageIngredient()
    }
    if (!file_image && file_image !== previousFileImageRef.current) {
      setImage({
        image_cloud: '',
        image_custom: ''
      })
    }
  }, [file_image])

  const calculateTotal = (items: IStockInItem[]) => {
    return items.reduce((total, item) => {
      return total + item.stki_item_quantity_real * item.stki_item_price
    }, 0)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (stockInItems.length === 0) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng thêm nguyên liệu cho hóa đơn nhập hàng',
        variant: 'destructive'
      })
      return
    }

    const stockInItemsClone = stockInItems.map((item) => {
      const { igd_name, unt_name, ...rest } = item
      return rest
    })

    const infor = inforRestaurant?._id ? inforRestaurant : inforEmployee
    let stki_receiver_type: 'employee' | 'restaurant' = 'employee'
    if (data.stki_receiver === infor.restaurant_id) {
      stki_receiver_type = 'restaurant'
    }
    setLoading(true)
    const payload = {
      stki_code: data.stki_code,
      spli_id: data.spli_id,
      stki_delivery_name: data.stki_delivery_name,
      stki_delivery_phone: data.stki_delivery_phone,
      stki_receiver: data.stki_receiver,
      stki_date: data.stki_date,
      stki_note: data.stki_note,
      stki_receiver_type: stki_receiver_type,
      stki_payment_method: data.stki_payment_method,
      stki_image: JSON.stringify(image),
      stock_in_items: stockInItemsClone
    }
    const res = id === 'add' ? await createStockIn(payload) : await updateStockIn({ ...payload, stki_id: id })
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description:
          id === 'add' ? 'Thêm hóa đơn nhập hàng mới thành công' : 'Chỉnh sửa thông tin hóa đơn nhập hàng thành công',
        variant: 'default'
      })
      router.push('/dashboard/stock-in')
      router.refresh()
    } else if (res.statusCode === 400) {
      setLoading(false)
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
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const createSupplierCom = async (name: string) => {
    const payload = {
      spli_name: name,
      spli_email: 'nhaphoadon@gmail.com',
      spli_phone: '0987654321',
      spli_address: 'Dữ liệu được nhập tự động từ file PDF',
      spli_description: 'Dữ liệu được nhập tự động từ file PDF',
      spli_type: 'supplier'
    } as any;
    // const res = await fetch('http://localhost:11000/api/v1/suppliers', {
    //   method: 'POST',
    //   headers: {
    //     'accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(payload)
    // });
    const res = await createSupplier(payload)
    if (res.statusCode === 201 && res.data) {
      setListSuppliers((prev: any) => [...prev, res.data]);
      return res.data.spli_id;
    }
  }

  // Hàm thêm mới unit
  const createUnitCom = async (name: string) => {
    const payload = {
      unt_name: name,
      unt_symbol: name.slice(0, 2).toLowerCase(), // Tạm lấy 2 ký tự đầu làm symbol
      unt_description: 'Dữ liệu được nhập tự động từ file PDF'
    };
    const res = await createUnit(payload)
    if (res.statusCode === 201 && res.data) {
      setListUnits(prev => [...prev, res.data]);
      return res.data.unt_id;
    }
  }

  const createCatIngredientCom = async () => {
    const payload = {
      cat_igd_name: "Danh mục từ nhập pdf",
      cat_igd_description: "Danh mục tự động tạo từ dữ liệu nhập PDF"
    };
    const res = await createCatIngredient(payload)
    if (res.statusCode === 201 && res.data) {
      setListCatIngredients(prev => [...prev, res.data]);
      return res.data.cat_igd_id;
    }
    return null;
  }

  const createIngredientCom = async (name: string, unitId: string, code: string) => {
    let catIgdId = '';
    const existingCat = listCatIngredients.find(cat =>
      cat.cat_igd_name.toLowerCase() === "danh mục từ nhập pdf"
    );

    if (existingCat) {
      catIgdId = existingCat.cat_igd_id;
    } else {
      catIgdId = await createCatIngredientCom() as string;
      if (!catIgdId) {
        toast({
          title: 'Cảnh báo',
          description: 'Không thể tạo danh mục nguyên liệu, sẽ dùng ID mặc định',
          variant: 'destructive'
        });
        catIgdId = 'e10673a0-dd00-443e-9fbc-e27b14eb7519'; // Dùng ID mặc định nếu tạo thất bại
      }
    }

    const payload = {
      cat_igd_id: catIgdId,
      unt_id: unitId,
      igd_name: name,
      igd_description: 'Dữ liệu được nhập tự động từ file PDF',
      igd_image: 'Dữ liệu được nhập tự động từ file PDF'
    };
    const res = await createIngredient(payload);
    console.log("🚀 ~ createIngredientCom ~ res:", res);
    if (res.statusCode === 201 && res.data) {
      setListIngredients((prev: any) => [...prev, res.data]);
      return res.data.igd_id;
    }
    return null;
  }

  // Hàm thêm mới ingredient
  // const createIngredientCom = async (name: string, unitId: string, code: string) => {
  //   const payload = {
  //     cat_igd_id: 'e10673a0-dd00-443e-9fbc-e27b14eb7519', // Gán cứng cat_igd_id
  //     unt_id: unitId,
  //     igd_name: name,
  //     igd_description: 'Dữ liệu được nhập tự động từ file PDF',
  //     igd_image: 'Dữ liệu được nhập tự động từ file PDF'
  //   };
  //   const res = await createIngredient(payload)
  //   console.log("🚀 ~ createIngredientCom ~ data:", res)
  //   if (res.statusCode === 201 && res.data) {
  //     setListIngredients((prev: any) => [...prev, res.data]);
  //     return res.data.igd_id;
  //   }
  // }

  const handleUploadPdf = async () => {
    if (!pdfFile) {
      toast({
        title: 'Thông báo',
        description: 'Vui lòng chọn file PDF trước khi tải lên',
        variant: 'destructive'
      })
      return
    }

    setIsUploadingPdf(true)
    const formData = new FormData()
    formData.append('file', pdfFile)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER_ORDER}/stock-in/import-pdf`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("🚀 ~ handleUploadPdf ~ result:", result)
        toast({
          title: 'Thành công',
          description: 'Tải file PDF và trích xuất dữ liệu thành công',
          variant: 'default'
        })

        const pdfData = result.data

        // Xử lý supplier
        let spliId = '';
        const supplier = listSuppliers.find((s: any) =>
          s.spli_name.toLowerCase().includes(pdfData.spli_id.toLowerCase())
        );
        if (supplier) {
          spliId = supplier.spli_id;
        } else {
          spliId = await createSupplierCom(pdfData.spli_id) as string;
          console.log("🚀 ~ handleUploadPdf ~ spliId:", spliId)
          if (!spliId) {
            toast({
              title: 'Cảnh báo',
              description: 'Không thể tạo nhà cung cấp mới, vui lòng kiểm tra',
              variant: 'destructive'
            });
          } else {
            form.setValue('spli_id', spliId)
          }
        }

        // Xử lý receiver
        let receiverId = '';
        const receiver = listEmployees.find(e =>
          e.epl_name.toLowerCase().includes(pdfData.stki_receiver.toLowerCase())
        );
        receiverId = receiver ? receiver._id : '';

        // Điền dữ liệu cơ bản vào form
        form.setValue('spli_id', spliId)
        form.setValue('stki_code', pdfData.stki_code || '');
        form.setValue('spli_id', spliId || '');
        form.setValue('stki_delivery_name', pdfData.stki_delivery_name || '');
        form.setValue('stki_delivery_phone', pdfData.stki_delivery_phone || '');
        form.setValue('stki_receiver', receiverId || '');
        form.setValue('stki_date', pdfData.stki_date ? new Date(pdfData.stki_date) : new Date());
        form.setValue('stki_note', pdfData.stki_note || '');
        form.setValue('stki_payment_method', pdfData.stki_payment_method || 'cash');

        // Xử lý stock_in_items
        if (pdfData.stock_in_items && pdfData.stock_in_items.length > 0) {
          const mappedItems = await Promise.all(pdfData.stock_in_items.map(async (item: any) => {
            // Xử lý unit
            let untId = '';
            const unit = listUnits.find(u =>
              u.unt_name.toLowerCase().includes(item.stki_item_unit.toLowerCase())
            );
            if (unit) {
              untId = unit.unt_id;
            } else if (item.stki_item_unit) {
              untId = await createUnitCom(item.stki_item_unit) as string;
              if (!untId) {
                toast({
                  title: 'Cảnh báo',
                  description: `Không thể tạo đơn vị tính "${item.stki_item_unit}", vui lòng kiểm tra`,
                  variant: 'destructive'
                });
              }
            }

            // Xử lý ingredient
            let igdId = '';
            const ingredient = listIngredients.find(i =>
              i.igd_name.toLowerCase().includes(item.stki_item_name.toLowerCase()) ||
              i.igd_id.toLowerCase() === item.stki_item_code.toLowerCase()
            );
            if (ingredient) {
              igdId = ingredient.igd_id;
            } else {
              igdId = await createIngredientCom(item.stki_item_name, untId, item.stki_item_code) as string;
              if (!igdId) {
                toast({
                  title: 'Cảnh báo',
                  description: `Không thể tạo nguyên liệu "${item.stki_item_name}", vui lòng kiểm tra`,
                  variant: 'destructive'
                });
              }
            }

            return {
              igd_id: igdId || item.stki_item_code,
              igd_name: item.stki_item_name,
              unt_name: item.stki_item_unit,
              stki_item_quantity_real: parseFloat(item.stki_item_quantity_real) || 0,
              stki_item_quantity: parseFloat(item.stki_item_quantity_real) || 0,
              stki_item_price: parseFloat(item.stki_item_price) || 0,
              stki_item_total: parseFloat(item.stki_item_total) || 0,
              stki_item_note: item.stki_item_note || ''
            };
          }));
          setStockInItems(mappedItems);
        }

        setPdfFile(null);
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Có lỗi xảy ra khi tải file PDF, vui lòng thử lại',
        variant: 'destructive'
      })
    } finally {
      setIsUploadingPdf(false)
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Tải lên file PDF</h3>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPdfFile(file);
            }}
            disabled={isUploadingPdf}
          />
          <Button
            type="button"
            onClick={handleUploadPdf}
            disabled={!pdfFile || isUploadingPdf}
          >
            {isUploadingPdf ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Đang tải
              </>
            ) : (
              'Tải lên'
            )}
          </Button>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel defaultSize={75} className='p-4'>
            <Select
              value={selectedIngredient?.igd_id}
              onValueChange={(e) => {
                const stockInItemsClone = [...stockInItems]
                const ingredient = listIngredients.find((item) => item.igd_id === e)
                if (!ingredient) return
                stockInItemsClone.push({
                  igd_id: ingredient.igd_id,
                  igd_name: ingredient.igd_name,
                  unt_name: typeof ingredient.unt_id !== 'string' ? ingredient.unt_id?.unt_name || '' : '',
                  stki_item_quantity: 0,
                  stki_item_quantity_real: 0,
                  stki_item_price: 0
                })
                // const listIngredientsClone = listIngredients.filter((item) => item.igd_id !== e)
                // setListIngredients(listIngredientsClone)
                setStockInItems(stockInItemsClone)
                setSelectedIngredient(null)
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn nguyên liệu...' />
              </SelectTrigger>
              <SelectContent>
                {listIngredients
                  .filter((ingredient) => stockInItems.every((item) => item.igd_id !== ingredient.igd_id))
                  .map((ingredient) => (
                    <SelectItem key={ingredient.igd_id} value={ingredient.igd_id}>
                      {ingredient.igd_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Table>
              <TableCaption>Danh sách nguyên liệu</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nguyên liệu</TableHead>
                  <TableHead>Đơn vị đo</TableHead>
                  <TableHead>Số lượng trên hóa đơn</TableHead>
                  <TableHead>Số lượng thực tế</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockInItems.map((stockInItem, index) => (
                  <TableRow key={index}>
                    <TableCell className='w-2/5'>
                      <div className='flex gap-2'>
                        <span
                          className='cursor-pointer text-red-500'
                          onClick={() => {
                            const updatedItems = [...stockInItems]
                            updatedItems.splice(index, 1)
                            setStockInItems(updatedItems)
                          }}
                        >
                          <TrashIcon size={17} />
                        </span>
                        <span>{stockInItem.igd_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stockInItem.unt_name}</TableCell>
                    <TableCell>
                      <InputNoBoder
                        value={stockInItem.stki_item_quantity}
                        type='number'
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) return
                          const updatedItems = [...stockInItems]
                          updatedItems[index].stki_item_quantity = Number(e.target.value)
                          setStockInItems(updatedItems)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNoBoder
                        value={stockInItem.stki_item_quantity_real}
                        type='number'
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) return
                          const updatedItems = [...stockInItems]
                          updatedItems[index].stki_item_quantity_real = Number(e.target.value)
                          setStockInItems(updatedItems)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNoBoder
                        value={stockInItem.stki_item_price}
                        type='number'
                        onChange={(e) => {
                          if (!e.target.value || Number(e.target.value) < 0) return
                          const updatedItems = [...stockInItems]
                          updatedItems[index].stki_item_price = Number(e.target.value)
                          setStockInItems(updatedItems)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {(stockInItem.stki_item_quantity_real * stockInItem.stki_item_price).toLocaleString()}đ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Tổng tiền: </TableCell>
                  <TableCell className='font-bold'>{calculateTotal(stockInItems).toLocaleString()}đ</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} className='p-4'>
            <div>
              <FormField
                control={form.control}
                name='stki_image'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Ảnh hóa đơn</FormLabel>
                    <FormControl>
                      <>
                        {!file_image && !image.image_cloud && (
                          <label htmlFor='dish_imagae'>
                            <div className='w-28 h-28 border border-dashed justify-center items-center cursor-pointer flex flex-col mt-3'>
                              <span>
                                <IoMdCloudUpload />
                              </span>
                              <span className='text-sm text-gray-500'>Chọn ảnh</span>
                            </div>
                          </label>
                        )}

                        <Input
                          className='hidden'
                          id='dish_imagae'
                          disabled={loading_upload_image ? true : false}
                          type='file'
                          accept='image/*'
                          ref={inputRef_Image}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFile_Image(file)
                              field.onChange(`${process.env.NEXT_PUBLIC_URL_CLIENT}/` + file?.name) //set thuoc tinh image
                            }
                          }}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(file_image || image.image_cloud) && (
                <div>
                  <Image
                    src={file_image ? URL.createObjectURL(file_image) : (image.image_cloud as string)}
                    alt='preview'
                    className='w-28 h-28 object-cover my-3'
                    width={128}
                    height={128}
                  />
                  <Button
                    type='button'
                    variant={'destructive'}
                    size={'sm'}
                    onClick={() => {
                      setFile_Image(null)
                      form.setValue('stki_image', '')
                      if (inputRef_Image.current) {
                        setImage({
                          image_cloud: '',
                          image_custom: ''
                        })
                        inputRef_Image.current.value = ''
                      }
                    }}
                    disabled={loading_upload_image}
                  >
                    {loading_upload_image ? (
                      <>
                        <ReloadIcon className='mr-2 h-4 w-4 animate-spin' /> Đang tải ảnh...
                      </>
                    ) : (
                      'Xóa hình hình ảnh'
                    )}
                  </Button>
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name='spli_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhà cung cấp</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn nhà cung cấp...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listSuppliers.map((supplier) => (
                        <SelectItem key={supplier.spli_id} value={supplier.spli_id}>
                          {supplier.spli_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã phiếu nhập</FormLabel>
                  <FormControl>
                    <Input placeholder='Mã phiếu nhập...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_delivery_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người giao hàng</FormLabel>
                  <FormControl>
                    <Input placeholder='Người giao hàng...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_delivery_phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại người giao hàng</FormLabel>
                  <FormControl>
                    <Input placeholder='Số điện thoại người giao hàng...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_receiver'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người nhận</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn người nhận...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listEmployees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.epl_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập ghi chú</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập ghi chú...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_payment_method'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương thức thanh toán</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn phương thức thanh toán...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='cash'>Tiền mặt</SelectItem>
                      <SelectItem value='transfer'>Chuyển khoản</SelectItem>
                      <SelectItem value='credit_card'>Thẻ tín dụng</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stki_date'
              render={({ field }) => (
                <FormItem className='flex flex-col mt-2'>
                  <FormLabel>Ngày nhập</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày nhập</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-center mt-3'>
              <Button disabled={loading_upload_image} type='submit'>
                {loading_upload_image ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang tải...
                  </>
                ) : id === 'add' ? (
                  'Thêm mới'
                ) : (
                  'Chỉnh sửa'
                )}
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
    </Form>
  )
}
