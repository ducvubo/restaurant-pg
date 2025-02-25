import { NextResponse } from 'next/server'
import { Buffer } from 'buffer'
import { genSignEndPoint } from '@/app/utils'
import { cookies } from 'next/headers'

export const POST = async (req: any) => {
  try {
    const { nonce, sign, stime, version } = genSignEndPoint()
    const header = req.headers
    const cookie = cookies()
    const type = header.get('type') || ''

    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const formDataToSend = new FormData()
    formDataToSend.append('file', new Blob([buffer]), file.name)

    const access_token_rtr = cookie.get('access_token_rtr')?.value
    const refresh_token_rtr = cookie.get('refresh_token_rtr')?.value

    const access_token_epl = cookie.get('access_token_epl')?.value
    const refresh_token_epl = cookie.get('refresh_token_epl')?.value

    let headerReq: any = {}

    if (access_token_rtr && refresh_token_rtr) {
      headerReq = {
        nonce,
        sign,
        stime,
        version,
        'x-at-rtr': `Bearer ${access_token_rtr}`,
        'x-rf-rtr': `Bearer ${refresh_token_rtr}`
      }
    }

    if (access_token_epl && refresh_token_epl) {
      headerReq = {
        nonce,
        sign,
        stime,
        version,
        'x-at-epl': `Bearer ${access_token_epl}`,
        'x-rf-epl': `Bearer ${refresh_token_epl}`
      }
    }

    const response = await fetch(`${process.env.URL_SERVER_BLOG}/uploads/${type}`, {
      method: 'POST',
      headers: headerReq,
      body: formDataToSend
    })
    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: result.statusCode
    })
  } catch (error) {
    console.log('Error occurred:', error)
    return NextResponse.json({ Message: 'Failed', status: 500 })
  }
}
