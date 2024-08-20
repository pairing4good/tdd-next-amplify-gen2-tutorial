"use client";

import React, { useState, useEffect } from "react";
import NoteForm from "./noteForm";
import { Note } from "./types";
import NoteList from "./noteList";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: "", description: "" });

  useEffect(() => {
    fetchNotesCallback();
  }, []);

  const fetchNotesCallback = () => {
    const savedNotesString = localStorage.getItem("notes");
    const savedNotes = savedNotesString ? JSON.parse(savedNotesString) : null;

    if (savedNotes) return setNotes(savedNotes);
    return setNotes([]);
  };

  const createNote = () => {
    const updatedNoteList = [...notes, formData];
    setNotes(updatedNoteList);
    const updatedNotesListString = JSON.stringify(updatedNoteList);
    localStorage.setItem('notes', updatedNotesListString);
  };

  return (
    <>
      <NoteForm
        notes={notes}
        formData={formData}
        setFormDataCallback={setFormData}
        setNotesCallback={createNote}
      />
      <NoteList notes={notes} />
    </>
  );
}
