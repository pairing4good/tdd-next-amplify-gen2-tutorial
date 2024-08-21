"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React, { useState, useEffect } from "react";
import NoteForm from "./noteForm";
import { Note } from "./types";
import NoteList from "./noteList";
import { findAll, save } from "./noteRepository";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: "", description: "" });

  useEffect(() => {
    fetchNotesCallback();
  }, []);

  const fetchNotesCallback = () => {
    return setNotes(findAll());
  };

  const createNote = () => {
    save(formData);
    const notes = findAll();
    setNotes(notes);
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <button onClick={signOut}>Sign out</button>
          <NoteForm
            notes={notes}
            formData={formData}
            setFormDataCallback={setFormData}
            setNotesCallback={createNote}
          />
          <NoteList notes={notes} />
        </>
      )}
    </Authenticator>
  );
}
