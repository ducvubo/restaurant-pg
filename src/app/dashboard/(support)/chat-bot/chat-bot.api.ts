'use server'

import { sendRequest } from "@/lib/api"
import { IChatBot } from "./chat-bot.interface"

export const getAllPaginationMessageChatBot = async ({
  current,
  pageSize,
  message
}: {
  current: string
  pageSize: string
  message: string
}) => {
  console.log("🚀 ~ message:", message)
  const res: IBackendRes<IModelPaginate<IChatBot>> = await sendRequest({
    url: `${process.env.URL_SERVER}/chat-bot/get-all-conversation`,
    method: 'GET',
    queryParams: {
      current,
      pageSize,
      message: ''
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}