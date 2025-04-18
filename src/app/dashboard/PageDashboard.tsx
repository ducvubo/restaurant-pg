"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { useEffect, useRef, useState } from "react";
import { parseStringPromise } from "xml2js";
import { v4 as uuidv4 } from "uuid";
import CustomPaletteProvider from "./customPaletteProvider";

// Định nghĩa type cho các dependency của CustomContextPadProvider
interface ContextPadProvider {
  registerProvider(provider: CustomContextPadProvider): void;
}

interface Modeling {
  updateProperties(element: BpmnElement, properties: Record<string, any>): void;
}

interface ElementFactory {
  // Có thể thêm các method cụ thể nếu cần
}

interface Translate {
  // Có thể thêm các method cụ thể nếu cần
}

interface EventBus {
  on(event: string, callback: (event: any) => void): void;
}

interface Canvas {
  zoom(level: string): void;
}

interface Palette {
  // Có thể thêm các method cụ thể nếu cần
}

// Type cho BPMN element
interface BpmnElement {
  id: string;
  type: string;
  businessObject: {
    name?: string;
    get(key: string): any;
    [key: string]: any;
  };
}

// Type cho field của form động
interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "datetime" | "select" | "upload";
  required: boolean;
  options?: string[]; // Chỉ dùng cho type = "select"
  allowedTypes?: string[]; // Chỉ dùng cho type = "upload" (ví dụ: ["image/*", "application/pdf"])
  maxSize?: number; // Chỉ dùng cho type = "upload" (kích thước tối đa, MB)
}

// Class CustomContextPadProvider
class CustomContextPadProvider {
  private modeling: Modeling;
  private elementFactory: ElementFactory;
  private translate: Translate;
  private eventBus: EventBus;

  constructor(
    contextPad: ContextPadProvider,
    modeling: Modeling,
    elementFactory: ElementFactory,
    translate: Translate,
    eventBus: EventBus,
    canvas: Canvas,
    palette: Palette
  ) {
    this.modeling = modeling;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.eventBus = eventBus;
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: BpmnElement) {
    return (entries: Record<string, any>) => {
      delete entries["replace"];
      delete entries["append.intermediate-event"];
      delete entries["append.append-task"];
      delete entries["append.end-event"];
      delete entries["append.gateway"];
      return entries;
    };
  }
}

// Định nghĩa dependency injection cho CustomContextPadProvider
CustomContextPadProvider.$inject = [
  "contextPad",
  "modeling",
  "elementFactory",
  "connect",
  "translate",
  "eventBus",
  "canvas",
  "palette",
];

