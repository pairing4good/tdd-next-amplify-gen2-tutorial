import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

export default function NoteList() {
  const [notes, setNotes] = useState<Array<Schema["Note"]["type"]>>([]);
  const client = generateClient<Schema>();

  useEffect(() => {
    const sub = client.models.Note.observeQuery().subscribe({
      next: ({ items }) => {
        setNotes([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <div data-testid="note-list">
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </div>
  );
}