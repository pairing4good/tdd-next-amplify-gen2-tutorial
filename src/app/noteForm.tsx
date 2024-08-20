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

  function createNote() {
    if (!formData.name || !formData.description) return;
    setNotesCallback([...notes, formData]);
    setFormDataCallback({ name: '', description: '' });
  }

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
        value={formData.name}
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
        value={formData.description}
      />
      <button
        data-testid="note-form-submit"
        type="button"
        onClick={createNote}
      >
        Create Note
      </button>
    </>
  );
}