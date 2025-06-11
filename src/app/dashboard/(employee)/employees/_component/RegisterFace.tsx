'use client';

import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { IEmployee } from '../employees.interface';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useRouter } from 'next/navigation';
import { deleteEmployee, restoreEmployee } from '../employees.api';
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { toast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext';

interface Props {
  inforEmployee: IEmployee;
}

const RegisterFace = forwardRef<HTMLDivElement, Props>(({ inforEmployee }, ref) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const webcamRef = useRef<Webcam | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [path] = useState<'delete' | 'recycle'>('delete');
  const [error, setError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log('Mô hình face-api.js tải thành công');
      } catch (err) {
        console.error('Lỗi tải mô hình:', err);
        setError('Không thể tải mô hình nhận diện khuôn mặt');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (webcamRef.current) {
      console.log('webcamRef đã được gán:', webcamRef.current);
      setWebcamReady(true);
    } else {
      console.log('webcamRef vẫn là null');
    }
  }, [webcamRef.current]);

  useEffect(() => {
    if (!modelsLoaded || !webcamReady || capturedImages.length >= 5) {
      console.log('Không chạy detection:', {
        modelsLoaded,
        webcamReady,
        imageCount: capturedImages.length,
      });
      return;
    }

    console.log('Bắt đầu detection với webcamRef:', webcamRef.current);

    const interval = setInterval(async () => {
      if (!webcamRef.current || isUploading) {
        console.log('Bỏ qua detection:', { webcamRef: !!webcamRef.current, isUploading });
        return;
      }

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        console.log('Webcam chưa sẵn sàng:', video?.readyState);
        return;
      }

      try {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        console.log('Số khuôn mặt phát hiện:', detections.length);

        if (detections.length > 0 && capturedImages.length < 5) {
          setIsUploading(true);
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            setCapturedImages((prev) => [...prev, imageSrc]);
            console.log('Chụp ảnh thành công:', imageSrc);
          } else {
            console.log('Không chụp được ảnh');
          }
          setTimeout(() => setIsUploading(false), 2000);
        }
      } catch (err) {
        console.error('Lỗi phát hiện khuôn mặt:', err);
        setIsUploading(false);
      }
    }, 500);

    return () => {
      console.log('Dọn dẹp interval');
      clearInterval(interval);
    };
  }, [modelsLoaded, webcamReady, isUploading, capturedImages]);



  // Hàm gọi API route
  const uploadImages = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < capturedImages.length; i++) {
        const response = await fetch(capturedImages[i]);
        const blob = await response.blob();
        formData.append('images', blob, `face_${inforEmployee._id}_${i}.jpg`);
      }

      const res = await fetch(`/api/register-face/${inforEmployee._id} `, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        toast({
          title: 'Thành công',
          description: 'Đăng ký khuôn mặt thành công',
          variant: 'default',
        });
        router.refresh();
      } else if (res.status === 400) {
        setLoading(false);
        toast({
          title: 'Thông báo',
          description: data.error || 'Dữ liệu không hợp lệ, vui lòng thử lại',
          variant: 'destructive',
        });
      } else if (res.status === 401) {
        setLoading(false);
        toast({
          title: 'Thông báo',
          description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
          variant: 'destructive',
        });
        await deleteCookiesAndRedirect();
      } else if (res.status === 403) {
        setLoading(false);
        toast({
          title: 'Thông báo',
          description: 'Bạn không có quyền thực hiện thao tác này',
          variant: 'destructive',
        });
      } else {
        setLoading(false);
        toast({
          title: 'Thất bại',
          description: data.message || 'Đã có lỗi xảy ra khi đăng ký khuôn mặt',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Lỗi gửi API:', err);
      setLoading(false);
      toast({
        title: 'Thất bại',
        description: 'Không thể kết nối đến server, vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  return (
    <div ref={ref}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            role='menuitem'
            className='relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer'
            data-orientation='vertical'
            data-radix-collection-item=''
          >
            Đăng ký khuôn mặt tự động
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đăng ký khuôn mặt cho {inforEmployee.epl_name}</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng nhìn vào webcam để chụp 5 ảnh đăng ký khuôn mặt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
              videoConstraints={{
                facingMode: 'user',
              }}
              className="mb-4"
              onUserMedia={() => {
                console.log('Webcam đã khởi động');
                setWebcamReady(true);
              }}
              onUserMediaError={(err) => {
                console.error('Lỗi webcam:', err);
                setError('Không thể truy cập webcam');
              }}
            />
            {isUploading && <p className="mb-4">Đang chụp ảnh...</p>}
            <div className="grid grid-cols-5 gap-2">
              {capturedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Ảnh khuôn mặt ${index + 1} `}
                  className="w-24 h-24 object-cover border rounded"
                />
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={capturedImages.length < 5}
              onClick={uploadImages}
            >
              Lưu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

RegisterFace.displayName = 'RegisterFace';
export default RegisterFace;