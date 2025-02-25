import { NextResponse } from 'next/server'
// Hàm xử lý POST request
export async function POST(request: Request) {
  // await deleteCookiesAndRedirect()

  // Xóa cookie bằng cách thiết lập ngày hết hạn trong quá khứ
  const accessCookie_rtr = `access_token_rtr=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`
  const refreshCookie_rtr = `refresh_token_rtr=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`
  const accessCookie_epl = `access_token_epl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`
  const refreshCookie_epl = `refresh_token_epl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`

  const responseHeaders = new Headers()
  responseHeaders.append('Set-Cookie', accessCookie_rtr)
  responseHeaders.append('Set-Cookie', refreshCookie_rtr)
  responseHeaders.append('Set-Cookie', accessCookie_epl)
  responseHeaders.append('Set-Cookie', refreshCookie_epl)

  return new NextResponse(JSON.stringify({ message: 'Unauthorized', statusCode: 403 }), {
    status: 403,
    headers: responseHeaders
  })
}
