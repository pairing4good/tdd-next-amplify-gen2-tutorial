import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { remove } from 'aws-amplify/storage';

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

  function deleteNote(id: string) {
    client.models.Note.delete({id}).then( (note) => {
      const imageLocation = note.data?.imageLocation;
      if (imageLocation) {
        remove({ path: imageLocation });
      }
    }).catch((error) => {
      console.error('Error deleting note:', error)
    })
  }

  return (
    <div data-testid="note-list">
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
          {note.imageLocation && (<StorageImage
            data-testid={`note-image-${index}`}
            alt={`note image ${index}`}
            path={`${note.imageLocation}`}
          />)}
          <button
            type="button"
            data-testid={`test-delete-button-${index}`}
            onClick={() => deleteNote(note.id)}>
            Delete note
          </button>
        </div>
      ))}
    </div>
  );
}