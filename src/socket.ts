import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (token: string, type: string, refresh_token = '') => {
  if (socket) {
    socket.disconnect()
  }

  socket = io(process.env.NEXT_PUBLIC_URLAPI_ENDPOINT, {
    auth: {
      authorization: 'Bearer ' + token,
      refresh_token: 'Bearer ' + refresh_token,
      type: type
    }
  })

  socket.on('connect', () => {
    console.log('Connected to socket:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket', reason)
  })

  return socket
}
