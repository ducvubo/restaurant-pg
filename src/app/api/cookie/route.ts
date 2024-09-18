import { NextResponse } from 'next/server'
// Hàm xử lý POST request
export async function POST(request: Request) {
  // await deleteCookiesAndRedirect()

  // Xóa cookie bằng cách thiết lập ngày hết hạn trong quá khứ
  const accessCookie = `access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`
  const refreshCookie = `refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`

  const responseHeaders = new Headers()
  responseHeaders.append('Set-Cookie', accessCookie)
  responseHeaders.append('Set-Cookie', refreshCookie)

  return new NextResponse(JSON.stringify({ message: 'Unauthorized', statusCode: 403 }), {
    status: 403,
    headers: responseHeaders
  })
}
