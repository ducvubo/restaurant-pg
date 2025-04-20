'use server'

import { sendRequest } from "@/lib/api"
import { ILeaveApplication } from "./leave-application.interface"

export const createLeaveApplication = async (data: Partial<ILeaveApplication>) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application`,
    method: 'POST',
    body: data,
  })
  return res
}

export const updateLeaveApplication = async (data: Partial<ILeaveApplication>) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application`,
    method: 'PATCH',
    body: data,
  })
  return res
}

export const deleteLeaveApplication = async (id: string) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/${id}`,
    method: 'DELETE',
  })
  return res
}

export const getInforLeaveApplicationWithEmployee = async (id: string) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/get-with-employee/${id}`,
    method: 'GET',
  })
  return res
}

export const getLeaveApplicationWithRestaurant = async (id: string) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/get-with-restaurant/${id}`,
    method: 'GET',
  })
  return res
}

export const getAllLeaveApplicationWithEmployee = async ({
  leaveType, pageIndex, pageSize, status
}: {
  pageIndex?: number
  pageSize?: number
  leaveType?: string
  status?: string
}) => {
  const res: IBackendRes<IModelPaginate<ILeaveApplication>> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/get-all-with-employee`,
    method: 'GET',
    queryParams:
    {
      pageIndex: pageIndex || 1,
      pageSize: pageSize || 10,
      leaveType: leaveType || undefined,
      status: status || undefined,
    },
  })
  return res
}

export const getAllLeaveApplication = async ({
  leaveType, pageIndex, pageSize, status,
  type
}: {
  pageIndex?: number
  pageSize?: number
  leaveType?: string
  status?: string
  type: 'restaurant' | 'employee'
}) => {
  console.log("🚀 ~ type:", type)
  const url = type === 'restaurant' ? `${process.env.URL_SERVER_EMPLOYEE}/leave-application/get-all-with-restaurant` : `${process.env.URL_SERVER_EMPLOYEE}/leave-application/get-all-with-employee`
  const res: IBackendRes<IModelPaginate<ILeaveApplication>> = await sendRequest({
    url: url,
    method: 'GET',
    queryParams:
    {
      pageIndex: pageIndex || 1,
      pageSize: pageSize || 10,
      leaveType: leaveType || undefined,
      status: status || undefined,
    },
  })
  return res
}

export const sendLeaveApplication = async (id: string) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/send/${id}`,
    method: 'PATCH',
  })
  return res
}

export const approveLeaveApplication = async (data: {
  leaveAppId: string
  approvalComment?: string
}) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/approve`,
    method: 'PATCH',
    body: data,
  })
  return res
}

export const rejectLeaveApplication = async (data: {
  leaveAppId: string
  approvalComment?: string
}) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/reject`,
    method: 'PATCH',
    body: data,
  })
  return res
}

export const cancelLeaveApplication = async (id: string) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/cancel/${id}`,
    method: 'PATCH',
  })
  return res
}

export const deleteLeaveApplicationWithEmployee = async (id: string) => {
  const res: IBackendRes<ILeaveApplication> = await sendRequest({
    url: `${process.env.URL_SERVER_EMPLOYEE}/leave-application/${id}`,
    method: 'DELETE',
  })
  return res
}
