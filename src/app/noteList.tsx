import { Note } from "./types";

export default function NoteList({ notes }: { notes: Note[] }) {

  return (
    <>
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </>
  );
}