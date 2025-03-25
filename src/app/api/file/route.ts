import { NextResponse } from 'next/server'
import { Buffer } from 'buffer'
import { genSignEndPoint } from '@/app/utils'

export const POST = async (req: any) => {
  try {
    const { nonce, sign, stime, version } = genSignEndPoint()
    const header = req.headers
    const folder_type = header.get('folder_type') || ''
    const formData = await req.formData()
    const file = formData.get('upload')
    console.log("🚀 ~ POST ~ file:", file)
    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const formDataToSend = new FormData()
    formDataToSend.append('file', new Blob([buffer]), file.name)
    const response = await fetch(`${process.env.URL_SERVER_INVENTORY}/upload/file`, {
      method: 'POST',
      headers: {
        folder_type,
        nonce,
        sign,
        stime,
        version
      },
      body: formDataToSend
    })
    console.log("🚀 ~ POST ~ response:", response)
    const result = await response.json()
    console.log("🚀 ~ POST ~ result:", result)
    return new Response(JSON.stringify(result), {
      status: result.statusCode
    })
  } catch (error) {
    console.log('Error occurred:', error)
    return NextResponse.json({ Message: 'Failed', status: 500 })
  }
}
