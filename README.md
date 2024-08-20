# TDD AWS Amplify Next App - Step 9

## Refactor To Repository

The `App` component now has two concerns. React [state management](https://en.wikipedia.org/wiki/State_management) and [persistence](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>). [State management](https://en.wikipedia.org/wiki/State_management) is concerned with frontend values, where [persistence](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>) is a backend concern. Persistence and data access concerns are often extracted into a [repository](https://makingloops.com/why-should-you-use-the-repository-pattern).

- Create a `noteRepository.js` file in the `src/app` directory.
- Move all the `localForage` calls to this new file.

```js
import localForage from 'localforage';

export async function findAll() {
  return localForage.getItem('notes');
}

export async function save(note) {
  const notes = await localForage.getItem('notes');
  if (notes) await localForage.setItem('notes', [...notes, note]);
  else await localForage.setItem('notes', [note]);
}
```

- Update `App.js` to use the new `NoteRepository` functions

```js
import { findAll, save } from './NoteRepository';
...
const fetchNotesCallback = async () => {
  const retrievedNotes = await findAll();
  if (retrievedNotes) setNotes(retrievedNotes);
  else setNotes([]);
};

const createNote = async () => {
  const updatedNoteList = [...notes, formData];
  setNotes(updatedNoteList);
  await save(formData);
};
```

- Run all of the tests.
- Green
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/009-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/011-step)
