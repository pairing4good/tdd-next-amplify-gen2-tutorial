# TDD AWS Amplify React App - Step 3

## Saving A Note

So far we've only test driven the notes form and the ability to display a note.  Now let's test drive the ability to save notes.

### Why: User Story

```
As a team member
I want to capture a note
So that I can refer back to it later
```

### What: User Acceptance Criteria

```
Given that no notes are entered
When nothing is saved
Then no notes should be listed
```

```
Given that one note exists
When a note is saved
Then two notes should be listed
```

```
Given a note exists
When the application is opened
Then a note is listed
```

These three user acceptance criteria will drive the need to actually save notes. While this can be achieved through component tests, let's add this to our high-level UI test. These tests are often called end-to-end tests because they follow a few paths through the application. These tests are at the top of the testing pyramid because they tend to be slower and more brittle than tests that are lower in the pyramid. This translates into these end-to-end tests tending to cost more to build, run and maintain. Consequently, we try to limit their number to only a few tests that follow the most common paths through the system.

- Let's start with the first acceptance criteria. To achieve this we need to add an initial check, in `note.cy.js`, to verify that no notes are listed prior to entering a note.

```js
it('should create a note when name and description provided', () => {
  cy.get('[data-testid=test-name-0]').should('not.exist');
  cy.get('[data-testid=test-description-0]').should('not.exist');

  cy.get('[data-testid=note-name-field]').type('test note');
  cy.get('[data-testid=note-description-field]').type('test note description');
  cy.get('[data-testid=note-form-submit]').click();

  cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
  cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
});
```

- Run `npm run cypress:test`
- Now we have a failing test to drive new functionality

There are a number of ways that we could make this go green but React [Hooks](https://react.dev/reference/react/useState) are one of the simplest ways to achieve this outcome.

- Add `"use client"` at the top of this [client component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) in order to use [React Hooks within Next.js](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- Import the `useState` hook at the top of `src/app/page.tsx`
- Initialize an empty [array](https://www.typescriptlang.org/docs/handbook/basic-types.html#array) of notes inside the `App` function

```js
"use client"

import React, { useState } from 'react';
import NoteForm from "./noteForm";

export default function App() {
  const [notes] = useState([]);

  return <NoteForm notes={notes} />
}
```
In [TypeScript](https://www.typescriptlang.org/) [arrays](https://www.typescriptlang.org/docs/handbook/basic-types.html#array) should have a type.  The `notes` will represent a note with a name and a description.  This structure can be represented in an [interface](https://www.typescriptlang.org/docs/handbook/2/objects.html).

- In order to share the `Notes` interface throughout the application create a new file named `types.ts` inside the `src/app` folder.

```js
/* istanbul ignore file */

export interface Note {
  name: string;
  description: string;
}
```

The first line is a [comment](https://jestjs.io/docs/configuration#collectcoverage-boolean) that exludes this file from [code coverage](https://en.wikipedia.org/wiki/Code_coverage).  While this should be used sparingly, interfaces and types do not need to be tested directly since they do not contain any logic.

- Now let's update the `useState` to use this new `Note` type.  This is accomplished through TypeScript [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

```js
"use client"

import React, { useState } from 'react';
import NoteForm from "./noteForm";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  return <NoteForm notes={notes} />
}
```

- Pass the notes as a property to the `NoteForm` component

```js
  return <NoteForm notes={notes} />
```

- Now in `noteForm.js` use the notes property that was passed to it to list the existing notes

```js
import { Note } from "./types";

interface Parameters {
  notes: Note[];
}

export default function NoteForm({ notes }: Parameters) {

  return (
    <>
      <input data-testid="note-name-field" placeholder="Note Name" />
      <input data-testid="note-description-field" placeholder="Note Description" />
      <button data-testid="note-form-submit" type="button">
        Create Note
      </button>
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

- Next let's save notes
- In order to save notes you must

1. Save the note name and description form data when each field is changed
2. Save the form data once the `Create Note` button is clicked

- To achieve this we will need to add more state hooks

```js
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: '', description: '' });
```

- Now we need to pass these hooks to the `NoteForm` component

```js
  return <NoteForm 
    notes={notes} 
    formData={formData}
    setFormDataCallback={setFormData} 
    setNotesCallback={setNotes}
  />
```

Using these variables and callback functions can be a bit overwhelming so we will look at each element in the `NoteForm` component one at a time.

- Add an `onChange` attribute to the `note-name-field` element

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
      ...
    </>
  );
}

```

- **When `...` is on a line by itself, in a code example, it means that I have not provided all of the code from that file. Please be careful to copy each section that is separated by `...`'s and use them in the appropriate part of your files.**

- The `onChange` function is called every time the name is changed.

  - The `e` is the event which is used to get the target element which contains the value that the user entered.
  - The [=>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) is an arrow function expression which is an alternative to a traditional javascript function expression.
  - The rest of the function is a call to the `setFormData` hook that we passed to the `NoteForm` component. If this were not spread across 3 lines it would read more like this `setFormDataCallback({'name': 'some value'})`. Granted there is one more thing happening in this call, the existing form data is being [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) with the `...` syntax. Simply put we are creating a new javascript object by opening and closing with curly braces. Add all of the existing form data prior to the change. And finally add the new `name` value which will overwrite the form data that was spread. There is a lot going on in this small function.

- Add an `onChange` attribute to the `note-description-field` element

```js
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
```

- This is exactly the same as the name `onChange` function with the exception of the target value's field name `'description'`.

- Add an `onClick` attribute to the `note-form-submit` element

```js
      <button
        data-testid="note-form-submit"
        type="button"
        onClick={() => setNotesCallback([...notes, formData])}
      >
        Create Note
      </button>
```

- The `onClick` function is called every time the `Create Note` button is clicked
  - The `setNotesCallback` callback is called with a new [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) that contains all of the existing notes pulse the note that we just entered.
- Rerun the Cypress test and it is Green.

- However if you run `npm run test` the non-UI tests are failing.

```
TypeError: Cannot read property 'map' of undefined
```

- The `NoteForm.test.js` component test does not pass any parameters to the component so the `notes` is [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined). In order to fix this test we must pass an array of `notes` to the `NoteForm` component.

```js
beforeEach(() => {

  render(<NoteForm
      notes={[]}
      formData={{name: '', description: ''}}
      setFormDataCallback={jest.fn()}
      setNotesCallback={jest.fn()}
    />);
});
```

- The `jest.fn()` is a [Mock Function](https://jestjs.io/docs/mock-functions) that conforms to the defined parameter types through [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html).

- All of our tests are Green!
- Don't forget to commit your changes

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/002-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/004-step)
