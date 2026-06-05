"use client"

import { useState } from "react"
import { NoteList } from "@/components/notes/NoteList"
import { NoteForm } from "@/components/notes/NoteForm"
import { SearchBar } from "@/components/notes/SearchBar"
import { useDebounce } from "@/hooks/useDebounce"

export default function HomePage() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  return (
    <div className="min-h-screen bg-amber-50/40">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-amber-200 bg-amber-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-medium">
              Personal
            </span>

            <h1
              className="text-2xl leading-tight text-amber-900"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              My Notes 📝
            </h1>
          </div>

          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-6 py-10">
        
        {/* Create Form */}
        <section >
         

          <NoteForm />
        </section>

        {/* Notes List */}
        <section>
          <NoteList searchQuery={debouncedSearch} />
        </section>
      </main>
    </div>
  )
}