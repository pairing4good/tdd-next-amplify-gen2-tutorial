# TDD AWS Amplify Next App - Step 17

## Delete Note Image
Right now when a note that contains an image is deleted the image is not deleted.  To fix this we created the `Delete Note Image`.  Be sure to move it into `In Progress` once you start working on it.

### Why: User Story

```
As the application owner
I want to clean up note images
So that I can save on storage cost
```

### What: User Acceptance Criteria

```
Given a note exists with an image
When the note is deleted successfully
Then delete the associated image
```

```
Given a note exists with an image
When the note fails to delete
Then do not delete the associated image
```

```
Given a note exists without an image
When the note is deleted successfully
Then no image is deleted
```

In this case, we cannot drive this behavior from a high level cypress test.  This image cleanup step is a [side effect](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) and is not directly observable to the customer through the application.  Instead we will add tests at a lower level.

In the `noteList.test` add the following tests.

```js
...
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
...
import { remove } from 'aws-amplify/storage';

...

jest.mock('aws-amplify/storage', () => ({
  remove: jest.fn(),
}));

...
const deleteMock = jest.fn().mockResolvedValue({data: {imageLocation: 'testImageLocation'}});

...

beforeEach(() => {
  generateClient.mockReturnValue(mockClient);
  mockSubscribe.mockClear();
  deleteMock.mockClear();
  remove.mockClear();
});

...

test('should delete a note', async () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testId = '1';
  const testItems = [
    { id: testId, name: 'Test Note 1', description: 'Description 1' },
  ];

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');

  const button = screen.getByTestId('test-delete-button-0');

  fireEvent.click(button);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith({"id": testId})
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith({ path: 'testImageLocation' });
  });
});

test('should not call remove when no image location provided', async () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testId = '1';
  const testItems = [
    { id: testId, name: 'Test Note 1', description: 'Description 1' },
  ];

  deleteMock.mockResolvedValue({ data: {} });

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');

  const button = screen.getByTestId('test-delete-button-0');

  fireEvent.click(button);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith({"id": testId})
    expect(remove).toHaveBeenCalledTimes(0);
  });
});

test('should not call remove when delete function fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testId = '1';
  const testItems = [
    { id: testId, name: 'Test Note 1', description: 'Description 1' },
  ];

  deleteMock.mockRejectedValueOnce(new Error('Delete failed'));

  mockSubscribe.mockImplementation(({ next }) => {
    next({ items: testItems });
    return { unsubscribe: jest.fn() };
  });

  render(<NoteList />);

  expect(mockSubscribe).toHaveBeenCalled();

  const subscribeCallback = mockSubscribe.mock.calls[0][0];
  expect(subscribeCallback).toHaveProperty('next');
  
  subscribeCallback.next({ items: testItems });

  expect(screen.getByTestId('test-name-0')).toHaveTextContent('Test Note 1');
  expect(screen.getByTestId('test-description-0')).toHaveTextContent('Description 1');

  const button = screen.getByTestId('test-delete-button-0');

  fireEvent.click(button);

  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalledWith({"id": testId})
    expect(remove).not.toHaveBeenCalledWith({ path: 'testImageLocation' });
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error deleting note:', expect.any(Error));
    console.error.mockRestore();
  });
});

```
- Run all the tests and these new test cases fail.  Now let's add the code needed to make these pass

```js
...
import { remove } from 'aws-amplify/storage';

export default function NoteList() {
  ...

  function deleteNote(id: string) {
    client.models.Note.delete({id}).then( (note) => {
      const imageLocation = note.data?.imageLocation;
      if (imageLocation) {
        remove({ path: imageLocation });
      }
    }).catch((error) => {
      console.error('Error deleting note:', error)
    })
  }

  ...
}
```
- In order to ensure that a note image is only deleted once the note is successfully deleted we used [chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining).  The function named [then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) registers a [callback](https://en.wikipedia.org/wiki/Callback_(computer_programming)) function that will be called [asynchronously](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)) once a note is successfully deleted.
- In the test we are using the [waitFor](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor) from the [React Testing Library](https://testing-library.com/) to wait for this [asynchronous](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)) [callback](https://en.wikipedia.org/wiki/Callback_(computer_programming)) to the `remove` function.  Without `waitFor` the test will complete all of its checks before the callback is run.  This would result in unexpected test results.

- Run all the tests

- Green

- Commit

Demonstrate this to the customer. If they accept this story then move it to Done. Then move the next highest story from the Todo column to the In Progress column.

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/016-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/018-step)
