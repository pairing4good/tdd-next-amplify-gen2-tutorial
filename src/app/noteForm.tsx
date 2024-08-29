import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState } from "react";
import { StorageManager } from '@aws-amplify/ui-react-storage';
import "@aws-amplify/ui-react/styles.css";


export default function NoteForm() {
  const client = generateClient<Schema>();
  const [formData, setFormData] = useState({ name: "", description: "", imageLocation: ""});

  function createNote() {
    if (!formData.name || !formData.description) return;
    client.models.Note.create(formData);
    setFormData({ name: '', description: '', imageLocation: '' });
  }

  const handleFileSuccess = ({ key }: { key?: string }) => {
    if (key) {
      setFormData({...formData, imageLocation: key});
    } 
  };

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
      <StorageManager
          acceptedFileTypes={['image/*']}
          path={({ identityId }) => `protected/${identityId}/`}
          maxFileCount={1}
          maxFileSize={500000}
          isResumable
          onUploadSuccess={handleFileSuccess} 
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