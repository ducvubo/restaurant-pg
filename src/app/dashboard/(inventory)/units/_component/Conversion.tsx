'use client'

import React from 'react'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'
import { IUnit } from '../unit.interface'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Plus, Trash } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  inforUnit: IUnit
}

const FormSchema = z.object({
  fields: z.array(
    z.object({
      email: z
        .string({
          required_error: 'Please select an email to display.'
        })
        .email('Invalid email address.'),
      role: z
        .string({
          required_error: 'Please select a role.'
        })
        .nonempty('Role is required.'),
      description: z
        .string({
          required_error: 'Please provide a description.'
        })
        .min(5, 'Description must be at least 5 characters long.')
    })
  )
})

export default function Conversion({ inforUnit }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fields: [{ email: '', role: '', description: '' }]
    }
  })

  const { control, handleSubmit } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role='menuitem'
          className='relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer'
          data-orientation='vertical'
          data-radix-collection-item=''
        >
          Quy đổi
        </div>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Quy đổi đơn vị</DialogTitle>
        </DialogHeader>
        <div className='max-h-80'>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <ScrollArea className='h-64 px-4'>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <FormField
                      control={control}
                      name={`fields.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select an email' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='m@example.com'>m@example.com</SelectItem>
                              <SelectItem value='m@google.com'>m@google.com</SelectItem>
                              <SelectItem value='m@support.com'>m@support.com</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`fields.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select a role' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='admin'>Admin</SelectItem>
                              <SelectItem value='user'>User</SelectItem>
                              <SelectItem value='guest'>Guest</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`fields.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter description' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='mt-9 flex'>
                      {fields.length > 1 && (
                        <span className='cursor-pointer' onClick={() => remove(index)}>
                          <Trash />
                        </span>
                      )}
                      <span className='cursor-pointer' onClick={() => append({ email: '', role: '', description: '' })}>
                        <Plus />
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <Button type='submit'>Lưu</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
