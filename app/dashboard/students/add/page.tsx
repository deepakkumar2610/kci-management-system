// "use client";

// import { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// import Stepper from "@/app/components/Stepper";
// import Section from "@/app/components/Section";
// import { Input, Select } from "@/app/components/FormFields";
// import { AdmissionFormValues } from "@/types/admission";
// import apiHandler from "@/lib/api";

// export default function StudentAddPage() {
//   const [step, setStep] = useState(0);

//   const steps = [
//     "Student Details",
//     "Parent Details",
//     "Academic Details",
//     "Academic Enrollment   ",
//     "Declaration",
//   ];

//   const stepFields = [
//     ["fullName", "contact"],
//     ["parentName", "parentContact"],
//     ["lastSchool"],
//     ["currentClass"],
//     ["declaration"],
//   ];

//   const formik = useFormik<AdmissionFormValues>({
//     initialValues: {
//       fullName: "",
//       gender: "",
//       dob: "",
//       bloodGroup: "",
//       aadhar: "",
//       contact: "",
//       email: "",

//       parentName: "",
//       relation: "",
//       occupation: "",
//       parentContact: "",
//       parentEmail: "",
//       address: "",
//       motherName: "",

//       lastSchool: "",
//       previousBoard: "",
//       previousClass: "",
//       percentage: "",
//       previousMedium: "",

//       currentClass: "",
//       currentMedium: "",
//       batch: "",
//       subjects: "",

//       declaration: false,
//       photo: null,
//     },

//     validationSchema: Yup.object({
//       fullName: Yup.string().required("Required"),
//       contact: Yup.string().required("Required"),
//       parentName: Yup.string().required("Required"),
//       currentClass: Yup.string().required("Required"),
//       declaration: Yup.boolean().oneOf([true], "Required"),
//     }),

//     onSubmit: async (values, { resetForm }) => {
//       try {
//         console.log("Formik Values:", values);

//         const formData = new FormData();

//         Object.entries(values).forEach(([key, value]) => {
//           if (value !== undefined && value !== null && value !== "") {
//             formData.append(key, value as any);
//           }
//         });

//         // 🔍 Debug
//         for (const pair of formData.entries()) {
//           console.log(pair[0], pair[1]);
//         }

//         await apiHandler.post("/addstudent", formData);

//         alert("Submitted ✅");
//         resetForm();
//       } catch (error) {
//         console.error(error);
//       }
//     },
//   });

//   const nextStep = async () => {
//     const errors = await formik.validateForm();

//     const currentFields = stepFields[step];

//     const hasError = currentFields.some(
//       (field) => errors[field as keyof typeof errors],
//     );

//     if (hasError) {
//       formik.setTouched(
//         currentFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
//       );
//       return;
//     }

//     setStep((prev) => prev + 1);
//   };

//   const prevStep = () => setStep((prev) => prev - 1);

//   return (
//     <div className="p-6 bg-white shadow rounded">
//       <Stepper steps={steps} currentStep={step} />

//       <form onSubmit={formik.handleSubmit} className="space-y-6">
//         {step === 0 && (
//           <Section title="Student Details">
//             <Input formik={formik} name="fullName" placeholder="Full Name" />
//             <Select
//               formik={formik}
//               name="gender"
//               options={["Male", "Female"]}
//             />
//             <Input formik={formik} name="contact" placeholder="Contact" />
//           </Section>
//         )}

//         {step === 1 && (
//           <Section title="Parent Details">
//             <Input
//               formik={formik}
//               name="parentName"
//               placeholder="Parent Name"
//             />
//             <Input formik={formik} name="parentContact" placeholder="Contact" />
//           </Section>
//         )}

//         {step === 2 && (
//           <Section title="Previous Academic">
//             <Input formik={formik} name="lastSchool" placeholder="School" />
//           </Section>
//         )}

//         {step === 3 && (
//           <Section title="Current Details">
//             <Input formik={formik} name="currentClass" placeholder="Class" />
//           </Section>
//         )}

//         {step === 4 && (
//           <>
//             <input
//               type="checkbox"
//               name="declaration"
//               onChange={formik.handleChange}
//             />
//             Accept Declaration
//           </>
//         )}

//         <div className="flex justify-between">
//           {step > 0 && (
//             <button type="button" onClick={prevStep}>
//               Back
//             </button>
//           )}

//           {step < steps.length - 1 ? (
//             <button type="button" onClick={nextStep}>
//               Next
//             </button>
//           ) : (
//             <button type="submit">Submit</button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }
import StudentForm from "@/app/components/StudentForm";

export default function Page() {
  return <StudentForm />;
}
