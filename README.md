# TDD AWS Amplify Next App - Step 15

## Add Note Deletion

In order to add note deletion, let's drive this from the Cypress test. This will help in cleaning up notes that were created during the UI test.

- Add a deletion test to the Cypress test

```js
it('should delete note', () => {
  cy.get('[data-testid=test-delete-button-0]').click();

  cy.get('[data-testid=test-name-0]').should('not.exist');
  cy.get('[data-testid=test-description-0]').should('not.exist');
});

it('should have an option to sign out', () => {
...
```

- Run the Cypress test and verify that it Fails

- To make it go green, add a new `deleteNote` function to the `NoteList` component

```js
...
export default function NoteList() {
  ...

  function deleteNote(id: string) {
    client.models.Note.delete({id})
  }

  return (
    ...
  );
}
```

- Add a deletion button that calls the `deleteNote` function

```js
...

export default function NoteList() {
  ...

  return (
    <div data-testid="note-list">
      {notes.map((note, index) => (
        <div key={index}>
          ...
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
```

- Run all the tests
- Green
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/014-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/016-step)
