// "use client";

// import { useFormik } from "formik";
// import * as Yup from "yup";

// export default function AddGrade() {
//   const formik = useFormik({
//     initialValues: {
//       gradeName: "",
//       board: "",
//       type: "",
//       subjects: "",
//       annualFees: "",
//       installments: "",
//       description: "",
//       status: "active",
//     },

//     validationSchema: Yup.object({
//       gradeName: Yup.string().required("Grade is required"),
//       board: Yup.string().required("Board is required"),
//       type: Yup.string().required("Type is required"),
//       annualFees: Yup.number()
//         .required("Fees required")
//         .positive("Must be positive"),
//       installments: Yup.number()
//         .required("Installments required")
//         .min(1, "Minimum 1"),
//     }),

//     onSubmit: (values) => {
//       console.log(values);
//     },
//   });

//   return (
//     <div className="w-full p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-semibold mb-4">Add Class / Grade</h2>

//       <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
//         {/* Grade Name */}
//         <div className="">
//           <input
//             name="gradeName"
//             placeholder="Enter Grade (e.g. 10th)"
//             onChange={formik.handleChange}
//             value={formik.values.gradeName}
//             className="w-full p-2 border rounded"
//           />
//           {formik.errors.gradeName && (
//             <p className="text-red-500 text-sm">{formik.errors.gradeName}</p>
//           )}
//         </div>

//         {/* Board */}
//         <div>
//           <input
//             name="board"
//             placeholder="Enter Board (SSC / CBSE)"
//             onChange={formik.handleChange}
//             value={formik.values.board}
//             className="w-full p-2 border rounded"
//           />
//           {formik.errors.board && (
//             <p className="text-red-500 text-sm">{formik.errors.board}</p>
//           )}
//         </div>

//         {/* Type */}
//         <div>
//           <select
//             name="type"
//             onChange={formik.handleChange}
//             value={formik.values.type}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Select Type</option>
//             <option value="school">School</option>
//             <option value="entrance">Entrance</option>
//           </select>
//           {formik.errors.type && (
//             <p className="text-red-500 text-sm">{formik.errors.type}</p>
//           )}
//         </div>

//         {/* Subjects */}
//         <div>
//           <input
//             name="subjects"
//             placeholder="Subjects (comma separated)"
//             onChange={formik.handleChange}
//             value={formik.values.subjects}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         {/* Fees */}
//         <div>
//           <input
//             type="number"
//             name="annualFees"
//             placeholder="Annual Fees"
//             onChange={formik.handleChange}
//             value={formik.values.annualFees}
//             className="w-full p-2 border rounded"
//           />
//           {formik.errors.annualFees && (
//             <p className="text-red-500 text-sm">{formik.errors.annualFees}</p>
//           )}
//         </div>

//         {/* Installments */}
//         <div>
//           <input
//             type="number"
//             name="installments"
//             placeholder="Installments Allowed"
//             onChange={formik.handleChange}
//             value={formik.values.installments}
//             className="w-full p-2 border rounded"
//           />
//           {formik.errors.installments && (
//             <p className="text-red-500 text-sm">{formik.errors.installments}</p>
//           )}
//         </div>

//         {/* Description */}
//         <div>
//           <textarea
//             name="description"
//             placeholder="Description (optional)"
//             onChange={formik.handleChange}
//             value={formik.values.description}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <select
//             name="status"
//             onChange={formik.handleChange}
//             value={formik.values.status}
//             className="w-full p-2 border rounded"
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="text-center bg-[#f7931e] text-white p-2 rounded hover:bg-[#e6821a]"
//         >
//           Save Class
//         </button>
//       </form>
//     </div>
//   );
// }
// "use client";
// import apiHandler from "@/lib/api";
// import { ApiError } from "next/dist/server/api-utils";
// import { useState } from "react";

// // 🔹 Field Type Definition
// type FieldType = "text" | "number" | "select" | "textarea";

// interface FieldConfig {
//   name: keyof FormDataType;
//   label: string;
//   type: FieldType;
// }

// // 🔹 Form Data Type
// interface FormDataType {
//   gradeName?: string;
//   board?: string;
//   type?: string;
//   subjects?: string;
//   annualFees?: number | "";
//   installments?: number | "";
//   description?: string;
//   status?: string;
// }

