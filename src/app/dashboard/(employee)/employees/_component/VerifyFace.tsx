'use client';

import React, { useEffect, useRef, useState, forwardRef } from 'react';
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
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { toast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext';
import { debounce } from 'lodash'; // Assuming lodash is installed for debouncing
import { Button } from '@/components/ui/button';

const VerifyFace = forwardRef<HTMLDivElement>((_, ref) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const webcamRef = useRef<Webcam | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);

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

  // Debounced function to capture and verify
  const debouncedCaptureAndVerify = debounce(async () => {
    if (!webcamRef.current || isCapturing) {
      console.log('Bỏ qua chụp ảnh:', { webcamRef: !!webcamRef.current, isCapturing });
      return;
    }

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) {
      console.log('Webcam chưa sẵn sàng:', video?.readyState);
      return;
    }

    try {
      setIsCapturing(true);
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      console.log('Số khuôn mặt phát hiện:', detections.length);

      if (detections.length > 0) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
          console.log('Chụp ảnh thành công:', imageSrc);
          await verifyFace(imageSrc); // Call API immediately after capture
        } else {
          console.log('Không chụp được ảnh');
          setError('Không thể chụp ảnh');
        }
      } else {
        setError('Không phát hiện khuôn mặt, vui lòng thử lại');
      }
    } catch (err) {
      console.error('Lỗi phát hiện khuôn mặt:', err);
      setError('Lỗi khi chụp ảnh khuôn mặt');
    } finally {
      setIsCapturing(false);
    }
  }, 200);

  // Run face detection when models and webcam are ready
  useEffect(() => {
    if (!modelsLoaded || !webcamReady || capturedImage) {
      console.log('Không chạy detection:', {
        modelsLoaded,
        webcamReady,
        capturedImage: !!capturedImage,
      });
      return;
    }

    const interval = setInterval(() => {
      debouncedCaptureAndVerify();
    }, 500); // Check every 500ms, but debounce ensures 200ms delay between captures

    return () => {
      console.log('Dọn dẹp interval');
      clearInterval(interval);
      debouncedCaptureAndVerify.cancel(); // Cancel any pending debounced calls
    };
  }, [modelsLoaded, webcamReady, capturedImage]);

  const verifyFace = async (imageSrc: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      formData.append('image', blob, `verify_face.jpg`);

      const res = await fetch('/api/verify-face', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log("🚀 ~ verifyFace ~ data:", data)
      if (res.status === 201 && data.data) {
        setLoading(false);
        toast({
          title: 'Thành công',
          description: 'Chấm công thành công',
          variant: 'default',
        });
        // router.refresh();
      } else if (res.status === 400) {
        setLoading(false);
        toast({
          title: 'Thông báo',
          description: data.error || 'Dữ liệu không hợp lệ, vui lòng thử lại',
          variant: 'destructive',
        });
        setCapturedImage(null); // Allow retry
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
        setCapturedImage(null); // Allow retry
      } else {
        setLoading(false);
        toast({
          title: 'Thất bại',
          description: data.message || 'Đã có lỗi xảy ra khi chấm công',
          variant: 'destructive',
        });
        setCapturedImage(null); // Allow retry
      }
    } catch (err) {
      console.error('Lỗi gửi API:', err);
      setLoading(false);
      toast({
        title: 'Thất bại',
        description: 'Không thể kết nối đến server, vui lòng thử lại sau',
        variant: 'destructive',
      });
      setCapturedImage(null); // Allow retry
    }
  };

  return (
    <div ref={ref}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={'outline'}>Chấm công</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chấm công</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng nhìn vào webcam để chấm công.
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
            {isCapturing && <p className="mb-4">Đang chụp ảnh...</p>}
            {/* {capturedImage && (
              <img
                src={capturedImage}
                alt="Ảnh khuôn mặt"
                className="w-48 h-48 object-cover border rounded mb-4"
              />
            )} */}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            {/* <AlertDialogAction disabled={isCapturing} onClick={() => setCapturedImage(null)}>
              Thử lại
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

VerifyFace.displayName = 'VerifyFace';
export default VerifyFace;