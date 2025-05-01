'use server'

import { sendRequest } from '@/lib/api'
import { IInternalProposal } from './internal-proposal.interface'

const URL_SERVER_USER = process.env.URL_SERVER_USER

export const createInternalProposal = async (payload: Partial<IInternalProposal>) => {
  const res: IBackendRes<IInternalProposal> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-proposal`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getAllInternalProposals = async ({
  current,
  pageSize,
  type,
  ItnProposalTitle
}: {
  current: string
  pageSize: string,
  ItnProposalTitle: string,
  type: 'all' | 'recycle'
}) => {
  const url =
    type === 'all'
      ? `${URL_SERVER_USER}/internal-proposal`
      : `${URL_SERVER_USER}/internal-proposal/recycle`
  const res: IBackendRes<IModelPaginate<IInternalProposal>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex: current,
      pageSize,
      ItnProposalTitle
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const findInternalProposalById = async ({ itn_proposal_id }: { itn_proposal_id: string }) => {
  const res: IBackendRes<IInternalProposal> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-proposal/${itn_proposal_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const updateInternalProposal = async (payload: Partial<IInternalProposal>) => {
  const res: IBackendRes<IInternalProposal> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-proposal`,
    method: 'PATCH',
    body: payload
  })

  return res
}

export const deleteInternalProposal = async ({ itn_proposal_id }: { itn_proposal_id: string }) => {
  const res: IBackendRes<IInternalProposal> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-proposal/${itn_proposal_id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreInternalProposal = async ({ itn_proposal_id }: { itn_proposal_id: string }) => {
  const res: IBackendRes<IInternalProposal> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-proposal/restore/${itn_proposal_id}`,
    method: 'PATCH'
  })

  return res
}

export const updateStatusInternalProposal = async (payload: {
  itn_proposal_id: string
  itn_proposal_status: 'pending' | 'approved' | 'rejected'
}) => {
  const res: IBackendRes<IInternalProposal> = await sendRequest({
    url: `${URL_SERVER_USER}/internal-proposal/update-status`,
    method: 'PATCH',
    body: payload
  })
  console.log("🚀 ~ res:", res)
  return res
}