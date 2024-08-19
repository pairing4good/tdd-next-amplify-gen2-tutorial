# TDD AWS Amplify Next App - Step 7

## Reset Form

When a note is saved the name and description fields should be reset to empty strings.

- Add a test to `noteForm.test.tsx`

```js
test('should reset the form after a note is saved', () => {
  formData.name = 'test name';
  formData.description = 'test description';

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(formData.name).toBe('');
  expect(formData.description).toBe('');
});
```

- Make this failing test go Green

```js
function createNote() {
  if (!formData.name || !formData.description) return;
  setNotesCallback([...notes, formData]);
  formData.name = '';
  formData.description = '';
}
```

- Green
- Run the Cypress tests and it's **Red**.

What happened? Well, while this approach worked for a lower level component test it doesn't work when React is managing its own [state](https://reactjs.org/docs/state-and-lifecycle.html). React clearly warns us that we should [not modify state directly](https://reactjs.org/docs/state-and-lifecycle.html#do-not-modify-state-directly). Instead you should use the [setState](https://reactjs.org/docs/hooks-state.html) callback hook.

- Let's update the test to use the `setFormDataCallback` callback.

```js
const setNotesCallback = jest.fn();
const setFormDataCallback = jest.fn();
const formData = { name: '', description: '' };

beforeEach(() => {
  render(
    <NoteForm
      notes={[]}
      setNotesCallback={setNotesCallback}
      setFormDataCallback={setFormDataCallback}
      formData={formData}
    />
  );
});
...
test('should reset the form after a note is saved', () => {
  formData.name = 'test name';
  formData.description = 'test description';

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(setFormDataCallback).toHaveBeenCalledWith({
    name: '',
    description: ''
  });
});
```

- This red test drives these code changes

```js
function createNote() {
  if (!formData.name || !formData.description) return;
  setNotesCallback([...notes, formData]);
  setFormDataCallback({ name: '', description: '' });
}
```

- Green!
- The Cypress test is now Green!
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/006-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/008-step)
