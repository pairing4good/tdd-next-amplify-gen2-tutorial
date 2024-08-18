# TDD AWS Amplify React App - Step 3

## Saving A Note

So far we've only test driven the notes form and the ability to display a note.  Now let's test drive the ability to save notes.

### User Acceptance Criteria

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

- Import the `useState` hook at the top of `App.js`

```js
import React, { useState } from 'react';
```

- Initialize an empty list of notes inside the `App` function

```js
import NoteForm from "./noteForm";

export default function App() {
  const [notes] = useState([]);

  return <NoteForm/>
}
```

- Pass the notes as a property to the `NoteForm` component

```js
  return <NoteForm notes={notes} />
```

- Now in `NoteForm.js` use the notes property that was passed to it to list the existing notes

```js
import PropTypes from 'prop-types';

function NoteForm(props) {
  const { notes } = props;

  return (
    <>
      <input data-testid="note-name-field" placeholder="Note Name" />
      <input data-testid="note-description-field" placeholder="Note Description" />
      <button data-testid="note-form-submit" type="button">
        Create Note
      </button>
      {notes.map((note, index) => (
        <div>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </>
  );
}

NoteForm.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default NoteForm;
```

_Note: [Typechecking With PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) is a recommended practice for components that take parameters. As your app grows, typechecking will help prevent alot of issues._

While this satisfied the first acceptance criteria, now the second acceptance criteria fails.

```
expected [data-testid=test-name-0] to have text test note, but the text was ''
```

- In order to save notes you must

1. Save the note name and description form data when each field is changed
2. Save the form data once the `Create Note` button is clicked

- To achieve this we will need to add more state hooks

```js
const [notes, setNotes] = useState([]);
const [formData, setFormData] = useState({ name: '', description: '' });
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
import PropTypes from 'prop-types';

function NoteForm(props) {
  const { notes, setFormDataCallback, formData } = props;

  return (
    <div>
      <input
        data-testid="note-name-field"
        onChange={(e) =>
          setFormDataCallback({
            ...formData,
            name: e.target.value
          })
        }
        placeholder="Note Name"
      />
      ...
    </div>
  );
}

NoteForm.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, description: PropTypes.string })
  ).isRequired,
  setFormDataCallback: PropTypes.func.isRequired,
  formData: PropTypes.shape({ name: PropTypes.string, description: PropTypes.string }).isRequired
};

export default NoteForm;
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
      description: e.target.value
    })
  }
  placeholder="Note Description"
/>
```

- This is exactly the same as the name `onChange` function with the exception of the target value's field name `'description'`.

- Add an `onClick` attribute to the `note-form-submit` element

```js
import PropTypes from 'prop-types';

function NoteForm(props) {
  const { notes, setFormDataCallback, formData, setNotesCallback } = props;

  return (
    <div>
      ...
      <button
        data-testid="note-form-submit"
        type="button"
        onClick={() => setNotesCallback([...notes, formData])}>
        Create Note
      </button>
      ...
    </div>
  );
}

NoteForm.propTypes = {
  ...
  setNotesCallback: PropTypes.func.isRequired,
  ...
};

export default NoteForm;
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
  render(<NoteForm notes={[]} />);
});
```

- The simplest thing that you can do is pass an empty array to `NoteForm`. And the tests pass.

- All of our tests are Green!
- Don't forget to commit your changes

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/002-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/004-step)
