import ExecuteStep from "./PageForm";



export default function WorkflowExecutionPage() {
  const steps = [
    {
      id: "Activity_0t2sdsy",
      name: "Buowcs1: Đặt hàng",
      performer: "customer",
      useForm: true,
      formFields: [
        {
          id: "bd3348cf-99d3-459c-835f-f539e3541de0",
          label: "Tên",
          type: "text",
          required: true,
          options: [],
          allowedTypes: ["image/*", "application/pdf"],
          maxSize: 5,
        },
        {
          id: "25faa617-6eef-4ea6-aaba-752eab4aa5a1",
          label: "Địa chỉ",
          type: "text",
          required: true,
          options: [],
          allowedTypes: ["image/*", "application/pdf"],
          maxSize: 5,
        },
      ],
    },
    {
      id: "Activity_15mgj4m",
      name: "Nhà hàng xác nhận",
      performer: "restaurant",
      useForm: false,
      formFields: [],
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100">
      <ExecuteStep steps={steps} />
    </div>
  );
}