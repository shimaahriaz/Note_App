"use client"

import { useState } from "react"
import { NoteList } from "@/components/notes/NoteList"
import { NoteForm } from "@/components/notes/NoteForm"
import { SearchBar } from "@/components/notes/SearchBar"
import { useDebounce } from "@/hooks/useDebounce"

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  return (
    <>
      <div className="flex justify-end">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <section className="bg-white border border-[var(--note-border)] rounded-2xl shadow-sm">
        <NoteForm />
      </section>

      <section>
        <NoteList searchQuery={debouncedSearch} />
      </section>
    </>
  )
}
