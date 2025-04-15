// 'use client'
// import * as React from 'react'
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   useReactTable,
//   SortingState,
//   getSortedRowModel,
//   ColumnFiltersState,
//   getFilteredRowModel,
//   VisibilityState
// } from '@tanstack/react-table'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { usePathname, useRouter } from 'next/navigation'
// import { DataTableViewOptions } from '@/components/ColumnToggle'
// import { DataTablePagination } from '@/components/PaginationTable'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import { IDish } from '../dishes.interface'
// import { getAllDishRestaurant } from '../dishes.api'
// import { toast } from '@/hooks/use-toast'
// import { useLoading } from '@/context/LoadingContext'
// import { deleteCookiesAndRedirect } from '@/app/actions/action'
// import { useEffect, useState } from 'react'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   meta: {
//     current: number
//     pageSize: number
//     totalPage: number
//     totalItem: number
//   }
// }

// export function PageDishes<TData, TValue>({ columns, meta, data }: DataTableProps<TData, TValue>) {
//   const { setLoading } = useLoading()
//   const router = useRouter()
//   const pathname = usePathname().split('/').pop()
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

//   const [listDish, setListDish] = useState<IDish[]>([])
//   console.log("🚀 ~ listDish:", listDish)

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility
//     }
//   })

//   const getListDish = async () => {
//     const res: IBackendRes<IDish[]> = await getAllDishRestaurant()
//     console.log("🚀 ~ getListDish ~ res:", res)
//     if (res.statusCode === 200 && res.data) {
//       setListDish(res.data)
//     } else if (res.code === -10) {
//       toast({
//         title: 'Thông báo',
//         description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
//         variant: 'destructive'
//       })
//       await deleteCookiesAndRedirect()
//     } else if (res.code === -11) {
//       setLoading(false)
//       toast({
//         title: 'Thông báo',
//         description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
//         variant: 'destructive'
//       })
//     } else {
//       setLoading(false)
//       toast({
//         title: 'Thất bại',
//         description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//         variant: 'destructive'
//       })
//     }
//   }

//   const [pageIndex, setPageIndex] = React.useState(meta.current)
//   const [pageSize, setPageSize] = React.useState(meta.pageSize)

//   const handlePageChange = (index: number, size: number) => {
//     if (pageIndex !== index || size !== pageSize) {
//       setPageIndex(index)
//       setPageSize(size)
//     }
//   }

//   React.useEffect(() => {
//     router.push(`/dashboard/dishes/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`)
//   }, [pageIndex, pageSize, router])

//   return (
//     <div className='flex flex-col' style={{ height: 'calc(100vh - 7rem)' }}>
//       <div className='flex justify-end gap-2 items-center py-4'>
//         <Button variant={'outline'}>
//           <Link href={'/dashboard/dishes/add'}>Thêm</Link>
//         </Button>
//         <Button variant={'outline'}>
//           <Link href={'/dashboard/dishes/recycle'}>Danh sách đã xóa</Link>
//         </Button>
//         <DataTableViewOptions table={table} />
//       </div>
//       <div className='rounded-md border flex-1 overflow-hidden'>
//         {/* Container for the table with fixed height */}
//         <div className='overflow-y-auto h-full'>
//           <Table className='min-w-full'>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id} className='h-[45px]'>
//                   {/* Giảm chiều cao hàng */}
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id} className='py-[5px] '>
//                       {/* Giảm padding trong header */}
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id} className='h-10'>
//                     {/* Giảm chiều cao hàng */}
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id} className='py-[5px]'>
//                         {/* Giảm padding trong ô */}
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow className='h-8'>
//                   <TableCell colSpan={columns.length} className='h-24 text-center'>
//                     Không có dữ liệu!!!
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       <div className='flex items-center justify-end space-x-2 py-4'>
//         <DataTablePagination
//           table={table}
//           meta={meta}
//           onPageChange={(pageIndex, pageSize) => handlePageChange(pageIndex + 1, pageSize)}
//         />
//       </div>
//     </div>
//   )
// }


