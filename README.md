# TDD AWS Amplify Next App - Step 9

## Saving Notes For Real

React creates a [single page web application](https://en.wikipedia.org/wiki/Single-page_application). This means that the React state does not [persist](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>) beyond a web page refresh. In other words, if you refresh your browser page you will lose all of the notes you created.

Since Cypress tests the application in a browser, this is the most logical place to test this user expectation.

```js
it("should load previously saved notes on browser refresh", () => {
  cy.get("[data-testid=note-name-field]").type("test note 2");
  cy.get("[data-testid=note-description-field]").type("test note description 2");
  cy.get("[data-testid=note-form-submit]").click();


  cy.get("[data-testid=test-name-0]").should("have.text", "test note 2");
  cy.get("[data-testid=test-description-0]").should("have.text", "test note description 2");

  cy.reload();

  cy.get("[data-testid=test-name-0]").should("have.text", "test note 2");
  cy.get("[data-testid=test-description-0]").should("have.text", "test note description 2");
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
    const savedNotesString = localStorage.getItem("notes");
    const savedNotes = savedNotesString ? JSON.parse(savedNotesString) : null;

    if (savedNotes) return setNotes(savedNotes);
    return setNotes([]);
  };
  ...
```

- The [conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator) takes three operands: a condition followed by a question mark (?), then an expression to execute if the condition is truthy followed by a colon (:), and finally the expression to execute if the condition is falsy. This operator is frequently used as an alternative to an if...else statement.
- The `if` check determines if there are any saved notes in `localStorage` and sets the `notes` accordingly.

- Add a callback function to `page.tsx` that will save newly created notes to `localStorage`

```js
const createNote = () => {
  const updatedNoteList = [...notes, formData];
  setNotes(updatedNoteList);
  const updatedNotesListString = JSON.stringify(updatedNoteList);
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
"use client";

import React, { useState, useEffect } from "react";
...
export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ name: "", description: "" });

  useEffect(() => {
    fetchNotesCallback();
  }, []);
...
```

- Lastly, make sure you clean up the persisted notes after the Cypress test is run.  The [after hook](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks) runs once after all fo the tests have been run.

```js
after(() => {
  cy.clearLocalStorage('notes');
});
```

- All the tests are Green
- Commit

Since we just added behavior to the `App` component let's add lower level tests to cover this behavior.

- Create a `page.tst.tsx` component test in the `src/__test__/app` folder
- Add the first test verifying that saved notes are loaded on page load

```js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/app/page";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    configurable: true,
  });
  localStorage.clear();
});

test("fetchNotesCallback should load notes from localStorage", () => {
  const notes = [{ name: "Test Note", description: "This is a test note." }];
  localStorage.setItem("notes", JSON.stringify(notes));

  render(<App />);

  expect(screen.getByText("Test Note")).toBeInTheDocument();
});
```
- The `localStorageMock` creates a function that is then swapped out for the real localStorage inside the `beforeEach` through the [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) function.

- Add a second test that verifies that new notes are saved to the `localStorageMock`

```js
test("createNote should add note and save it to localStorage", () => {
  render(<App />);

  fireEvent.change(screen.getByTestId("note-name-field"), {
    target: { value: "New Note" },
  });
  fireEvent.change(screen.getByTestId("note-description-field"), {
    target: { value: "New Description" },
  });

  fireEvent.click(screen.getByTestId("note-form-submit"));

  expect(screen.getByText("New Note")).toBeInTheDocument();

  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  expect(savedNotes).toEqual([
    { name: "New Note", description: "New Description" },
  ]);
});
```

- All the tests are Green
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/008-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/010-step)
