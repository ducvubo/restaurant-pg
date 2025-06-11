'use client';

import React, { useEffect, useState, useRef, forwardRef } from 'react';
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
import * as faceapi from 'face-api.js';
import { useRouter } from 'next/navigation';
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { toast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext';
import { Upload } from 'lucide-react';

interface Props {
  inforEmployee: IEmployee;
}

const RegisterFaceUpload = forwardRef<HTMLDivElement, Props>(({ inforEmployee }, ref) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [path] = useState<'delete' | 'recycle'>('delete');

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

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!modelsLoaded) {
      setError('Mô hình nhận diện khuôn mặt chưa được tải');
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).slice(0, 5 - selectedImages.length);
    if (newFiles.length + selectedImages.length > 5) {
      setError('Bạn chỉ có thể tải lên tối đa 5 ảnh');
      return;
    }

    setIsValidating(true);
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chỉ tải lên tệp hình ảnh');
        continue;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      await new Promise((resolve) => {
        img.onload = async () => {
          try {
            const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
            if (detections.length === 1) {
              validFiles.push(file);
              previews.push(objectUrl);
            } else {
              setError(`Ảnh ${file.name} không hợp lệ: phải chứa chính xác một khuôn mặt`);
            }
            resolve(null);
          } catch (err) {
            console.error('Lỗi phát hiện khuôn mặt:', err);
            setError(`Lỗi khi xử lý ảnh ${file.name}`);
            resolve(null);
          }
        };
        img.onerror = () => {
          setError(`Không thể tải ảnh ${file.name}`);
          resolve(null);
        };
      });
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setPreviewImages((prev) => [...prev, ...previews]);
    setIsValidating(false);

    // Clean up object URLs after processing
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  };

  // Handle image removal
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const url = prev[index];
      URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setError(null);
  };

  // Upload images to API
  const uploadImages = async () => {
    if (selectedImages.length < 5) {
      setError('Vui lòng tải lên đúng 5 ảnh');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((file, i) => {
        formData.append('images', file, `face_${inforEmployee._id}_${i}.jpg`);
      });

      const res = await fetch(`/api/register-face/${inforEmployee._id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.status === 200 || res.status === 201) {
        toast({
          title: 'Thành công',
          description: 'Đăng ký khuôn mặt thành công',
          variant: 'default',
        });
        router.refresh();
      } else if (res.status === 400) {
        toast({
          title: 'Thông báo',
          description: data.error || 'Dữ liệu không hợp lệ, vui lòng thử lại',
          variant: 'destructive',
        });
      } else if (res.status === 401) {
        toast({
          title: 'Thông báo',
          description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
          variant: 'destructive',
        });
        await deleteCookiesAndRedirect();
      } else if (res.status === 403) {
        toast({
          title: 'Thông báo',
          description: 'Bạn không có quyền thực hiện thao tác này',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Thất bại',
          description: data.message || 'Đã có lỗi xảy ra khi đăng ký khuôn mặt',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Lỗi gửi API:', err);
      toast({
        title: 'Thất bại',
        description: 'Không thể kết nối đến server, vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div ref={ref}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            role="menuitem"
            className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"
            data-orientation="vertical"
            data-radix-collection-item=""
          >
            Đăng ký khuôn mặt upload
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đăng ký khuôn mặt cho {inforEmployee.epl_name}</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng tải lên 5 ảnh khuôn mặt rõ ràng, mỗi ảnh chỉ chứa một khuôn mặt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isValidating || selectedImages.length >= 5}
                className="hidden"
                ref={fileInputRef}
              />
              <Button
                onClick={handleButtonClick}
                disabled={isValidating || selectedImages.length >= 5}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Tải lên ảnh
              </Button>
            </div>
            {isValidating && <p className="mb-4">Đang kiểm tra ảnh...</p>}
            <div className="grid grid-cols-5 gap-2">
              {previewImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Ảnh khuôn mặt ${index + 1}`}
                    className="w-24 h-24 object-cover border rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={selectedImages.length < 5 || isValidating}
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

RegisterFaceUpload.displayName = 'RegisterFaceUpload';
export default RegisterFaceUpload;