# TDD AWS Amplify Next App - Step 4

## Refactor - Single Responsibility

> The [Single Responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle) Principle (SRP) states that each software module should have one and only one reason to change. - Robert C. Martin

Now it's clear that the `NoteForm` component has more than one responsibility:

```js
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
      // 1. Note Creation
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
      // 2. Note Listing
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </>
  );
}
```

If you go up to the `App` component the call to the `NoteForm` component takes 4 arguments. This is a [smell](https://en.wikipedia.org/wiki/Code_smell) indicating that this component is doing too many things.

```js
<NoteForm
  notes={notes}
  formData={formData}
  setFormDataCallback={setFormData}
  setNotesCallback={setNotes}
/>
```

> Functions should have a small number of arguments. No argument is best, followed by one, two, and three. More than three is very questionable and should be avoided with prejudice. - Robert C. Martin

While components don't look like functions, they are. React uses [JSX](https://reactjs.org/docs/introducing-jsx.html) which is interpreted into [JavaScript functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions).

### Note List Component

Let's pull out a `noteList.ys` component in order to separate these responsibilities.

- Create a new file called `noteList.tsx` under the `src/app` directory.

```js
export default function NoteList() {

  return (

  );
}
```

- In order to remain on green you will need to create a new test named `noteList.test.tsx` under the `src/app` folder
- Cut the tests related to listing notes over to the new testnoteL

```js
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Note } from '@/app/types';
import NoteList from '@/app/noteList';

test('should display notes correctly', () => {
  const notes: Note[] = [
    { name: 'First Note', description: 'First Description' },
    { name: 'Second Note', description: 'Second Description' }
  ];

  render(<NoteList
      notes={notes}
    />);

  notes.forEach((note, index) => {
    expect(screen.getByTestId(`test-name-${index}`)).toHaveTextContent(note.name);
    expect(screen.getByTestId(`test-description-${index}`)).toHaveTextContent(note.description);
  });
});
```

- In order to make this go green, cut the TSX, that lists notes in the `NoteForm` component, and paste it into the new component.

```js
import { Note } from "./types";

export default function NoteList({ notes }: { notes: Note[] }) {

  return (
    <>
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </>
  );
}
```

- Now instead of adding the `NoteList` component back into the `NoteForm` component, bring it up a level and place it in the `App` component. This prevents unnecessary [coupling](<https://en.wikipedia.org/wiki/Coupling_(computer_programming)>) between the `NoteForm` component and the `NoteList` component.

```js
"use client";

import React, { useState } from "react";
import NoteForm from "./noteForm";
import { Note } from "./types";
import NoteList from "./noteList";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: "", description: "" });

  return (
    <>
      <NoteForm
        notes={notes}
        formData={formData}
        setFormDataCallback={setFormData}
        setNotesCallback={setNotes}
      />
      <NoteList notes={notes} />
    </>
  );
}
```

- Run all of your tests including Cypress.
- It's Green!

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/003-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/005-step)
