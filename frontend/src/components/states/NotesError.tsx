interface Props {
  message: string
  onRetry?: () => void
}

export function NotesError({ message, onRetry }: Props) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        
        <div className="mb-2 text-lg font-semibold text-red-600">
          Something went wrong ⚠️
        </div>

        <p className="mb-4 text-sm text-red-500">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        >
          Try again
        </button>
      </div>
    </div>
  )
}