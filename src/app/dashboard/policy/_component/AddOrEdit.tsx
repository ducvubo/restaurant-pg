'use client'
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form, FormDescription } from '@/components/ui/form'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { IPolicy } from '../policy.interface'
import { createPolicy, updatePolicy } from '../policy.api'
import { permissions } from '../policy'

interface Props {
  id: string
  inforPolicy?: IPolicy
}
const FormSchema = z.object({
  poly_name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
  poly_description: z.string().optional(),
})

export default function AddOrEdit({ id, inforPolicy }: Props) {
  console.log("🚀 ~ AddOrEdit ~ inforPolicy:", inforPolicy)
  const { setLoading } = useLoading()
  const router = useRouter()
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(new Set());
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      poly_name: '',
      poly_description: '',
    }
  })

  useEffect(() => {
    if (id === 'add') {
      return
    } else {
      if (inforPolicy) {

        form.setValue('poly_name', inforPolicy.poly_name)
        form.setValue('poly_description', inforPolicy.poly_description)
        const selectedKeys = inforPolicy.poly_key || [];
        setCheckedPermissions(new Set(selectedKeys));
        const initialOpenModules = permissions
          .filter(module => module.functions.some(func => func.actions.some(action => selectedKeys.includes(`${func.key}_${action.key}`))))
          .map(module => module.key);
        setOpenModules(initialOpenModules);
      }
    }
  }, [inforPolicy, id])

  const toggleModule = (key: string) => {
    setOpenModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCheckboxChange = (actionKey: string) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(actionKey)) {
        newSet.delete(actionKey);
      } else {
        newSet.add(actionKey);
      }
      return newSet;
    });
  };


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const selectedKeys = Array.from(checkedPermissions);
    const payload: any = {
      poly_name: data.poly_name,
      poly_description: data.poly_description,
      poly_key: selectedKeys,
    }
    console.log("🚀 ~ onSubmit ~ payload:", payload)

    const res = id === 'add' ? await createPolicy(payload) : await updatePolicy({ ...payload, _id: id })

    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm quyền chức năng mới thành công' : 'Chỉnh sửa thông tin quyền chức năng thành công',
        variant: 'default'
      })
      router.push('/dashboard/policy')
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



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name='poly_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên quyền chức năng</FormLabel>
                <FormControl>
                  <Input placeholder='Tên quyền chức năng...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='poly_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input placeholder='Mô tả...' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-700">
          {permissions.map((module) => (
            <Collapsible
              key={module.key}
              open={openModules.includes(module.key)}
              onOpenChange={() => toggleModule(module.key)}
              className="mb-2"
            >
              <CollapsibleTrigger
                className="flex items-center justify-between w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{module.name}</span>
                {openModules.includes(module.key) ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                {module.functions.map((func) => (
                  <div key={func.key} className="ml-4 p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{func.name}</div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {func.actions.map((action) => {
                        const actionKey = `${func.key}_${action.key}`
                        return (
                          <div key={actionKey} className="flex items-center space-x-2">
                            <Checkbox
                              id={actionKey}
                              checked={checkedPermissions.has(actionKey)}
                              onCheckedChange={() => handleCheckboxChange(actionKey)}
                              className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                            />
                            <label
                              htmlFor={actionKey}
                              className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                            >
                              {action.method}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <Button type='submit'>{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}
