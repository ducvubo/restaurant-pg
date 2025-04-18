// "use client";
// class CustomContextPadProvider {
//   constructor(contextPad, modeling, elementFactory, translate, eventBus) {
//     this.modeling = modeling;
//     this.elementFactory = elementFactory;
//     this.translate = translate;
//     this.eventBus = eventBus;
//     contextPad.registerProvider(this);
//   }

//   getContextPadEntries(element) {
//     return (entries) => {
//       delete entries["replace"];
//       delete entries["append.intermediate-event"];
//       delete entries["append.append-task"];
//       delete entries["append.end-event"];
//       delete entries["append.gateway"];
//       return entries;
//     };
//   }
// }
// export default CustomContextPadProvider;