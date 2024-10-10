# TDD AWS Amplify Next App - Step 19

In the next step we will extract reusable logic out of a components so that it can be independently unit tested.  This is an example of [refactoring](https://martinfowler.com/books/refactoring.html).  As we build an application always be looking for opportunities to simplify the code. In this refactoring we will pull out note validation into a separate file and independently test that code.  

First let's create a unit test `src/__tests__/app/validation/noteValidator.test.ts` that will drive this change.  In this file add the following content

```js
import isValidNote from '../../../app/validation/noteValidator';

describe('isValidNote', () => {
    it('should return true for a valid note', () => {
        const validNote = { name: 'Note Title', description: 'Note Description' };
        expect(isValidNote(validNote)).toBe(true);
    });

    it('should return false if name is missing', () => {
        const invalidNote = { name: '', description: 'Note Description' };
        expect(isValidNote(invalidNote)).toBe(false);
    });

    it('should return false if description is missing', () => {
        const invalidNote = { name: 'Note Title', description: '' };
        expect(isValidNote(invalidNote)).toBe(false);
    });

    it('should return false if both name and description are missing', () => {
        const invalidNote = { name: '', description: '' };
        expect(isValidNote(invalidNote)).toBe(false);
    });
});
````
- Run all tests. Red.

Now let's create the production code `src/app/validation/noteValidator.ts` with the following content

```js

const isValidNote = (note: { name: string; description: string;}) => {
    return !!note.name && !!note.description;
};

export default isValidNote;
```
- Run all tests. Green.
- It's worth noting that we duplicated the logic that is in the `noteForm`.  This is a very common refactoring technique to remain on green.

Now let's replace the logic in the `noteForm` with this new validator.

```js
...
import isValidNote from "./validation/noteValidator";


export default function NoteForm() {
  ...
  function createNote() {
    if (!isValidNote(formData)) return;
    client.models.Note.create(formData);
    setFormData({ name: '', description: '', imageLocation: '' });
  }
  ...
}
```
- Run all tests. Green.

Now let's refactor the `noteForm` test with the following content

```js
...
import isValidNote from '../../app/validation/noteValidator';

...

jest.mock('../../app/validation/noteValidator', () => jest.fn());

beforeEach(() => {
  ...
  (isValidNote as jest.Mock).mockReturnValue(true);
  render(<NoteForm />);
});

...

test('should require name and description', () => {
  const button = screen.getByTestId('note-form-submit');
  (isValidNote as jest.Mock).mockReturnValue(false);
  
  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
  const input = screen.getByTestId('note-description-field');
  fireEvent.change(input, {
    target: { value: 'test description' }
  });
  (isValidNote as jest.Mock).mockReturnValue(false);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
  const input = screen.getByTestId('note-name-field');
  fireEvent.change(input, {
    target: { value: 'test name' }
  });
  (isValidNote as jest.Mock).mockReturnValue(false);

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});
```

- Now that all `note` validation is handled by the `noteValidator` and it is imported into the `noteForm` it can be mocked out in the `noteForm` test.
  - The validator is mocked in `jest.mock('../../app/validation/noteValidator', () => jest.fn());`
  - The `beforeEach` block sets up the mock to alway return `true`
  - For test cases that require the validation to fail, the following line is added to the test `(isValidNote as jest.Mock).mockReturnValue(false);`

- Run all tests. Green.

Now let's remove 2 of the 3 redundant test cases.  Since the validator is mocked, setting the note's `name` and/or `description` is ignored.

```js

test('should require name and description', () => {
  const button = screen.getByTestId('note-form-submit');
  (isValidNote as jest.Mock).mockReturnValue(false);
  
  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});
```
- Removed the `should require name when description provided` and `should require description when name provided` test cases.
- Run all tests. Green.

Now let's rename the `should require name and description` test to `should not save a note when it is invalid`.

```js

test('should not save a note when it is invalid', () => {
  const button = screen.getByTestId('note-form-submit');
  (isValidNote as jest.Mock).mockReturnValue(false);
  
  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});
```

Now let's remove unnecessary steps to set the `name` and/or `description`.

```js
test('should add a new note when name and description are provided', () => {
  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(1);
});

...

test('should update imageLocation state on file upload success', () => {
  fireEvent.click(screen.getByText('Simulate Upload Success'));

  expect(screen.getByTestId('hidden-image-location').value).toBe('mockImageKey');
});
```

- Run all the tests

- Green

- Commit

This refactoring had a number of benefits:
1. Note validation is now reusable
1. Note validation is easier to test within the new unit test.
1. The component has fewer [responsibilities](https://en.wikipedia.org/wiki/Single-responsibility_principle)
1. The component test has **a third less code** because it has fewer [responsibilities](https://en.wikipedia.org/wiki/Single-responsibility_principle)


[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/018-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/020-step)
