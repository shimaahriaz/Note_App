import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { logoutAction } from "@/actions/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--note-border)] bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--note-muted)] uppercase tracking-widest font-medium">
              Personal
            </span>
            <h1
              className="text-2xl leading-tight text-[var(--note-text)]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              My Notes
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--note-muted)]">
              {session.user?.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs text-[var(--note-danger)] hover:underline"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {children}
      </main>
    </div>
  )
}
