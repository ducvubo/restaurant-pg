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
    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const formDataToSend = new FormData()
    formDataToSend.append('file', new Blob([buffer]), file.name)
    const response = await fetch(`${process.env.URL_SERVER}/upload`, {
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
    const result = await response.json()
    // const url = result.data.image_cloud
    return new Response(JSON.stringify(result), {
      status: result.statusCode
    })
  } catch (error) {
    console.log('Error occurred:', error)
    return NextResponse.json({ Message: 'Failed', status: 500 })
  }
}
