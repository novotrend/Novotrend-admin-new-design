// "use client";

// import { useState } from "react";

// import FormInput from "@/components/common/forms/FormInput";
// import FormSection from "@/components/common/forms/FormSection";
// import FormSubmit from "@/components/common/forms/FormSubmit";
// import { useEditExchangerMutation } from "@/services/exchanger-edit/exchanger-edit.query";

// export default function ExchangeEdits() {
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const { mutate, isPending } = useEditExchangerMutation();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!value.trim()) {
//       setError("Please enter exchanger value");
//       return;
//     }
//     if (isNaN(Number(value))) {
//       setError("Please enter a valid number");
//       return;
//     }
//     setError("");
//     mutate(
//       {
//         val: value,
//       },
//       {
//         onSuccess: () => {
//           setValue("");
//         },
//       },
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <FormSection title="Exchanger Edit" description="Exchanger Value">
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           <FormInput
//             label="Exchanger Value"
//             placeholder="Enter Exchange Value"
//             value={value}
//             onChange={(e) => {
//               const input = e.target.value;
//               if (/^\d*\.?\d*$/.test(input)) {
//                 setValue(input);

//                 if (error) {
//                   setError("");
//                 }
//               }
//             }}
//             error={error}
//           />
//         </div>

//         <div className="mt-8 flex justify-end">
//           <FormSubmit
//             title={isPending ? "Submitting..." : "Submit"}
//             disabled={isPending}
//           />
//         </div>
//       </FormSection>
//     </form>
//   );
// }