// export default function AddGradeDynamic() {
//   // 🔹 All fields config
//   const allFields: FieldConfig[] = [
//     { name: "gradeName", label: "Grade", type: "text" },
//     { name: "board", label: "Board", type: "text" },
//     { name: "type", label: "Type", type: "select" },
//     { name: "subjects", label: "Subjects", type: "text" },
//     { name: "annualFees", label: "Annual Fees", type: "number" },
//     { name: "installments", label: "Installments", type: "number" },
//     { name: "description", label: "Description", type: "textarea" },
//     { name: "status", label: "Status", type: "select" },
//   ];

//   // 🔹 State
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<FormDataType>({});
//   const [visibleFields, setVisibleFields] = useState<(keyof FormDataType)[]>([
//     "gradeName",
//   ]);
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);

//   // 🔹 Handle Change
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         e.target.type === "number"
//           ? value === ""
//             ? ""
//             : Number(value)
//           : value,
//     }));
//   };

//   // 🔹 Add Field
//   const addField = (fieldName: keyof FormDataType) => {
//     if (!visibleFields.includes(fieldName)) {
//       setVisibleFields((prev) => [...prev, fieldName]);
//     }
//     setShowDropdown(false);
//   };

//   // 🔹 Remove Field
//   const removeField = (fieldName: keyof FormDataType) => {
//     setVisibleFields((prev) => prev.filter((f) => f !== fieldName));

//     setFormData((prev) => {
//       const updated = { ...prev };
//       delete updated[fieldName];
//       return updated;
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       await apiHandler.post("/addclass", formData);

//       alert("Class saved successfully ✅");

//       // 🔹 Optional: Reset form
//       setFormData({});
//     } catch (error: unknown) {
//       console.error(error);
//       // alert(error.message || "Error saving data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-semibold mb-4">Add Class / Grade</h2>

//       {/* 🔹 Dynamic Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {visibleFields.map((fieldName) => {
//           const field = allFields.find((f) => f.name === fieldName);
//           if (!field) return null;

//           return (
//             <div key={field.name} className="flex flex-col gap-1">
//               {/* Label + Remove */}
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-medium">{field.label}</label>
//                 <button
//                   type="button"
//                   onClick={() => removeField(field.name)}
//                   className="text-red-500 text-xs"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Input Types */}
//               {field.type === "textarea" ? (
//                 <textarea
//                   name={field.name}
//                   value={formData[field.name] ?? ""}
//                   onChange={handleChange}
//                   className="p-2 border rounded"
//                 />
//               ) : field.type === "select" ? (
//                 <select
//                   name={field.name}
//                   value={formData[field.name] ?? ""}
//                   onChange={handleChange}
//                   className="p-2 border rounded"
//                 >
//                   <option value="">Select</option>

//                   {field.name === "type" && (
//                     <>
//                       <option value="school">School</option>
//                       <option value="entrance">Entrance</option>
//                     </>
//                   )}

//                   {field.name === "status" && (
//                     <>
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </>
//                   )}
//                 </select>
//               ) : (
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name] ?? ""}
//                   onChange={handleChange}
//                   className="p-2 border rounded"
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* 🔹 Add Field Dropdown */}
//       <div className="relative mt-4">
//         <button
//           type="button"
//           onClick={() => setShowDropdown(!showDropdown)}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           + Add Field
//         </button>

//         {showDropdown && (
//           <div className="absolute bg-white border rounded shadow mt-2 w-56 z-10">
//             {allFields
//               .filter((f) => !visibleFields.includes(f.name))
//               .map((field) => (
//                 <div
//                   key={field.name}
//                   onClick={() => addField(field.name)}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {field.label}
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* 🔹 Submit */}
//       <button
//         type="button"
//         onClick={handleSubmit}
//         className="w-full mt-6 bg-[#f7931e] text-white p-2 rounded hover:bg-[#e6821a]"
//       >
//         {loading ? "Loading..." : "Save Class"}
//       </button>
//     </div>
//   );
// }
import ClassForm from "@/app/components/ClassForm";
import BatchForm from "@/app/components/BatchForm";
import SubjectForm from "@/app/components/SubjectForm";
import FeeForm from "@/app/components/FeeForm";

export default function Page() {
  return (
    <>
      <ClassForm />
      <hr className="my-5" />
      <BatchForm />
      <hr className="my-5" />
      <SubjectForm />
      <hr className="my-5" />
      <FeeForm />
    </>
  );
}
