"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

// Định nghĩa type cho field của form
interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "datetime" | "select" | "upload";
  required: boolean;
  options?: string[];
  allowedTypes?: string[];
  maxSize?: number;
}

// Định nghĩa type cho bước (task)
interface Step {
  id: string;
  name: string;
  performer: string;
  useForm: boolean;
  formFields: FormField[];
}

// Props cho component
interface ExecuteStepProps {
  steps: Step[];
}

export default function ExecuteStep({ steps }: any) {
  // State để lưu dữ liệu form
  const [formData, setFormData] = useState<Record<string, any>>({});
  // State để theo dõi bước hiện tại
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Lấy bước hiện tại
  const currentStep = steps[currentStepIndex];

  // Xử lý thay đổi input
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (!currentStep.useForm) {
      // Nếu không có form, chỉ confirm
      console.log(`Confirm bước: ${currentStep.name}`, {
        stepId: currentStep.id,
        performer: currentStep.performer,
      });
      toast({
        title: "Thành công",
        description: `Đã xác nhận bước: ${currentStep.name}`,
      });
      // Chuyển sang bước tiếp theo
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setFormData({});
      }
      return;
    }

    // Kiểm tra required fields
    for (const field of currentStep.formFields) {
      if (field.required && !formData[field.id]) {
        toast({
          title: "Lỗi",
          description: `Vui lòng nhập ${field.label}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Xử lý file upload
    for (const field of currentStep.formFields) {
      if (field.type === "upload" && formData[field.id]) {
        const file = formData[field.id];
        if (field.maxSize && file.size > field.maxSize * 1024 * 1024) {
          toast({
            title: "Lỗi",
            description: `File ${field.label} vượt quá kích thước tối đa (${field.maxSize}MB)`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Log dữ liệu form
    console.log(`Submit form cho bước: ${currentStep.name}`, {
      stepId: currentStep.id,
      performer: currentStep.performer,
      formData,
    });

    toast({
      title: "Thành công",
      description: `Đã submit form cho bước: ${currentStep.name}`,
    });

    // Chuyển sang bước tiếp theo
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setFormData({});
    } else {
      toast({
        title: "Hoàn thành",
        description: "Đã hoàn thành tất cả các bước",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Thực hiện quy trình đặt đồ ăn</h1>
      {currentStep ? (
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">{currentStep.name}</h2>
          <p className="text-sm text-gray-600 mb-4">
            Đối tượng thực hiện: {currentStep.performer === "customer" ? "Khách hàng" : "Nhà hàng"}
          </p>
          {currentStep.useForm && currentStep.formFields.length > 0 ? (
            <div className="flex flex-col gap-4">
              {currentStep.formFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "text" && (
                    <Input
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                      placeholder={`Nhập ${field.label}`}
                    />
                  )}
                  {field.type === "textarea" && (
                    <textarea
                      className="border rounded p-2"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                      placeholder={`Nhập ${field.label}`}
                    />
                  )}
                  {field.type === "number" && (
                    <Input
                      type="number"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, Number(e.target.value))}
                      required={field.required}
                      placeholder={`Nhập ${field.label}`}
                    />
                  )}
                  {field.type === "datetime" && (
                    <Input
                      type="datetime-local"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === "select" && (
                    <Select
                      value={formData[field.id] || ""}
                      onValueChange={(value) => handleInputChange(field.id, value)}
                      required={field.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Chọn ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {field.type === "upload" && (
                    <Input
                      type="file"
                      accept={field.allowedTypes?.join(",")}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange(field.id, file);
                        }
                      }}
                    />
                  )}
                </div>
              ))}
              <Button onClick={handleSubmit} className="mt-4">
                Submit
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">Không yêu cầu nhập thông tin.</p>
              <Button onClick={handleSubmit}>Confirm</Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Không có bước nào để thực hiện</p>
      )}
    </div>
  );
}