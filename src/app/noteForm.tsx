export default function NoteForm() {
    return (
      <>
        <input data-testid="note-name-field" placeholder="Note Name" />
        <input data-testid="note-description-field" placeholder="Note Description" />
        <button data-testid="note-form-submit" type="button">
          Create Note
        </button>
        <p data-testid="test-name-0">test note</p>
        <p data-testid="test-description-0">test note description</p>
      </>
    );
  }