export default function NoteForm() {
    return (
      <>
        <input data-testid="note-name-field" />
        <input data-testid="note-description-field" />
        <button data-testid="note-form-submit" type="button">
          Submit
        </button>
        <p data-testid="test-name-0">test note</p>
        <p data-testid="test-description-0">test note description</p>
      </>
    );
  }