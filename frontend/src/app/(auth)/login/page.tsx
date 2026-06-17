import { LoginForm } from "@/components/auth/LoginForm"
import { NotebookPen } from "lucide-react"

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a33 100%)" }}
    >
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 shadow-lg mb-4">
            <NotebookPen className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <h1
            className="text-3xl font-normal text-amber-900 leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-amber-600 mt-1.5">
            Sign in to continue to your notes
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-amber-200 rounded-2xl p-7 shadow-xl shadow-amber-100">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-amber-500 mt-6">
          Your thoughts, always safe and private.
        </p>

      </div>
    </div>
  )
}
