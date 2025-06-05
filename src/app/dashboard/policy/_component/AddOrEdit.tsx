'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useRouter } from 'next/navigation'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { IPolicy, Module, ModuleFunction } from '../policy.interface'
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
  const { setLoading } = useLoading()
  const router = useRouter()
  const [openModules, setOpenModules] = useState<string[]>([])
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(new Set())

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      poly_name: '',
      poly_description: '',
    },
  })

  useEffect(() => {
    if (id === 'add') return
    if (inforPolicy) {
      form.setValue('poly_name', inforPolicy.poly_name)
      form.setValue('poly_description', inforPolicy.poly_description)
      const selectedKeys = inforPolicy.poly_key || []
      const newCheckedPermissions = new Set<string>(selectedKeys)

      // Add module and function keys if any child actions are selected
      permissions.forEach((module) => {
        const hasSelectedActions = module.functions.some((func) =>
          func.actions.some((action) => selectedKeys.includes(`${func.key}_${action.key}`))
        )
        if (hasSelectedActions) {
          newCheckedPermissions.add(module.key)
          module.functions.forEach((func) => {
            if (func.actions.some((action) => selectedKeys.includes(`${func.key}_${action.key}`))) {
              newCheckedPermissions.add(func.key)
            }
          })
        }
      })

      setCheckedPermissions(newCheckedPermissions)
      const initialOpenModules = permissions
        .filter((module) =>
          module.functions.some((func) =>
            func.actions.some((action) => selectedKeys.includes(`${func.key}_${action.key}`))
          )
        )
        .map((module) => module.key)
      setOpenModules(initialOpenModules)
    }
  }, [inforPolicy, id, form])

  const toggleModule = (key: string) => {
    setOpenModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // Check if a function is checked (either its key is present or any action is checked)
  const isFunctionChecked = (func: ModuleFunction) => {
    return (
      checkedPermissions.has(func.key) ||
      func.actions.some((action) => checkedPermissions.has(`${func.key}_${action.key}`))
    )
  }

  // Check if a module is checked (either its key is present or any function is checked)
  const isModuleChecked = (module: Module) => {
    return (
      checkedPermissions.has(module.key) ||
      module.functions.some((func) => isFunctionChecked(func))
    )
  }

  // Handle module checkbox change
  const handleModuleCheckboxChange = (module: Module) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev)
      const allActionKeys = module.functions.flatMap((func) =>
        func.actions.map((action) => `${func.key}_${action.key}`)
      )
      const allFunctionKeys = module.functions.map((func) => func.key)
      const isCurrentlyChecked = isModuleChecked(module)

      if (isCurrentlyChecked) {
        // Uncheck module, its functions, and actions
        newSet.delete(module.key)
        allFunctionKeys.forEach((key) => newSet.delete(key))
        allActionKeys.forEach((key) => newSet.delete(key))
      } else {
        // Check module, its functions, and actions
        newSet.add(module.key)
        allFunctionKeys.forEach((key) => newSet.add(key))
        allActionKeys.forEach((key) => newSet.add(key))
      }
      return newSet
    })
  }

  // Handle function checkbox change
  const handleFunctionCheckboxChange = (func: ModuleFunction) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev)
      const actionKeys = func.actions.map((action) => `${func.key}_${action.key}`)
      const isCurrentlyChecked = isFunctionChecked(func)

      if (isCurrentlyChecked) {
        // Uncheck function and its actions
        newSet.delete(func.key)
        actionKeys.forEach((key) => newSet.delete(key))
      } else {
        // Check function and its actions
        newSet.add(func.key)
        actionKeys.forEach((key) => newSet.add(key))
      }

      // Update parent module key based on function states
      const parentModule = permissions.find((module) =>
        module.functions.some((f) => f.key === func.key)
      )
      if (parentModule) {
        const anyFunctionChecked = parentModule.functions.some((f) => isFunctionChecked(f))
        if (anyFunctionChecked) {
          newSet.add(parentModule.key)
        } else {
          newSet.delete(parentModule.key)
        }
      }

      return newSet
    })
  }

  // Handle action checkbox change
  const handleActionCheckboxChange = (actionKey: string) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev)
      const [funcKey] = actionKey.split('_')
      if (newSet.has(actionKey)) {
        newSet.delete(actionKey)
      } else {
        newSet.add(actionKey)
      }

      // Update parent function key
      const parentModule = permissions.find((module) =>
        module.functions.some((func) => func.key === funcKey)
      )
      if (parentModule) {
        const parentFunction = parentModule.functions.find((func) => func.key === funcKey)
        if (parentFunction) {
          const anyActionChecked = parentFunction.actions.some((action) =>
            newSet.has(`${funcKey}_${action.key}`)
          )
          if (anyActionChecked) {
            newSet.add(parentFunction.key)
          } else {
            newSet.delete(parentFunction.key)
          }
        }

        // Update parent module key
        const anyFunctionChecked = parentModule.functions.some((func) => isFunctionChecked(func))
        if (anyFunctionChecked) {
          newSet.add(parentModule.key)
        } else {
          newSet.delete(parentModule.key)
        }
      }

      return newSet
    })
  }

  // async function onSubmit(data: z.infer<typeof FormSchema>) {
  //   setLoading(true)
  //   const selectedKeys = Array.from(checkedPermissions)
  //   const payload: any = {
  //     poly_name: data.poly_name,
  //     poly_description: data.poly_description,
  //     poly_key: selectedKeys,
  //   }
  //   console.log("🚀 ~ onSubmit ~ payload:", payload)

  //   const res = id === 'add' ? await createPolicy(payload) : await updatePolicy({ ...payload, _id: id })

  //   if (res.statusCode === 201 || res.statusCode === 200) {
  //     setLoading(false)
  //     toast({
  //       title: 'Thành công',
  //       description: id === 'add' ? 'Thêm quyền chức năng mới thành công' : 'Chỉnh sửa thông tin quyền chức năng thành công',
  //       variant: 'default',
  //     })
  //     router.push('/dashboard/policy')
  //     router.refresh()
  //   } else if (res.statusCode === 400) {
  //     setLoading(false)
  //     if (Array.isArray(res.message)) {
  //       res.message.map((item: string) => {
  //         toast({
  //           title: 'Thất bại',
  //           description: item,
  //           variant: 'destructive',
  //         })
  //       })
  //     } else {
  //       toast({
  //         title: 'Thất bại',
  //         description: res.message,
  //         variant: 'destructive',
  //       })
  //     }
  //   } else if (res.code === -10) {
  //     setLoading(false)
  //     toast({
  //       title: 'Thông báo',
  //       description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  //       variant: 'destructive',
  //     })
  //     await deleteCookiesAndRedirect()
  //   } else if (res.code === -11) {
  //     setLoading(false)
  //     toast({
  //       title: 'Thông báo',
  //       description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
  //       variant: 'destructive',
  //     })
  //   } else {
  //     setLoading(false)
  //     toast({
  //       title: 'Thông báo',
  //       description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  //       variant: 'destructive',
  //     })
  //   }
  //   setLoading(false)
  // }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const selectedKeys: string[] = [];
    const selectedPaths: string[] = [];

    // Thu thập các key bằng forEach
    checkedPermissions.forEach((key) => {
      selectedKeys.push(key);
    });

    permissions.forEach((module) => {
      module.functions.forEach((func) => {
        func.actions.forEach((action) => {
          const actionKey = `${func.key}_${action.key}`;
          if (checkedPermissions.has(actionKey)) {
            selectedPaths.push(...action.patchRequire);
          }
        });
      });
    });

    const uniquePaths = Array.from(new Set(selectedPaths));

    const payload: any = {
      poly_name: data.poly_name,
      poly_description: data.poly_description,
      poly_key: selectedKeys,
      poly_path: uniquePaths, // Thêm danh sách paths vào payload
    };
    console.log("🚀 ~ onSubmit ~ payload:", payload);

    const res = id === 'add' ? await createPolicy(payload) : await updatePolicy({ ...payload, _id: id });

    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false);
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm quyền chức năng mới thành công' : 'Chỉnh sửa thông tin quyền chức năng thành công',
        variant: 'default',
      });
      router.push('/dashboard/policy');
      router.refresh();
    } else if (res.statusCode === 400) {
      setLoading(false);
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
            variant: 'destructive',
          });
        });
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive',
        });
      }
    } else if (res.code === -10) {
      setLoading(false);
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive',
      });
      await deleteCookiesAndRedirect();
    } else if (res.code === -11) {
      setLoading(false);
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive',
      });
    } else {
      setLoading(false);
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="poly_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên quyền chức năng</FormLabel>
                <FormControl>
                  <Input placeholder="Tên quyền chức năng..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poly_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input placeholder="Mô tả..." {...field} />
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`module_${module.key}`}
                    checked={isModuleChecked(module)}
                    onCheckedChange={() => handleModuleCheckboxChange(module)}
                    onClick={(e) => e.stopPropagation()}
                    className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                  />
                  <label
                    htmlFor={`module_${module.key}`}
                    className="text-lg font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {module.name}
                  </label>
                </div>
                {openModules.includes(module.key) ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                {module.functions.map((func) => (
                  <div key={func.key} className="ml-4 p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`func_${func.key}`}
                        checked={isFunctionChecked(func)}
                        onCheckedChange={() => handleFunctionCheckboxChange(func)}
                        onClick={(e) => e.stopPropagation()}
                        className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                      />
                      <label
                        htmlFor={`func_${func.key}`}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {func.name}
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 ml-6">
                      {func.actions.map((action) => {
                        const actionKey = `${func.key}_${action.key}`
                        return (
                          <div key={actionKey} className="flex items-center space-x-2">
                            <Checkbox
                              id={actionKey}
                              checked={checkedPermissions.has(actionKey)}
                              onCheckedChange={() => handleActionCheckboxChange(actionKey)}
                              onClick={(e) => e.stopPropagation()}
                              className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                            />
                            <label
                              htmlFor={actionKey}
                              className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
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
        <Button type="submit">{id === 'add' ? 'Thêm mới' : 'Chỉnh sửa'}</Button>
      </form>
    </Form>
  )
}