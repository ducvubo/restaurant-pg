// "use client";
// class CustomPaletteProvider {
//   constructor(
//     palette,
//     create,
//     elementFactory,
//     spaceTool,
//     lassoTool,
//     handTool,
//     globalConnect,
//     translate,
//     canvas
//   ) {
//     this.create = create;
//     this.canvas = canvas;
//     this.elementFactory = elementFactory;
//     this.spaceTool = spaceTool;
//     this.lassoTool = lassoTool;
//     this.handTool = handTool; // Added handTool
//     this.globalConnect = globalConnect;
//     this.translate = translate;
//     palette.registerProvider(this);
//   }

//   getPaletteEntries() {
//     const {
//       create,
//       elementFactory,
//       spaceTool,
//       lassoTool,
//       handTool,
//       globalConnect,
//       translate,
//       canvas
//     } = this;

//     return {
//       'reset-zoom': {
//         group: 'tools',
//         className: 'bpmn-icon-loop-marker', // bạn có thể dùng icon mặc định hoặc custom
//         title: 'Công cụ đặt lại khung hình',
//         action: {
//           click: function () {
//             canvas.zoom('fit-viewport');
//           }
//         }
//       },
//       "hand-tool": {
//         group: "tools",
//         className: "bpmn-icon-hand-tool",
//         title: translate("Công cụ di chuyển"),
//         action: {
//           click: (event) => handTool.toggle(),
//         },
//       },
//       "lasso-tool": {
//         group: "tools",
//         className: "bpmn-icon-lasso-tool",
//         title: translate("Công cụ chọn"),
//         action: {
//           click: (event) => lassoTool.toggle(),
//         },
//       },
//       "space-tool": {
//         group: "tools",
//         className: "bpmn-icon-space-tool",
//         title: translate("Công cụ di chuyển"),
//         action: {
//           click: (event) => spaceTool.toggle(),
//         },
//       },
//       "separator-1": {
//         group: "tools",
//         separator: true,
//       },
//       "global-connect-tool": {
//         group: "tools",
//         className: "bpmn-icon-connection-multi",
//         title: translate("Tạo hành động"),
//         action: {
//           click: (event) => globalConnect.toggle(),
//         },
//       },
//       "create.start-event": {
//         group: "event",
//         className: "bpmn-icon-start-event-none",
//         title: translate("Bắt đầu"),
//         action: {
//           dragstart: (event) => {
//             const shape = elementFactory.createShape({
//               type: "bpmn:StartEvent",
//             });
//             create.start(event, shape);
//           },
//           click: (event) => {
//             const shape = elementFactory.createShape({
//               type: "bpmn:StartEvent",
//             });
//             create.start(event, shape);
//           },
//         },
//       },
//       "create.task": {
//         group: "activity",
//         className: "bpmn-icon-task",
//         title: translate("Tạo bước"),
//         action: {
//           dragstart: (event) => {
//             const shape = elementFactory.createShape({ type: "bpmn:Task" });
//             create.start(event, shape);
//           },
//           click: (event) => {
//             const shape = elementFactory.createShape({ type: "bpmn:Task" });
//             create.start(event, shape);
//           },
//         },
//       },
//       "create.end-event": {
//         group: "event",
//         className: "bpmn-icon-end-event-none",
//         title: translate("Kết thúc"),
//         action: {
//           dragstart: (event) => {
//             const shape = elementFactory.createShape({
//               type: "bpmn:EndEvent",
//             });
//             create.start(event, shape);
//           },
//           click: (event) => {
//             const shape = elementFactory.createShape({
//               type: "bpmn:EndEvent",
//             });
//             create.start(event, shape);
//           },
//         },
//       }
//     };
//   }
// }
// export default CustomPaletteProvider;