import { Note } from "./types";

interface Parameters {
  notes: Note[];
  formData: Note;
  setFormDataCallback: (data: Note) => void;
  setNotesCallback: (notes: Note[]) => void;
}

export default function NoteForm({
  notes,
  formData,
  setFormDataCallback,
  setNotesCallback,
}: Parameters) {
  return (
    <>
      <input
        data-testid="note-name-field"
        onChange={(e) =>
          setFormDataCallback({
            ...formData,
            name: e.target.value,
          })
        }
        placeholder="Note Name"
      />
      <input
        data-testid="note-description-field"
        onChange={(e) =>
          setFormDataCallback({
            ...formData,
            description: e.target.value,
          })
        }
        placeholder="Note Description"
      />
      <button
        data-testid="note-form-submit"
        type="button"
        onClick={() => setNotesCallback([...notes, formData])}
      >
        Create Note
      </button>
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </>
  );
}