// 'use client';
// import React, { useState } from 'react';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import { permissions } from './policy';

// const PermissionTree: React.FC = () => {
//   const [openModules, setOpenModules] = useState<string[]>([]);
//   const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(new Set());

//   const toggleModule = (key: string) => {
//     setOpenModules((prev) =>
//       prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
//     );
//   };

//   const handleCheckboxChange = (actionKey: string) => {
//     setCheckedPermissions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(actionKey)) {
//         newSet.delete(actionKey);
//       } else {
//         newSet.add(actionKey);
//       }
//       return newSet;
//     });
//   };

//   const handleSave = () => {
//     const selectedKeys = Array.from(checkedPermissions);
//     console.log('Selected Permission Keys:', selectedKeys);
//     // You can handle the selected keys here (e.g., send to an API)
//   };

//   return (
//     <div className="w-full p-4 bg-gray-50 rounded-lg shadow-sm">
//       {permissions.map((module) => (
//         <Collapsible
//           key={module.key}
//           open={openModules.includes(module.key)}
//           onOpenChange={() => toggleModule(module.key)}
//           className="mb-2"
//         >
//           <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
//             <span className="text-lg font-semibold text-gray-800">{module.name}</span>
//             {openModules.includes(module.key) ? (
//               <ChevronDown className="w-5 h-5 text-gray-600" />
//             ) : (
//               <ChevronRight className="w-5 h-5 text-gray-600" />
//             )}
//           </CollapsibleTrigger>

//           {/* Module Functions */}
//           <CollapsibleContent className="mt-1">
//             {module.functions.map((func) => (
//               <div key={func.key} className="ml-4 p-2 border-b border-gray-200">
//                 <div className="text-sm font-medium text-gray-700">{func.name}</div>
//                 <div className="flex flex-wrap gap-4 mt-2">
//                   {func.actions.map((action) => {
//                     const actionKey = `${func.key}_${action.key}`;
//                     return (
//                       <div key={actionKey} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={actionKey}
//                           checked={checkedPermissions.has(actionKey)}
//                           onCheckedChange={() => handleCheckboxChange(actionKey)}
//                         />
//                         <label
//                           htmlFor={actionKey}
//                           className="text-sm text-gray-600 cursor-pointer"
//                         >
//                           {action.method}
//                         </label>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </CollapsibleContent>
//         </Collapsible>
//       ))}
//       {/* Save Button */}
//       <div className="mt-4 flex justify-end">
//         <button
//           onClick={handleSave}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Lưu
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PermissionTree;