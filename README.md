# TDD AWS Amplify Next App - Step 5

## Testing NoteList Component

As we refactor, we need to remember what level of testing we have written within the testing pyramid. While we have a few far reaching tests at the top of the pyramid, don't think that they adequately test the behavior of each component. The bottom of the testing pyramid is wide because it provides broad test coverage.

Now that `NoteList` is broken out into its own focused component it will be much easier to comprehensively test.

### Test No Notes

We are going to write a number of test cases within `noteList.test.tsx`.  Before we write more test cases let's rename the existing test case to clarify that it is displaying multiple notes.


```js
test('should display multiple notes when more than one notes is provided', () => {
  ...
});
```

- Now let's add a new test that verifies that no notes are rendered when no notes are provided

```js
test('should display nothing when no notes are provided', () => {
  render(<NoteList notes={[]} />);
  const firstNoteName = screen.queryByTestId('test-name-0');

  expect(firstNoteName).toBeNull();
});
```

- Now add a test that verifies that one note is rendered

```js
test('should display one note when one notes is provided', () => {
  const note = { name: 'test name', description: 'test description' };
  render(<NoteList notes={[note]} />);

  const firstNoteName = screen.queryByTestId('test-name-0');
  expect(firstNoteName).toHaveTextContent('test name');

  const firstNoteDescription = screen.queryByTestId('test-description-0');
  expect(firstNoteDescription).toHaveTextContent('test description');
});
```

- Finally, let's add a test that verifies an exception is thrown when a list is not provided.

This may seem unnecessary but it's important to test negative cases too. Tests not only provide accountability and quick feedback loops for the [application under test](https://en.wikipedia.org/wiki/System_under_test) but it also provides [living documentation](https://en.wikipedia.org/wiki/Living_document) for new and existing team members.

```js
test('should throw an exception the note array is undefined', () => {
  expect(() => {
    render(<NoteList notes={undefined}/>);
  }).toThrow();
});
```

- All of your non-UI tests are Green.
- Don't forget to rerun your Cypress tests. Green!
- Commit on Green.

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/004-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/006-step)
