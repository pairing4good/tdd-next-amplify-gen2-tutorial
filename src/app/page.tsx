"use client";

import React, { useState } from "react";
import NoteForm from "./noteForm";
import { Note } from "./types";
import NoteList from "./noteList";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: "", description: "" });

  return (
    <>
      <NoteForm
        notes={notes}
        formData={formData}
        setFormDataCallback={setFormData}
        setNotesCallback={setNotes}
      />
      <NoteList notes={notes} />
    </>
  );
}
