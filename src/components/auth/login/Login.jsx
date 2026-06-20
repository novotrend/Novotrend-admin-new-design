// "use client";

// import { useLoginMutation } from "@/services/auth/auth.mutation";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// export default function Login() {
//   const router = useRouter();
//   const [errorMessage, setErrorMessage] = useState("");

//   const { register, handleSubmit } = useForm({
//     defaultValues: {
//       username: "",
//       password: "",
//     },
//   });

//   const { mutate, isPending } = useLoginMutation();

//   const onSubmit = data => {
//     setErrorMessage("");
//     mutate(data, {
//       onSuccess: response => {
//         const authData = response?.response || response?.data?.response || response;
//         if (!authData?.token) {
//           setErrorMessage("Token not found");
//           return;
//         }
//         // clear old auth values
//         localStorage.removeItem("qr_secret");
//         localStorage.removeItem("qr_code");
//         // required values
//         localStorage.setItem("token", authData.token);
//         localStorage.setItem("auth_secret", String(authData.auth_secret ?? ""));
//         localStorage.setItem("staff_username", authData.staff_username ?? "");
//         localStorage.setItem("staff_name", authData.staff_name ?? "");
//         // save only for first login
//         if (String(authData.auth_secret) === "0") {
//           if (authData.qr_secret) {
//             localStorage.setItem("qr_secret", authData.qr_secret);
//           }
//           if (authData.qr_code) {
//             localStorage.setItem("qr_code", authData.qr_code);
//           }
//         }

//         router.push("/authcation");
//       },
//       onError: error => {
//         setErrorMessage(error?.message || "Login failed. Please check credentials.");
//       },
//     });
//   };

//   return (
//     <div className="relative flex min-h-screen overflow-hidden bg-[#020817]">
//       <div className="absolute inset-0">
//         <Image src="/forex.jpg" alt="Background" fill priority className="object-cover" />
//         <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
//         <div className="absolute left-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-primary/20 blur-3xl" />

//         <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl" />
//       </div>
//       <div className="relative z-10 grid w-full grid-cols-1 lg:grid-cols-2">
//         <div className="hidden flex-col justify-between px-16 py-14 lg:flex">
//           <div>
//             <Image src="/QAAFIE2-white.png" alt="QAAFIE Logo" width={180} height={60} priority />
//           </div>
//           <div className="max-w-xl space-y-6">
//             <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
//               Modern Trading CRM Panel
//             </span>

//             <h2 className="text-5xl font-bold leading-tight text-white">
//               Manage Trading,
//               <br />
//               KYC, MT5 & Transactions
//               <br />
//               in One Platform
//             </h2>
//             <p className="text-slate-400">
//               Powerful admin dashboard for handling trading operations.
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center justify-center px-6 py-10">
//           <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
//             <div className="mb-10 text-center">
//               <Image src="/qaafie.png" alt="Logo" width={42} height={42} className="mx-auto" />

//               <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>

//               <p className="mt-2 text-sm text-slate-400">Login to access your admin dashboard</p>
//             </div>

//             <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//               <div>
//                 <label className="mb-2 block text-sm text-slate-300">Username</label>

//                 <input
//                   type="text"
//                   {...register("username")}
//                   placeholder="Enter your username"
//                   className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm text-slate-300">Password</label>

//                 <input
//                   type="password"
//                   {...register("password")}
//                   placeholder="Enter your password"
//                   className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isPending}
//                 className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-60"
//               >
//                 {isPending ? "Logging..." : "Login to Dashboard"}
//               </button>
//             </form>

//             {errorMessage && (
//               <div className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
//                 {errorMessage}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useAuth } from "@/context/AuthContext";
import { useLoginMutation } from "@/services/auth/auth.mutation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const { login } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (token && isLoggedIn === "true") {
      window.location.replace("/");
      return;
    }

    if (token) {
      window.location.replace("/authcation");
    }
  }, []);

  const onSubmit = data => {
    setErrorMessage("");

    mutate(data, {
      onSuccess: response => {
        
        const authData = response?.response || response?.data?.response || response;

        if (!authData?.token) {
          setErrorMessage("Token not found");
          return;
        }

        // CLEAR OLD AUTH VALUES
        localStorage.removeItem("qr_secret");
        localStorage.removeItem("qr_code");
        localStorage.removeItem("isLoggedIn");

        // SAVE COMPLETE USER DATA IN CONTEXT
        login({
          token: authData.token,
          auth_secret: authData.auth_secret,
          staff_id: authData.staff_id,
          staff_name: authData.staff_name,
          staff_username: authData.staff_username,
          permission: authData.permission || [],
        });

        // OPTIONAL LOCAL STORAGE VALUES
        localStorage.setItem("auth_secret", String(authData.auth_secret ?? ""));

        // FIRST LOGIN QR DATA
        if (String(authData.auth_secret) === "0") {
          if (authData.qr_secret) {
            localStorage.setItem("qr_secret", authData.qr_secret);
          }

          if (authData.qr_code) {
            localStorage.setItem("qr_code", authData.qr_code);
          }
        }

        
        window.location.replace("/authcation");
      },

      onError: error => {
        
        setErrorMessage(error?.message || "Login failed. Please check credentials.");
      },
    });
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#020817]">
      <div className="absolute inset-0">
        <Image src="/forex.jpg" alt="Background" fill priority className="object-cover" />

        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

        <div className="absolute left-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full grid-cols-1 lg:grid-cols-2">
        <div className="hidden flex-col justify-between px-16 py-14 lg:flex">
          <div>
            <Image src="/QAAFIE2-white.png" alt="QAAFIE Logo" width={180} height={60} priority />
          </div>

          <div className="max-w-xl space-y-6">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              Modern Trading CRM Panel
            </span>

            <h2 className="text-5xl font-bold leading-tight text-white">
              Manage Trading,
              <br />
              KYC, MT5 & Transactions
              <br />
              in One Platform
            </h2>

            <p className="text-slate-400">
              Powerful admin dashboard for handling trading operations.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
            <div className="mb-10 text-center">
              <Image src="/qaafie.png" alt="Logo" width={42} height={42} className="mx-auto" />

              <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>

              <p className="mt-2 text-sm text-slate-400">Login to access your admin dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Username</label>

                <input
                  type="text"
                  {...register("username")}
                  placeholder="Enter your username"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 pr-14 text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-900 transition-all hover:bg-slate-200 hover:text-black"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-60"
              >
                {isPending ? "Logging..." : "Login to Dashboard"}
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
