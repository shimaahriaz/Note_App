"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-600" />

      <Input
        type="search"
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          pl-9
          border-amber-200
          bg-amber-50/60
          text-amber-900
          placeholder:text-amber-600/60
          focus-visible:ring-amber-400
          focus-visible:border-amber-300
        "
      />
    </div>
  )
}