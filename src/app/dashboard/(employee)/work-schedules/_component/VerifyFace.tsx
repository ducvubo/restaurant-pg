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
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';
import { IEmployee } from '../../employees/employees.interface';
import { checkInWork } from '../work-schedule.api';
import { Camera, Upload } from 'lucide-react';

const VerifyFace = forwardRef<HTMLDivElement>((_, ref) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const webcamRef = useRef<Webcam | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null); // Reset capturedImage to allow new capture
      setError(null); // Clear any previous errors
      setIsCapturing(false); // Reset capturing state
    }
  }, [isOpen]);

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
          await verifyFace(imageSrc);
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

  useEffect(() => {
    if (!modelsLoaded || !webcamReady || capturedImage || !isOpen) {
      console.log('Không chạy detection:', {
        modelsLoaded,
        webcamReady,
        capturedImage: !!capturedImage,
        isOpen,
      });
      return;
    }

    const interval = setInterval(() => {
      debouncedCaptureAndVerify();
    }, 500);

    return () => {
      console.log('Dọn dẹp interval');
      clearInterval(interval);
      debouncedCaptureAndVerify.cancel();
    };
  }, [modelsLoaded, webcamReady, capturedImage, isOpen]);

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

      const data: IBackendRes<IEmployee> = await res.json();
      console.log("🚀 ~ verifyFace ~ data:", data);

      if (data.statusCode === 201 && data.data) {
        const resTimeSheet = await checkInWork({
          _id: data?.data?._id as string,
          date: new Date(),
        });

        if (resTimeSheet.statusCode === 201 || resTimeSheet.statusCode === 200) {
          toast({
            title: 'Thành công',
            description: `Nhân viên: ${data.data.epl_name}, Ca làm việc: ${resTimeSheet.data?.workingShift.wks_name}`,
            variant: 'default',
          });
          setIsOpen(false);
          router.push('/dashboard/work-schedules');
        } else {
          throw new Error(resTimeSheet.message || 'Không tìm thấy ca làm việc');
        }
      } else {
        throw new Error('Không thể xác thực khuôn mặt');
      }
    } catch (err) {
      console.error('Lỗi gửi API:', err);
      toast({
        title: 'Thất bại',
        description: 'Không thể kết nối đến server, vui lòng thử lại sau',
        variant: 'destructive',
      });
      setCapturedImage(null); // Reset để cho phép chụp lại
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref}>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant={'outline'} onClick={() => setIsOpen(true)} className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Chấm công
          </Button>
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
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

VerifyFace.displayName = 'VerifyFace';
export default VerifyFace;