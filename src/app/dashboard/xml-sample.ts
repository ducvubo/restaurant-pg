export const xmlSample = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="Process_1" isExecutable="true">
    <startEvent id="Event_1hfg4oi">
      <outgoing>Flow_15tppwz</outgoing>
    </startEvent>
    <task id="Activity_0517e1y" name="Bước 1: Đặt hàng" performer="customer" useForm="true" formFields="[{&#34;id&#34;:&#34;79bb84a1-edd9-4a7a-b618-5a1e8e6a1826&#34;,&#34;label&#34;:&#34;Tên&#34;,&#34;type&#34;:&#34;text&#34;,&#34;required&#34;:true,&#34;options&#34;:[],&#34;allowedTypes&#34;:[&#34;image/*&#34;,&#34;application/pdf&#34;],&#34;maxSize&#34;:5},{&#34;id&#34;:&#34;3c17ec51-5e2e-4e6b-a971-777ac6809d87&#34;,&#34;label&#34;:&#34;Địa chỉ&#34;,&#34;type&#34;:&#34;text&#34;,&#34;required&#34;:true,&#34;options&#34;:[],&#34;allowedTypes&#34;:[&#34;image/*&#34;,&#34;application/pdf&#34;],&#34;maxSize&#34;:5}]">
      <incoming>Flow_15tppwz</incoming>
      <outgoing>Flow_1h5f5pa</outgoing>
    </task>
    <task id="Activity_0a2l18e" name="Bước 2: Xác nhận đặt hàng" performer="customer">
      <incoming>Flow_1h5f5pa</incoming>
      <outgoing>Flow_02iq8yg</outgoing>
      <outgoing>Flow_1dka3uv</outgoing>
    </task>
    <task id="Activity_0d9byo1" name="Quá Hạn xác nhân" performer="customer">
      <incoming>Flow_02iq8yg</incoming>
      <outgoing>Flow_1umjgid</outgoing>
    </task>
    <sequenceFlow id="Flow_02iq8yg" sourceRef="Activity_0a2l18e" targetRef="Activity_0d9byo1" />
    <sequenceFlow id="Flow_15tppwz" sourceRef="Event_1hfg4oi" targetRef="Activity_0517e1y" />
    <sequenceFlow id="Flow_1h5f5pa" sourceRef="Activity_0517e1y" targetRef="Activity_0a2l18e" />
    <endEvent id="Event_0x8a7m2">
      <incoming>Flow_1umjgid</incoming>
    </endEvent>
    <sequenceFlow id="Flow_1umjgid" sourceRef="Activity_0d9byo1" targetRef="Event_0x8a7m2" />
    <task id="Activity_1dqbkvf" name="Bước 3: Nhà hàng xác nhân" performer="restaurant">
      <incoming>Flow_1dka3uv</incoming>
      <outgoing>Flow_1x6l1uq</outgoing>
    </task>
    <sequenceFlow id="Flow_1dka3uv" sourceRef="Activity_0a2l18e" targetRef="Activity_1dqbkvf" />
    <task id="Activity_0n9dyrg" name="Nhà hàng giao hàng" performer="restaurant">
      <incoming>Flow_1x6l1uq</incoming>
      <outgoing>Flow_1a3lp1g</outgoing>
      <outgoing>Flow_11xdl9l</outgoing>
    </task>
    <sequenceFlow id="Flow_1x6l1uq" sourceRef="Activity_1dqbkvf" targetRef="Activity_0n9dyrg" />
    <task id="Activity_1qff74o" name="Khách hàng nhận hàng" performer="customer">
      <incoming>Flow_1a3lp1g</incoming>
      <outgoing>Flow_0rtk46s</outgoing>
      <outgoing>Flow_0oir6hf</outgoing>
    </task>
    <sequenceFlow id="Flow_1a3lp1g" sourceRef="Activity_0n9dyrg" targetRef="Activity_1qff74o" />
    <task id="Activity_0fsbumn" name="Khách hàng không nhận hàng" performer="restaurant">
      <incoming>Flow_11xdl9l</incoming>
      <outgoing>Flow_0a9e9by</outgoing>
    </task>
    <sequenceFlow id="Flow_11xdl9l" sourceRef="Activity_0n9dyrg" targetRef="Activity_0fsbumn" />
    <endEvent id="Event_03dmkde">
      <incoming>Flow_0a9e9by</incoming>
    </endEvent>
    <sequenceFlow id="Flow_0a9e9by" sourceRef="Activity_0fsbumn" targetRef="Event_03dmkde" />
    <task id="Activity_0urx116" name="Khách hàng đánh giá" performer="customer" useForm="true">
      <incoming>Flow_0rtk46s</incoming>
      <outgoing>Flow_005ttxo</outgoing>
    </task>
    <task id="Activity_1lnqysu" name="Nhà hàng phản hồi" performer="restaurant" useForm="true">
      <incoming>Flow_005ttxo</incoming>
      <outgoing>Flow_1gpckdl</outgoing>
    </task>
    <endEvent id="Event_08ppycm">
      <incoming>Flow_1gpckdl</incoming>
    </endEvent>
    <sequenceFlow id="Flow_0rtk46s" sourceRef="Activity_1qff74o" targetRef="Activity_0urx116" />
    <sequenceFlow id="Flow_005ttxo" sourceRef="Activity_0urx116" targetRef="Activity_1lnqysu" />
    <sequenceFlow id="Flow_1gpckdl" sourceRef="Activity_1lnqysu" targetRef="Event_08ppycm" />
    <task id="Activity_14q07np" name="Khách hàng khiếu lại" performer="customer" useForm="true">
      <incoming>Flow_0oir6hf</incoming>
      <outgoing>Flow_0ff6l9c</outgoing>
    </task>
    <sequenceFlow id="Flow_0oir6hf" sourceRef="Activity_1qff74o" targetRef="Activity_14q07np" />
    <task id="Activity_045o6mk" name="Nhà hàng giải quyết khiếu lại" performer="restaurant" useForm="true">
      <incoming>Flow_0ff6l9c</incoming>
      <outgoing>Flow_1wpu5md</outgoing>
    </task>
    <endEvent id="Event_03hlxca">
      <incoming>Flow_1wpu5md</incoming>
    </endEvent>
    <sequenceFlow id="Flow_0ff6l9c" sourceRef="Activity_14q07np" targetRef="Activity_045o6mk" />
    <sequenceFlow id="Flow_1wpu5md" sourceRef="Activity_045o6mk" targetRef="Event_03hlxca" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="Event_1hfg4oi_di" bpmnElement="Event_1hfg4oi">
        <dc:Bounds x="72" y="282" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0517e1y_di" bpmnElement="Activity_0517e1y">
        <dc:Bounds x="150" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0a2l18e_di" bpmnElement="Activity_0a2l18e">
        <dc:Bounds x="300" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0d9byo1_di" bpmnElement="Activity_0d9byo1">
        <dc:Bounds x="300" y="370" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0x8a7m2_di" bpmnElement="Event_0x8a7m2">
        <dc:Bounds x="322" y="502" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1dqbkvf_di" bpmnElement="Activity_1dqbkvf">
        <dc:Bounds x="500" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0n9dyrg_di" bpmnElement="Activity_0n9dyrg">
        <dc:Bounds x="700" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1qff74o_di" bpmnElement="Activity_1qff74o">
        <dc:Bounds x="880" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0fsbumn_di" bpmnElement="Activity_0fsbumn">
        <dc:Bounds x="700" y="380" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_03dmkde_di" bpmnElement="Event_03dmkde">
        <dc:Bounds x="722" y="502" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0urx116_di" bpmnElement="Activity_0urx116">
        <dc:Bounds x="880" y="380" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1lnqysu_di" bpmnElement="Activity_1lnqysu">
        <dc:Bounds x="880" y="510" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_08ppycm_di" bpmnElement="Event_08ppycm">
        <dc:Bounds x="912" y="632" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_14q07np_di" bpmnElement="Activity_14q07np">
        <dc:Bounds x="1040" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_03hlxca_di" bpmnElement="Event_03hlxca">
        <dc:Bounds x="1382" y="272" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_045o6mk_di" bpmnElement="Activity_045o6mk">
        <dc:Bounds x="1200" y="250" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_02iq8yg_di" bpmnElement="Flow_02iq8yg">
        <di:waypoint x="350" y="330" />
        <di:waypoint x="350" y="370" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_15tppwz_di" bpmnElement="Flow_15tppwz">
        <di:waypoint x="108" y="300" />
        <di:waypoint x="129" y="300" />
        <di:waypoint x="129" y="290" />
        <di:waypoint x="150" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1h5f5pa_di" bpmnElement="Flow_1h5f5pa">
        <di:waypoint x="250" y="290" />
        <di:waypoint x="300" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1umjgid_di" bpmnElement="Flow_1umjgid">
        <di:waypoint x="350" y="450" />
        <di:waypoint x="350" y="476" />
        <di:waypoint x="340" y="476" />
        <di:waypoint x="340" y="502" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1dka3uv_di" bpmnElement="Flow_1dka3uv">
        <di:waypoint x="400" y="290" />
        <di:waypoint x="500" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1x6l1uq_di" bpmnElement="Flow_1x6l1uq">
        <di:waypoint x="600" y="290" />
        <di:waypoint x="700" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1a3lp1g_di" bpmnElement="Flow_1a3lp1g">
        <di:waypoint x="800" y="290" />
        <di:waypoint x="880" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_11xdl9l_di" bpmnElement="Flow_11xdl9l">
        <di:waypoint x="750" y="330" />
        <di:waypoint x="750" y="380" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0a9e9by_di" bpmnElement="Flow_0a9e9by">
        <di:waypoint x="750" y="460" />
        <di:waypoint x="750" y="481" />
        <di:waypoint x="740" y="481" />
        <di:waypoint x="740" y="502" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0rtk46s_di" bpmnElement="Flow_0rtk46s">
        <di:waypoint x="930" y="330" />
        <di:waypoint x="930" y="380" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_005ttxo_di" bpmnElement="Flow_005ttxo">
        <di:waypoint x="930" y="460" />
        <di:waypoint x="930" y="510" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1gpckdl_di" bpmnElement="Flow_1gpckdl">
        <di:waypoint x="930" y="590" />
        <di:waypoint x="930" y="632" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0oir6hf_di" bpmnElement="Flow_0oir6hf">
        <di:waypoint x="980" y="290" />
        <di:waypoint x="1040" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ff6l9c_di" bpmnElement="Flow_0ff6l9c">
        <di:waypoint x="1140" y="290" />
        <di:waypoint x="1200" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1wpu5md_di" bpmnElement="Flow_1wpu5md">
        <di:waypoint x="1300" y="290" />
        <di:waypoint x="1382" y="290" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`