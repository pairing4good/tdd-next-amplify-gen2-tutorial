# TDD AWS Amplify Next App - Step 6

## Usability

Customers rarely ask explicitly for a usable product. In this application rich world, that we live in, it's assumed that applications will be delivered with common sense [usability](https://en.wikipedia.org/wiki/Usability) baked-in. When I look at the application as it stands, a few things pop out at me.

1. Header - there's no heading telling you what this application does
1. Form Validation - there's no form field validation
1. Reset Form - after a note is created the form fields are not reset

### Header

- Create a new file `header.tsx` in the `src/app` directory

```js
export default function Header() {
  return <></>;
}
```

- Let's test drive this component
- Create a new file `header.test.js` in the `src/__test__` directory

```js
import { render, screen } from '@testing-library/react';
import Header from '@/app/header';

test('should display header', () => {
  render(<Header />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent('My Notes App');
});
```

- We have a failing test.
- Let's make it pass

```js
export default function Header() {
  return <h1>My Notes App</h1>;
}
```

- It's Green!
- Commit your code!

### Hook Up Header

Even though the component is test driven and ready to be used, we have not used it yet outside the test. Let's drive this change through the Cypress test.

- Add a test that asserts the header

```js
it('should have header', () => {
  cy.get('h1').should('have.text', 'My Notes App');
});
```

- It fails
- Add the component to the [Layout](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern) found in `src/app/layout.tsx`

```js
import Header from "./header";
 
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
```

- It's Green!
- Commit!

You will notice that in the TDD testing cycle we commit very small bits of working code. We commit all the time. While this may seem like overkill, here are some benefits.

1. Our commit messages tell a focused, step-by-step story that explains why we made each change.
1. We are preserving working code. ["Working software is the primary measure of progress."](https://agilemanifesto.org/principles.html)
1. We can [revert](<https://en.wikipedia.org/wiki/Reversion_(software_development)>) our changes back to a known working state without losing very many changes.

This last benefit is worth expounding upon. The TDD testing cycle keeps us laser focused on writing small pieces of working functionality. In fact, the [3 Laws of TDD](http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html) prevent us from writing more code than is necessary to satisfy a focused test.

#### Three Laws of TDD

1. You must write a failing test before you write any production code.
1. You must not write more of a test than is sufficient to fail, or fail to compile.
1. You must not write more production code than is sufficient to make the currently failing test pass.

These tight feedback loops help software developers avoid going down rabbit holes that lead to [over-engineering](https://en.wikipedia.org/wiki/Overengineering).

### Form Validation

Let's assume that the note's name and description are both required fields. While you want the customer driving decisions about your product, one way to gather customer feedback is to launch-and-learn. Your customers will tell you if they don't like your decision. As software developers we must be obsessed with our customers. Set up a regular cadence to meet with your customers and demonstrate a working application. Make space for them to let you know what they think.

In order to test drive validation we need to determine where in the testing pyramid to write this test. Remember that the highest-level tests are slow and expensive, so limit these tests to between 3 to 5 tests that walk through the most common user experiences. In order to adequately test all of the combinations of good and bad fields, these tests would not be well suited for UI testing.

#### Name and Description Blank

- Add a test to `NoteForm.test.js`

```js
test('should require name and description', () => {
  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(mockSetNotesCallback.mock.calls.length).toBe(0);
});
```

- This test checks to see if the jest [mock function](https://jestjs.io/docs/mock-functions) was called. In this test the note's name and description are blank so a new note should not be created and added to the list of notes.
- We have a failing test.

```js
...
export default function NoteForm({
  notes,
  formData,
  setFormDataCallback,
  setNotesCallback,
}: Parameters) {

  function createNote() {
    if (!formData.name || !formData.description) return;
    setNotesCallback([...notes, formData]);
  }

  return (
    <>
      ...
      <button
        data-testid="note-form-submit"
        type="button"
        onClick={createNote}
      >
        Create Note
      </button>
    </>
  );
}
```

- Green!
- Rerun your Cypress tests.
- Commit!

#### Name And Description Required

- Add the following tests to `NoteForm.test.js`

```js
test('should require name when description provided', () => {
  formData.description = 'test description';
  formData.name = '';

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(setNotesCallback.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
  formData.description = '';
  formData.name = 'test name';

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(setNotesCallback.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
  formData.description = 'test description';
  formData.name = 'test name';

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(setNotesCallback.mock.calls.length).toBe(1);
});
```

- All of these tests go green with no additional production code changes.
- Rerun your Cypress tests.
- Commit!

We will cover the third usability item, resetting the form fields after it is submitted, in the next step.  

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/005-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/007-step)
