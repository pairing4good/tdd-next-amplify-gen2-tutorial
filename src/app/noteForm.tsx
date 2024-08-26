import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState } from "react";


export default function NoteForm() {
  const client = generateClient<Schema>();
  const [formData, setFormData] = useState({ name: "", description: "" });

  function createNote() {
    if (!formData.name || !formData.description) return;
    client.models.Note.create(formData);
    setFormData({ name: '', description: '' });
  }

  return (
    <div data-testid="note-form">
      <input
        data-testid="note-name-field"
        onChange={(e) =>
          setFormData({
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
          setFormData({
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
    </div>
  );
}