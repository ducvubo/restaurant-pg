import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { genSignEndPoint } from '@/app/utils';
import { cookies } from 'next/headers';

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
  console.log("🚀 ~ POST ~ params:", params)
  try {
    const { nonce, sign, stime, version } = genSignEndPoint();
    const cookie = cookies();

    const employeeId = params.id;
    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    // Lấy FormData từ request
    const formData = await req.formData();
    const images = formData.getAll('images'); // Lấy tất cả file từ field 'images'
    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images received.' }, { status: 400 });
    }

    // Tạo FormData mới để gửi tới server
    const formDataToSend = new FormData();
    for (let i = 0; i < images.length; i++) {
      const file = images[i] as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      formDataToSend.append('images', new Blob([buffer]), file.name || `face_${employeeId}_${i}.jpg`);
    }

    // Lấy token từ cookies
    const access_token_rtr = cookie.get('access_token_rtr')?.value;
    const refresh_token_rtr = cookie.get('refresh_token_rtr')?.value;
    const access_token_epl = cookie.get('access_token_epl')?.value;
    const refresh_token_epl = cookie.get('refresh_token_epl')?.value;

    // Tạo headers giống mẫu
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

    // Gửi yêu cầu tới server
    const response = await fetch(
      `${process.env.URL_SERVER}/employees/register-face?id=${employeeId}`,
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