// Component Design
export default function Design() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const [bpmnContent, setBpmnContent] = useState<string>(
    `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                id="Definitions_1"
                targetNamespace="http://bpmn.io/schema/bpmn">
      <process id="Process_1" isExecutable="true" />
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
      </bpmndi:BPMNDiagram>
    </definitions>`
  );
  const [selectedElement, setSelectedElement] = useState<BpmnElement | null>(null);
  const [performer, setPerformer] = useState<string>("");
  const [wfTitle, setWfTitle] = useState<string>("");
  const [useForm, setUseForm] = useState<boolean>(false);
  // Lưu formFields theo taskId
  const [formFieldsByTask, setFormFieldsByTask] = useState<Record<string, FormField[]>>({});
  const [newField, setNewField] = useState<Omit<FormField, "id">>({
    label: "",
    type: "text",
    required: false,
    options: [],
    allowedTypes: ["image/*", "application/pdf"],
    maxSize: 5, // Mặc định 5MB
  });
  const [newOption, setNewOption] = useState<string>("");

  const onChangeTask = (type: string, data: string | number | null) => {
    if (!selectedElement || selectedElement.type !== "bpmn:Task" || !modelerRef.current) {
      console.error("Không thể lưu: selectedElement hoặc modelerRef không hợp lệ", {
        selectedElement,
        modelerRef: !!modelerRef.current,
      });
      toast({
        title: "Lỗi",
        description: "Không thể lưu thay đổi: Vui lòng chọn lại bước",
        variant: "destructive",
      });
      return;
    }

    try {
      const modeling = modelerRef.current.get("modeling") as Modeling;
      modeling.updateProperties(selectedElement, {
        [type]: data,
      });
      console.log(`Đã lưu ${type}:`, data);
      toast({
        title: "Thành công",
        description: `Đã lưu ${type === "formFields" ? "thông tin field" : type}`,
      });
    } catch (error) {
      console.error(`Lỗi khi lưu ${type}:`, error);
      toast({
        title: "Lỗi",
        description: `Không thể lưu ${type}`,
        variant: "destructive",
      });
    }
  };

  const onEventBus = async (element: BpmnElement | null) => {
    if (!element || element.type !== "bpmn:Task") {
      setSelectedElement(null);
      setPerformer("");
      setWfTitle("");
      setUseForm(false);
      setNewField({
        label: "",
        type: "text",
        required: false,
        options: [],
        allowedTypes: ["image/*", "application/pdf"],
        maxSize: 5,
      });
      setNewOption("");
    } else {
      setSelectedElement(element);
      setPerformer(element.businessObject.get("performer") || "");
      setWfTitle(element.businessObject.name || "");
      setUseForm(element.businessObject.get("useForm") === "true" || false);
      try {
        const fields = element.businessObject.get("formFields");
        const taskFields = fields ? JSON.parse(fields) : [];
        setFormFieldsByTask((prev) => ({
          ...prev,
          [element.id]: taskFields,
        }));
      } catch {
        setFormFieldsByTask((prev) => ({
          ...prev,
          [element.id]: [],
        }));
      }
      // Reset newField khi chuyển task
      setNewField({
        label: "",
        type: "text",
        required: false,
        options: [],
        allowedTypes: ["image/*", "application/pdf"],
        maxSize: 5,
      });
      setNewOption("");
    }
  };

  // Hàm bật/tắt form
  const toggleUseForm = (checked: boolean) => {
    if (!selectedElement) return;
    setUseForm(checked);
    onChangeTask("useForm", checked.toString());
    if (!checked) {
      setFormFieldsByTask((prev) => ({
        ...prev,
        [selectedElement.id]: [],
      }));
      onChangeTask("formFields", null);
    }
  };

  // Hàm thêm field mới
  const addFormField = () => {
    if (!selectedElement) return;
    if (!newField.label) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên field",
        variant: "destructive",
      });
      return;
    }
    if (newField.type === "select" && (!newField.options || newField.options.length === 0)) {
      toast({
        title: "Lỗi",
        description: "Field select phải có ít nhất 1 tùy chọn",
        variant: "destructive",
      });
      return;
    }
    const field: FormField = { id: uuidv4(), ...newField };
    const updatedFields = [...(formFieldsByTask[selectedElement.id] || []), field];
    setFormFieldsByTask((prev) => ({
      ...prev,
      [selectedElement.id]: updatedFields,
    }));
    onChangeTask("formFields", JSON.stringify(updatedFields));
    setNewField({
      label: "",
      type: "text",
      required: false,
      options: [],
      allowedTypes: ["image/*", "application/pdf"],
      maxSize: 5,
    });
    setNewOption("");
  };

  // Hàm xóa field
  const deleteFormField = (id: string) => {
    if (!selectedElement) return;
    const updatedFields = (formFieldsByTask[selectedElement.id] || []).filter(
      (field) => field.id !== id
    );
    setFormFieldsByTask((prev) => ({
      ...prev,
      [selectedElement.id]: updatedFields,
    }));
    onChangeTask("formFields", JSON.stringify(updatedFields));
  };

  // Hàm cập nhật field
  const updateFormField = (id: string, key: keyof FormField, value: any) => {
    if (!selectedElement) {
      console.error("Không thể cập nhật field: Không có selectedElement");
      return;
    }
    const updatedFields = (formFieldsByTask[selectedElement.id] || []).map((field) =>
      field.id === id ? { ...field, [key]: value } : field
    );
    setFormFieldsByTask((prev) => ({
      ...prev,
      [selectedElement.id]: updatedFields,
    }));
    console.log(`Cập nhật field ${id}, ${key}:`, value);
    onChangeTask("formFields", JSON.stringify(updatedFields));
  };

  // Hàm thêm tùy chọn cho select
  const addOption = () => {
    if (!newOption) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tùy chọn",
        variant: "destructive",
      });
      return;
    }
    const updatedOptions = [...(newField.options || []), newOption];
    setNewField({ ...newField, options: updatedOptions });
    setNewOption("");
    toast({
      title: "Thành công",
      description: "Đã thêm tùy chọn",
    });
  };

  // Hàm xóa tùy chọn cho select
  const deleteOption = (option: string) => {
    const updatedOptions = (newField.options || []).filter((opt) => opt !== option);
    setNewField({ ...newField, options: updatedOptions });
    toast({
      title: "Thành công",
      description: "Đã xóa tùy chọn",
    });
  };

  // Hàm kiểm tra tính hợp lệ của quy trình BPMN
  const validateBpmn = async (xml: string): Promise<string | null> => {
    try {
      const result = await parseStringPromise(xml);
      const process = result.definitions.process?.[0];
      if (!process) return "Quy trình không tồn tại";

      // Kiểm tra start event
      const startEvents = process.startEvent || [];
      if (startEvents.length === 0) return "Quy trình phải có ít nhất 1 sự kiện bắt đầu";
      if (startEvents.length > 1) return "Quy trình chỉ được có 1 sự kiện bắt đầu";

      // Kiểm tra end event
      const endEvents = process.endEvent || [];
      if (endEvents.length === 0) return "Quy trình phải có ít nhất 1 sự kiện kết thúc";
      if (endEvents.length > 1) return "Quy trình chỉ được có 1 sự kiện kết thúc";

      // Kiểm tra task
      const tasks = process.task || [];
      if (tasks.length === 0) return "Quy trình phải có ít nhất 1 bước (task)";

      // Kiểm tra performer và form fields hợp lệ cho tasks
      for (const task of tasks) {
        const performer = task.$.performer;
        if (!performer || !["restaurant", "customer"].includes(performer)) {
          return `Task ${task.$.id} phải có đối tượng thực hiện hợp lệ`;
        }
        const useForm = task.$.useForm === "true";
        const formFields = task.$.formFields;
        if (useForm && (!formFields || JSON.parse(formFields).length === 0)) {
          return `Task ${task.$.id} bật form nhưng không có field nào`;
        }
        if (formFields) {
          const fields = JSON.parse(formFields);
          for (const field of fields) {
            if (
              !field.label ||
              !["text", "textarea", "number", "datetime", "select", "upload"].includes(field.type)
            ) {
              return `Task ${task.$.id} có field không hợp lệ`;
            }
            if (field.type === "select" && (!field.options || field.options.length === 0)) {
              return `Task ${task.$.id} có field select không có tùy chọn`;
            }
          }
        }
      }

      // Kiểm tra kết nối (sequence flows)
      const sequenceFlows = process.sequenceFlow || [];
      if (sequenceFlows.length === 0) return "Các bước phải được kết nối với nhau";

      // Kiểm tra tất cả các phần tử có được kết nối
      const allElements = [...startEvents, ...endEvents, ...tasks, ...(process.gateway || [])];
      const elementIds = allElements.map((el: any) => el.$.id);
      const connectedSources = sequenceFlows.map((flow: any) => flow.$.sourceRef);
      const connectedTargets = sequenceFlows.map((flow: any) => flow.$.targetRef);

      for (const elementId of elementIds) {
        if (!connectedSources.includes(elementId) && !connectedTargets.includes(elementId)) {
          return `Phần tử ${elementId} không được kết nối`;
        }
      }

      // Kiểm tra đường dẫn từ start đến end
      const reachable = new Set<string>();
      const stack = [startEvents[0].$.id];
      while (stack.length > 0) {
        const currentId = stack.pop()!;
        if (!reachable.has(currentId)) {
          reachable.add(currentId);
          const outgoingFlows = sequenceFlows.filter(
            (flow: any) => flow.$.sourceRef === currentId
          );
          for (const flow of outgoingFlows) {
            stack.push(flow.$.targetRef);
          }
        }
      }

      if (!reachable.has(endEvents[0].$.id)) {
        return "Không có đường dẫn từ sự kiện bắt đầu đến sự kiện kết thúc";
      }

      return null; // Quy trình hợp lệ
    } catch (e) {
      return "XML không hợp lệ hoặc lỗi khi phân tích";
    }
  };

  // Hàm xử lý lưu quy trình
  const handleSave = async () => {
    if (!modelerRef.current) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu quy trình: Modeler chưa được khởi tạo",
        variant: "destructive",
      });
      return;
    }

    const { xml } = await modelerRef.current.saveXML({ format: true });
    const validationError = await validateBpmn(xml);

    if (validationError) {
      toast({
        title: "Quy trình không hợp lệ",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Lấy dữ liệu các bước
    try {
      const result = await parseStringPromise(xml);
      const process = result.definitions.process?.[0];
      const tasks = process.task || [];
      const steps = tasks.map((task: any) => ({
        id: task.$.id,
        name: task.$.name || "",
        performer: task.$.performer || "",
        useForm: task.$.useForm === "true",
        formFields: task.$.formFields ? JSON.parse(task.$.formFields) : [],
      }));

      // Log mảng các bước
      console.log("Danh sách các bước:", JSON.stringify(steps, null, 2));
    } catch (e) {
      console.error("Lỗi khi parse XML để lấy steps:", e);
    }

    // Lưu XML (gửi đến API hoặc console.log)
    console.log("Lưu BPMN XML:", xml);
    toast({
      title: "Thành công",
      description: "Quy trình đã được lưu thành công",
    });

    // Ví dụ: Gửi đến API
    /*
    try {
      await fetch("/api/save-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xml }),
      });
      toast({
        title: "Thành công",
        description: "Quy trình đã được lưu thành công",
      });
    } catch (e) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu quy trình",
        variant: "destructive",
      });
    }
    */
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && containerRef.current) {
          if (!modelerRef.current) {
            modelerRef.current = new BpmnModeler({
              container: containerRef.current,
              additionalModules: [
                {
                  paletteProvider: ["type", CustomPaletteProvider],
                },
                {
                  __init__: ["customContextPadProvider"],
                  customContextPadProvider: ["type", CustomContextPadProvider],
                },
              ],
            });

            const eventBus = modelerRef.current.get("eventBus") as EventBus;
            eventBus.on("element.click", async (event: { element: BpmnElement }) => {
              onEventBus(event.element.type === "bpmn:Task" ? event.element : null);
            });
            eventBus.on("shape.remove", async (event: { element: BpmnElement }) => {
              if (event.element.type === "bpmn:Task") {
                setFormFieldsByTask((prev) => {
                  const newFields = { ...prev };
                  delete newFields[event.element.id];
                  return newFields;
                });
                onEventBus(null);
              }
            });
            eventBus.on("shape.added", async (event: { element: BpmnElement }) => {
              if (event.element.type === "bpmn:Task") {
                onEventBus(event.element);
              }
            });
            eventBus.on("commandStack.changed", async () => {
              if (modelerRef.current) {
                const { xml } = await modelerRef.current.saveXML({ format: true });
                setBpmnContent(xml);
              }
            });

            let content = bpmnContent;
            if (!isBpmnXml(bpmnContent)) {
              content = `<?xml version="1.0" encoding="UTF-8"?>
                          <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                                      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                                      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                                      id="Definitions_1"
                                      targetNamespace="http://bpmn.io/schema/bpmn">
                            <process id="Process_1" isExecutable="true" />
                            <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                              <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
                            </bpmndi:BPMNDiagram>
                          </definitions>`;
            }

            modelerRef.current.importXML(content).then(() => {
              const canvas = modelerRef.current!.get("canvas") as Canvas;
              canvas.zoom("fit-viewport");
            }).catch((err: Error) => {
              console.error("Error loading BPMN:", err);
            });
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [bpmnContent]);

  function isBpmnXml(xml: string): boolean {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");

      const definitions = xmlDoc.getElementsByTagName("definitions")[0];
      if (!definitions) return false;

      const namespace = definitions.namespaceURI;
      return namespace === "http://www.omg.org/spec/BPMN/20100524/MODEL";
    } catch (e) {
      console.error("Invalid XML:", e);
      return false;
    }
  }

  return (
    <>
      <div className="p-4">
        <Button onClick={handleSave}>Lưu</Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full"
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <ResizablePanel maxSize={80} minSize={20} defaultSize={70}>
          <div ref={containerRef} className="w-full h-full" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel maxSize={80} minSize={20} defaultSize={30}>
          <h3 className="p-4 text-blue-900 font-semibold uppercase border-b border-gray-200">
            Thiết lập bước
          </h3>
          {selectedElement && selectedElement.type === "bpmn:Task" ? (
            <div className="flex flex-col gap-4 p-4">
              <h4 className="font-semibold">Tên bước: {wfTitle}</h4>
              <div className="flex flex-col gap-2">
                <span className="text-sm">Đối tượng thực hiện</span>
                <Select
                  value={performer}
                  onValueChange={(value) => {
                    setPerformer(value);
                    onChangeTask("performer", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn đối tượng thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Nhà hàng</SelectItem>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Switch checked={useForm} onCheckedChange={toggleUseForm} />
                  <span>Sử dụng Form</span>
                </div>
                {useForm && (
                  <>
                    <h4 className="font-semibold">Cấu hình Form</h4>
                    {formFieldsByTask[selectedElement.id]?.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {formFieldsByTask[selectedElement.id].map((field) => (
                          <div key={field.id} className="border p-2 rounded">
                            <div className="flex flex-col gap-2">
                              <Input
                                value={field.label}
                                onChange={(e) => updateFormField(field.id, "label", e.target.value)}
                                placeholder="Tên field"
                              />
                              <Select
                                value={field.type}
                                onValueChange={(value) =>
                                  updateFormField(field.id, "type", value as FormField["type"])
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn kiểu" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="textarea">Textarea</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="datetime">Datetime</SelectItem>
                                  <SelectItem value="select">Select</SelectItem>
                                  <SelectItem value="upload">Upload</SelectItem>
                                </SelectContent>
                              </Select>
                              {field.type === "select" && (
                                <div className="flex flex-col gap-2">
                                  <span className="text-sm">Tùy chọn</span>
                                  {field.options?.map((option) => (
                                    <div key={option} className="flex items-center gap-2">
                                      <Input value={option} readOnly />
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          updateFormField(
                                            field.id,
                                            "options",
                                            field.options?.filter((opt) => opt !== option)
                                          )
                                        }
                                      >
                                        Xóa
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {field.type === "upload" && (
                                <div className="flex flex-col gap-2">
                                  <span className="text-sm">Loại file cho phép</span>
                                  <Input
                                    value={field.allowedTypes?.join(", ") || ""}
                                    onChange={(e) =>
                                      updateFormField(field.id, "allowedTypes", e.target.value.split(", "))
                                    }
                                    placeholder="Ví dụ: image/*, application/pdf"
                                  />
                                  <span className="text-sm">Kích thước tối đa (MB)</span>
                                  <Input
                                    type="number"
                                    value={field.maxSize || 5}
                                    onChange={(e) =>
                                      updateFormField(field.id, "maxSize", Number(e.target.value))
                                    }
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={field.required}
                                  onCheckedChange={(checked) =>
                                    updateFormField(field.id, "required", checked)
                                  }
                                />
                                <span>Bắt buộc</span>
                              </div>
                              <Button
                                variant="destructive"
                                onClick={() => deleteFormField(field.id)}
                              >
                                Xóa Field
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col gap-2 border-t pt-2">
                      <h5 className="font-semibold">Thêm Field Mới</h5>
                      <Input
                        value={newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        placeholder="Tên field"
                      />
                      <Select
                        value={newField.type}
                        onValueChange={(value) =>
                          setNewField({ ...newField, type: value as FormField["type"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kiểu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="datetime">Datetime</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="upload">Upload</SelectItem>
                        </SelectContent>
                      </Select>
                      {newField.type === "select" && (
                        <div className="flex flex-col gap-2">
                          <span className="text-sm">Tùy chọn</span>
                          {newField.options?.map((option) => (
                            <div key={option} className="flex items-center gap-2">
                              <Input value={option} readOnly />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteOption(option)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                              placeholder="Nhập tùy chọn"
                            />
                            <Button onClick={addOption}>Thêm</Button>
                          </div>
                        </div>
                      )}
                      {newField.type === "upload" && (
                        <div className="flex flex-col gap-2">
                          <span className="text-sm">Loại file cho phép</span>
                          <Input
                            value={newField.allowedTypes?.join(", ") || ""}
                            onChange={(e) =>
                              setNewField({ ...newField, allowedTypes: e.target.value.split(", ") })
                            }
                            placeholder="Ví dụ: image/*, application/pdf"
                          />
                          <span className="text-sm">Kích thước tối đa (MB)</span>
                          <Input
                            type="number"
                            value={newField.maxSize || 5}
                            onChange={(e) =>
                              setNewField({ ...newField, maxSize: Number(e.target.value) })
                            }
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={newField.required}
                          onCheckedChange={(checked) =>
                            setNewField({ ...newField, required: checked })
                          }
                        />
                        <span>Bắt buộc</span>
                      </div>
                      <Button onClick={addFormField}>Thêm Field</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-4">
              <div className="text-center">
                <p className="text-gray-500">Chọn bước để thiết lập</p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}