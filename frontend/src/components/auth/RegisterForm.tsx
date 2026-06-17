"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Mail, Lock, ShieldCheck, Loader2 } from "lucide-react"
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth"
import { registerAction } from "@/actions/auth"

export function RegisterForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    setIsPending(true)
    try {
      const result = await registerAction(values)

      if (result.error) {
        toast.error(result.error)
        return
      }

      // Account created — now sign in on the client (server action cannot call signIn)
      const loginResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (loginResult?.error) {
        toast.success("Account created! Please sign in.")
        router.push("/login")
        return
      }

      toast.success("Account created! Welcome aboard.")
      router.push("/")
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 pointer-events-none" />
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isPending}
              {...register("email")}
              className="
                w-full pl-10 pr-4 py-3 text-sm
                bg-amber-50 border border-amber-200 rounded-xl
                text-amber-900 placeholder:text-amber-400
                outline-none
                focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 pointer-events-none" />
            <input
              type="password"
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              disabled={isPending}
              {...register("password")}
              className="
                w-full pl-10 pr-4 py-3 text-sm
                bg-amber-50 border border-amber-200 rounded-xl
                text-amber-900 placeholder:text-amber-400
                outline-none
                focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Confirm Password
          </label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 pointer-events-none" />
            <input
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              disabled={isPending}
              {...register("confirmPassword")}
              className="
                w-full pl-10 pr-4 py-3 text-sm
                bg-amber-50 border border-amber-200 rounded-xl
                text-amber-900 placeholder:text-amber-400
                outline-none
                focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="
            w-full py-3 text-sm font-semibold rounded-xl
            bg-amber-500 hover:bg-amber-600 active:bg-amber-700
            text-white
            flex items-center justify-center gap-2
            cursor-pointer disabled:cursor-not-allowed disabled:opacity-60
            transition-all duration-150 shadow-sm hover:shadow-md
          "
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-amber-700">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-amber-600 hover:text-amber-800 hover:underline cursor-pointer transition-colors"
        >
          Sign in
        </a>
      </p>
    </div>
  )
}
