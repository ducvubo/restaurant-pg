import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { genSignEndPoint } from '@/app/utils';
import { cookies } from 'next/headers';

export const POST = async (req: Request) => {
  try {
    const { nonce, sign, stime, version } = genSignEndPoint();
    const cookie = cookies();

    // Get FormData from request
    const formData = await req.formData();
    const image = formData.get('image');
    if (!image) {
      return NextResponse.json({ error: 'No image received.' }, { status: 400 });
    }

    // Create new FormData to send to server
    const formDataToSend = new FormData();
    const file = image as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    formDataToSend.append('image', new Blob([buffer]), file.name || 'face_image.jpg');

    // Get tokens from cookies
    const access_token_rtr = cookie.get('access_token_rtr')?.value;
    const refresh_token_rtr = cookie.get('refresh_token_rtr')?.value;
    const access_token_epl = cookie.get('access_token_epl')?.value;
    const refresh_token_epl = cookie.get('refresh_token_epl')?.value;

    // Create headers
    let headerReq: Record<string, string> = {};

    if (access_token_rtr && refresh_token_rtr) {
      headerReq = {
        nonce,
        sign,
        stime,
        version,
        'x-at-rtr': `Bearer ${access_token_rtr}`,
        'x-rf-rtr': `Bearer ${refresh_token_rtr}`,
      };
    }

    if (access_token_epl && refresh_token_epl) {
      headerReq = {
        nonce,
        sign,
        stime,
        version,
        'x-at-epl': `Bearer ${access_token_epl}`,
        'x-rf-epl': `Bearer ${refresh_token_epl}`,
      };
    }

    if (!headerReq['x-at-rtr'] && !headerReq['x-at-epl']) {
      return NextResponse.json(
        { error: 'Authentication tokens are missing.' },
        { status: 401 }
      );
    }

    // Send request to server
    console.log(`${process.env.URL_SERVER}/employees/verify-face`);
    const response = await fetch(
      `${process.env.URL_SERVER}/employees/verify-face`,
      {
        method: 'POST',
        headers: headerReq,
        body: formDataToSend,
      }
    );

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: result.statusCode || response.status,
    });

  } catch (error) {
    console.log('Error occurred:', error);
    return NextResponse.json({ Message: 'Failed', status: 500 }, { status: 500 });
  }
};