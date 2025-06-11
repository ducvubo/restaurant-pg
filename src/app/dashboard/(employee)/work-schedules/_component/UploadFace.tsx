'use client';

import React, { useRef, useState, forwardRef } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { deleteCookiesAndRedirect } from '@/app/actions/action';
import { toast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';

import { checkInWork } from '../work-schedule.api';
import { IEmployee } from '../../employees/employees.interface';
import { ImageUp } from 'lucide-react';

const UploadFace = forwardRef<HTMLDivElement>((_, ref) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Reset states when dialog opens
  const resetStates = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError('Vui lòng chọn một tệp ảnh');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một tệp ảnh (jpg, png, v.v.)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setError(null);
    };
    reader.onerror = () => {
      setError('Lỗi khi đọc tệp ảnh');
    };
    reader.readAsDataURL(file);
  };

  // Handle image removal
  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  // Handle verify face
  const verifyFace = async (imageSrc: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      formData.append('image', blob, 'verify_face.jpg');

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
          throw new Error(
            Array.isArray(resTimeSheet.message)
              ? resTimeSheet.message.join(', ')
              : resTimeSheet.message || 'Không tìm thấy ca làm việc'
          );
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
      resetStates();
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

  // Handle upload button click
  const handleUpload = () => {
    if (!selectedImage) {
      setError('Vui lòng chọn một tệp ảnh trước khi xác thực');
      return;
    }
    verifyFace(selectedImage);
  };

  return (
    <div ref={ref}>
      <AlertDialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) resetStates();
      }}>
        <AlertDialogTrigger asChild>
          <Button variant={'outline'} className="flex items-center gap-2">
            <ImageUp className="w-4 h-4" />
            Chấm công
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chấm công</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng tải lên một ảnh khuôn mặt để chấm công.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={handleButtonClick}
                disabled={!!selectedImage}
                className="flex items-center gap-2"
              >
                <ImageUp className="w-4 h-4" />
                Tải lên ảnh
              </Button>
            </div>
            {selectedImage && (
              <div className="relative mb-4">
                <img
                  src={selectedImage}
                  alt="Selected face"
                  className="w-48 h-48 object-cover border rounded"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <Button onClick={handleUpload} disabled={!selectedImage}>
              Xác thực
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

UploadFace.displayName = 'UploadFace';
export default UploadFace;