# TDD AWS Amplify Next App - Step 4

## Refactor - Single Responsibility

> The [Single Responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle) Principle (SRP) states that each software module should have one and only one reason to change. - Robert C. Martin

Now it's clear that the `NoteForm` component has more than one responsibility:

```js
function NoteForm(props) {
  return (
    <div>
      // 1. Note Creation
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
      <button data-testid="note-form-submit" onClick={() => setNotesCallback([...notes, formData])}>
        Create Note
      </button>
      // 2. Note Listing
      {notes.map((note, index) => (
        <div>
          <p data-testid={'test-name-' + index}>{note.name}</p>
          <p data-testid={'test-description-' + index}>{note.description}</p>
        </div>
      ))}
    </div>
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

Let's pull out a `NoteList.js` component in order to separate these responsibilities.

- Create a new file called `NoteList.js` under the `src/app` directory.

```js
function NoteList(props) {

  return (

  );
}

export default NoteList;
```

- Cut the JSX, that lists notes in the `NoteForm` component, and paste it into the new component.

```js
import PropTypes from 'prop-types';

function NoteList(props) {
  const { notes } = props;

  return (
    <>
      {notes.map((note, index) => (
        <div>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </>
  );
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, description: PropTypes.string })
  ).isRequired
};

export default NoteList;
```

- Now instead of adding the `NoteList` component back into the `NoteForm` component, bring it up a level and place it in the `App` component. This prevents unnecessary [coupling](<https://en.wikipedia.org/wiki/Coupling_(computer_programming)>) between the `NoteForm` component and the `NoteList` component.

```js
import React, { useState } from 'react';
import './App.css';
import NoteForm from './NoteForm';
import NoteList from './NoteList';

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

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

export default App;
```

- Run all of your tests including Cypress.
- It's Green!

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/003-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/005-step)