// 'use client';
// import * as React from 'react';
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   useReactTable,
//   SortingState,
//   getSortedRowModel,
//   ColumnFiltersState,
//   getFilteredRowModel,
//   VisibilityState,
// } from '@tanstack/react-table';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { usePathname, useRouter } from 'next/navigation';
// import { DataTableViewOptions } from '@/components/ColumnToggle';
// import { DataTablePagination } from '@/components/PaginationTable';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { IDish } from '../dishes.interface';
// import { getAllDishRestaurant } from '../dishes.api';
// import { toast } from '@/hooks/use-toast';
// import { useLoading } from '@/context/LoadingContext';
// import { deleteCookiesAndRedirect } from '@/app/actions/action';
// import { useEffect, useState, ChangeEvent } from 'react';

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   meta: {
//     current: number;
//     pageSize: number;
//     totalPage: number;
//     totalItem: number;
//   };
// }

// export function PageDishes<TData, TValue>({ columns, data, meta }: DataTableProps<TData, TValue>) {
//   const { setLoading } = useLoading();
//   const router = useRouter();
//   const pathname = usePathname().split('/').pop();
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   // const [listDish, setListDish] = useState<IDish[]>([]);
//   const [pageIndex, setPageIndex] = React.useState(meta.current);
//   const [pageSize, setPageSize] = React.useState(meta.pageSize);

//   const getListDish = async () => {
//     const res: IBackendRes<IDish[]> = await getAllDishRestaurant();
//     if (res.statusCode === 200 && res.data) {
//       return res.data;
//     } else if (res.code === -10) {
//       toast({
//         title: 'Thông báo',
//         description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
//         variant: 'destructive',
//       });
//       await deleteCookiesAndRedirect();
//       return [];
//     } else if (res.code === -11) {
//       toast({
//         title: 'Thông báo',
//         description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
//         variant: 'destructive',
//       });
//       return [];
//     } else {
//       toast({
//         title: 'Thất bại',
//         description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//         variant: 'destructive',
//       });
//       return [];
//     }
//   };

//   const handleImportMenu = async (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) {
//       toast({
//         title: 'Thất bại',
//         description: 'Vui lòng chọn một file ảnh để import',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       const response = await fetch('http://localhost:5001/api/v1/dishes/import-menu-image', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           accept: '*/*',
//         },
//       });

//       const result: IBackendRes<IDish[]> = await response.json();

//       if (result.statusCode === 201 && result.data) {
//         const listDish = await getListDish();
//         const newDishes: any[] = [];
//         result.data.forEach((dish: IDish) => {
//           const exists = listDish.some(
//             (existingDish) => existingDish.dish_name.toLowerCase() === dish.dish_name.toLowerCase()
//           );
//           if (!exists) {
//             newDishes.push({
//               dish_name: dish.dish_name || '-',
//               dish_image: {
//                 image_cloud: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png',
//                 image_custom: '/api/view-image?bucket=default&file=z6421112010455_6b4f24e676211cf8fd442b7e472a343f.png'
//               },
//               dish_price: dish.dish_price || 0,
//               dish_priority: dish.dish_priority || 0,
//               dish_note: dish.dish_note || '-',
//               dish_short_description: dish.dish_short_description || '-',
//               dish_description: dish.dish_description || '-',
//             });
//           }
//         });

//         console.log('Danh sách món ăn mới (chưa có trong getListDish):', newDishes);

//         toast({
//           title: 'Thành công',
//           description: `Đã bóc tách được ${result.data.length} món, trong đó có ${newDishes.length} món mới`,
//         });
//       } else {
//         toast({
//           title: 'Thất bại',
//           description: result.message || 'Đã có lỗi xảy ra khi import thực đơn',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: 'Thất bại',
//         description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//       event.target.value = ''; // Reset input file sau khi upload
//     }
//   };

//   // useEffect(() => {
//   //   getListDish();
//   // }, []);

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//     },
//   });

//   const handlePageChange = (index: number, size: number) => {
//     if (pageIndex !== index || size !== pageSize) {
//       setPageIndex(index);
//       setPageSize(size);
//     }
//   };

//   React.useEffect(() => {
//     router.push(`/dashboard/dishes/${pathname === 'recycle' ? 'recycle' : ''}?page=${pageIndex}&size=${pageSize}`);
//   }, [pageIndex, pageSize, router, pathname]);

//   return (
//     <div className="flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
//       <div className="flex justify-end gap-2 items-center py-4">
//         <Button variant={'outline'}>
//           <Link href={'/dashboard/dishes/add'}>Thêm</Link>
//         </Button>
//         <Button variant={'outline'}>
//           <Link href={'/dashboard/dishes/recycle'}>Danh sách đã xóa</Link>
//         </Button>
//         <Button variant={'outline'} asChild>
//           <label>
//             Import Menu
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImportMenu}
//               style={{ display: 'none' }}
//             />
//           </label>
//         </Button>
//         <DataTableViewOptions table={table} />
//       </div>
//       <div className="rounded-md border flex-1 overflow-hidden">
//         <div className="overflow-y-auto h-full">
//           <Table className="min-w-full">
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id} className="h-[45px]">
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id} className="py-[5px]">
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id} className="h-10">
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id} className="py-[5px]">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow className="h-8">
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     Không có dữ liệu!!!
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <DataTablePagination
//           table={table}
//           meta={meta}
//           onPageChange={(pageIndex, pageSize) => handlePageChange(pageIndex + 1, pageSize)}
//         />
//       </div>
//     </div>
//   );
// }