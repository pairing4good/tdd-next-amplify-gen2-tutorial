# TDD AWS Amplify Next App - Step 9

## Saving Notes For Real

React creates a [single page web application](https://en.wikipedia.org/wiki/Single-page_application). This means that the React state does not [persist](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>) beyond a web page refresh. In other words, if you refresh your browser page you will lose all of the notes you created.

Since Cypress tests the application in a browser, this is the most logical place to test this user expectation.

```js
it('should load previously saved notes on browser refresh', () => {
  cy.reload();

  cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
  cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
});
```

- We now have a failing test. In order to save notes between page reloads we will use [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

- Add a callback function to `page.tsx` that will look up notes that are saved in `localStorage`

```js
...
export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: "", description: "" });

  const fetchNotesCallback = () => {
    const savedNotesString = localStorage.getItem('notes');
    const savedNotes = JSON.parse(savedNotesString);

    if (savedNotes) return setNotes(savedNotes);
      return setNotes([]);
    };
  ...
```

- The `if` check determines if there are any saved notes in `localStorage` and sets the `notes` accordingly.

- Add a callback function to `page.tsx` that will save newly created notes to `localStorage`

```js
const createNote = () => {
  const updatedNoteList = [...notes, formData];
  setNotes(updatedNoteList);
  const updatedNotesListString = JSON.stringify(updatedNotesList);
  localStorage.setItem('notes', updatedNotesListString);
};
```

- Update the `NoteForm` component in `page.tsx` to take the new `createNote` callback function instead of calling the `setNotes` hook directly.

```js
<NoteForm
  notes={notes}
  formData={formData}
  setFormDataCallback={setFormData}
  setNotesCallback={createNote}
/>
```

- To load the saved notes when the application is loaded, add the [useEffect](https://reactjs.org/docs/hooks-effect.html#example-using-hooks) hook and call the `fetchNotesCallback` in `page.tsx`.

```js
import React, { useState, useEffect } from 'react';
...
useEffect(() => {
  fetchNotesCallback();
}, []);
```

- Lastly, make sure you clean up the persisted notes after the Cypress test is run.

```js
after(() => {
  cy.clearLocalStorage('notes');
});
```

- All the tests are Green
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/008-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/010-step)
