# TDD AWS Amplify React App - Step 2

## NoteForm Test

Now that we have a high-level Cypress test in place, let's move down the testing pyramid into a component test. This test will use the React Testing Library's [render](https://testing-library.com/docs/react-testing-library/cheatsheet/) function to render the `NoteForm` component and assert its contents.

Before we show this new form to our customer we need to test drive:

- the button's name
- helpful input descriptions

### Button Test
- First create a `app` directory in the `src/__tests__` directory
- Create a file called `noteForm.test.jsx` in the new `src/__tests__/app` directory
- In this new test file add a test that will drive the button name

```js
test('should display a create note button', () => {});
```

- The test name should be conversational and intent revealing. It should avoid technical words like "render", "component", and the like. We want a new team member to be able to read this test and understand the customer value. The body of the test will provide the technical HOW but the test name should point to the customer's WHY and WHAT.

- Now we will add a test that renders the component and asserts that the button is labeled "Create Note". For more information on the React Testing Library visit https://testing-library.com/docs

```js
import NoteForm from '@/app/noteForm';
import { render, screen } from '@testing-library/react';

test('should display a create note button', () => {
  render(<NoteForm />);
  const button = screen.getByTestId('note-form-submit');

  expect(button).toHaveTextContent('Create Note');
});
```

- Run `npm run test` and one test will fail

```
Expected element to have text content:
  Create Note
Received:
  Submit
```

- In order to make this pass add the expected text content to the button

```js
<button data-testid="note-form-submit" type="button">
  Create Note
</button>
```

- The test automatically reruns once the change is saved. This is accomplished through jest's [watch](https://jestjs.io/docs/cli) mode.
- **Be sure to always [commit](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git#_staging-and-committing-code-changes) on green**. We value working code. `Green Code = Working Code`

### Name Input Test

- Test drive the label for the name input.

```js
test('should display the name placeholder', () => {
  render(<NoteForm />);
  const input = screen.getByTestId('note-name-field');

  expect(input).toHaveAttribute('placeholder', 'Note Name');
});
```

- Make this red test go green

```js
<input data-testid="note-name-field" placeholder="Note Name" />
```

- Commit on Green. And always be looking for ways to refactor your code. Small improvements over time are easier to make than large changes when your code is a mess.

### Description Input Test

- Test drive the label for the description input.

```js
test('should display the description placeholder', () => {
  render(<NoteForm />);
  const input = screen.getByTestId('note-description-field');

  expect(input).toHaveAttribute('placeholder', 'Note Description');
});
```

- Make this red test go green

```js
<input data-testid="note-description-field" placeholder="Note Description" />
```

- Commit on Green.

### Refactor

Every test starts with `render(<NoteForm />)`. Let's extract this duplicated set up code and place it in the test setup.

```js
import NoteForm from '@/app/noteForm';
import { render, screen } from '@testing-library/react';

beforeEach(() => {
  render(<NoteForm />);
});

test('should display a create note button', () => {
  const button = screen.getByTestId('note-form-submit');

  expect(button).toHaveTextContent('Create Note');
});

test('should display the name placeholder', () => {
  const input = screen.getByTestId('note-name-field');

  expect(input).toHaveAttribute('placeholder', 'Note Name');
});

test('should display the description placeholder', () => {
  const input = screen.getByTestId('note-description-field');

  expect(input).toHaveAttribute('placeholder', 'Note Description');
});
```

- We added a [beforeEach](https://reactjs.org/docs/testing-recipes.html#setup--teardown) set up function.
- Green!
- Commit


[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/003-step)
