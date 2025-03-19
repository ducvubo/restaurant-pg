// app/api/image/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bucket = searchParams.get('bucket')
  const file = searchParams.get('file')
  console.log('🚀 ~ GET ~ file:', file)

  if (!bucket || !file) {
    return NextResponse.json({ message: 'Bucket and file name are required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${process.env.URL_SERVER_IMAGE}/upload/view-image?bucket=${bucket}&file=${file}`)

    if (!response.ok) {
      return NextResponse.json({ message: 'File not found' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${file}"`,
        'Cache-Control': 'public, max-age=86400'
      }
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
