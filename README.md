# Notes App

A personal notes application built with a **Next.js** frontend and a **FastAPI** backend.

## Overview

This project allows users to manage notes with support for:
- creating notes
- searching notes by title or content
- editing existing notes
- deleting notes with a confirmation dialog
- optimistic UI updates and toast notifications

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Radix UI, React Query, Zod, Sonner
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **HTTP client:** Axios

## Project structure

- `notes-app/` — frontend application
- `Back-end/` — backend API

## Getting started

### Backend

1. Open a terminal in `Back-end/`.
2. Activate the Python virtual environment:

```bash
cd Back-end
source env/Scripts/activate
```

3. Verify `Back-end/.env` contains a valid `DATABASE_URL`.
4. Start the API server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will run at `http://127.0.0.1:8000`.

### Frontend

1. Open a terminal in `notes-app/`.
2. Install dependencies:

```bash
npm install
```

3. Start the Next.js development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Environment variables

The frontend uses `NEXT_PUBLIC_API_URL` to connect to the backend. If it is not set, the app defaults to:

```text
http://127.0.0.1:8000
```

## API endpoints

- `GET /notes` — fetch all notes
- `GET /notes/{note_id}` — fetch a single note
- `POST /notes` — create a new note
- `PUT /notes/{note_id}` — update a note
- `DELETE /notes/{note_id}` — delete a note

## Useful commands

From `notes-app/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

From `Back-end/`:

```bash
uvicorn main:app --reload
```

## Notes

- The delete flow now uses a reusable confirmation dialog component.
- React Query is used for data fetching and cache management.
- The backend includes CORS configuration for `http://localhost:3000`.

## Troubleshooting

- If the frontend cannot reach the API, confirm the backend is running and `NEXT_PUBLIC_API_URL` points to the correct address.
- If database migrations or tables are missing, make sure the configured PostgreSQL database is accessible and the `.env` values are correct.
