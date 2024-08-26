# TDD AWS Amplify Next App - Step 14

## Backend API

Now that we have user authentication hooked up, we need to add the ability for customers to get their "notes to show up on their mobile phone browser too". This means that we can't use local storage on the user's computer anymore. Instead we need to build a backend [API](https://en.wikipedia.org/wiki/API) that will store notes independently from the frontend code.

- Update the contents of the `amplify/data/resource.ts` file with

```js
...
const schema = a.schema({
  Note: a
    .model({
      name: a.string(),
      description: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
...
```

- `.authorization((allow) => [allow.publicApiKey()])` allows you to get started quickly without worrying about authorization rules. Review the [Customize your auth rules](https://docs.amplify.aws/javascript/build-a-backend/data/customize-authz/) page to setup the appropriate access control for your GraphQL API. (https://en.wikipedia.org/wiki/GraphQL)
- Updated the `defaultAuthorizationMode` to `apiKey` to match the `allow.publicApiKey()` authorization.
- Added an expiration of `30` for the api key.  By setting an expiration for API keys, you limit the potential exposure of a compromised key. 

- **Commit and push you changes to GitHub to deploy your changes**
- **Be sure it successfully deploys before proceeding to the next step**

- If you would like to explore the backend, take a look at [Amplify Studio](https://docs.amplify.aws/nextjs/build-a-backend/data/manage-with-amplify-console/).

### Cypress Tests
This cut over will require significant changes in the lower level tests.  Our high level cypress tests will protect our external user behavior as we make lower level changes and update lower level tests.  

- Add a new command that cleans up notes through the Amplify API in `cypress/support/commands.ts`

```js
...
import { Schema } from "../../amplify/data/resource"
import { generateClient } from "aws-amplify/data";

Amplify.configure(outputs);
const client = generateClient<Schema>();

...

 Cypress.Commands.add('deleteAllNotes', () => { 
      client.models.Note.list().then( notes => {
        notes.data.map( note => {
          client.models.Note.delete(note);
        })
      })
 })

declare global {
  namespace Cypress {
    interface Chainable {
        signIn(): Chainable<void>,
        deleteAllNotes(): Chainable<void>
    }
  }
}
```

- Delete all notes before each test by updating the following code in `cypress/e2e/note.cy.ts`

```js
beforeEach(() => {
  cy.deleteAllNotes();
  cy.restoreLocalStorage();
  cy.visit("/");
});
```
- Run your cypress tests `npm run cypress:test`
- Green!

### Refactor Code
- Now let's start changing the low level code.  First, make the following changes to the `NoteForm` component.

```js
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState } from "react";


export default function NoteForm() {
  const client = generateClient<Schema>();
  const [formData, setFormData] = useState({ name: "", description: "" });

  function createNote() {
    if (!formData.name || !formData.description) return;
    client.models.Note.create(formData);
    setFormData({ name: '', description: '' });
  }

  return (
    <div data-testid="note-form">
      <input
        data-testid="note-name-field"
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
        placeholder="Note Name"
        value={formData.name}
      />
      <input
        data-testid="note-description-field"
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
        placeholder="Note Description"
        value={formData.description}
      />
      <button
        data-testid="note-form-submit"
        type="button"
        onClick={createNote}
      >
        Create Note
      </button>
    </div>
  );
}
```
- There is no need to have the `App` component coordinate state between the `NoteForm` component and the `NoteList` component.  So we removed the parameters and pushed the `useState` hook down into the `NoteForm` component.  
- We created a `client` with the `generateClient` function provided by Amplify.  This function takes the Schema that we defined above.  The `client` that is generated provides full GraphQL functionality for all of the models that are defined in your schema.  
- In the `createNote` function we just directly `create` a note from the form data when the `note-form-submit` button is pressed.  


- Next let's update the `NoteList` component with the following code
```js
import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

export default function NoteList() {
  const [notes, setNotes] = useState<Array<Schema["Note"]["type"]>>([]);
  const client = generateClient<Schema>();

  useEffect(() => {
    const sub = client.models.Note.observeQuery().subscribe({
      next: ({ items }) => {
        setNotes([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <div data-testid="note-list">
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
        </div>
      ))}
    </div>
  );
}
```
- Since there is no need to have the `App` component coordinate state between the `NoteForm` component and the `NoteList` component, we will push down the `useState` hook and the `useEffect` hook into the `NoteList` component.  
- The `useState` contains the schema `Note` type instead of the interface that we previously used
- When the component first appears on the screen, `useEffect` creates a subscription to the `note` service. This service will send updates whenever notes are added, changed, or deleted.
- When the component is removed from the screen, `useEffect` makes sure to unsubscribes to the service so that no extra resources are used.
- The `useEffect` hook has an empty dependency array []. This means the effect runs only once when the component mounts (i.e., when it is first added to the DOM) and not on subsequent renders.

- Now that all of the parameters for the `NoteForm` and `NoteList` have been removed we can drastically simplify the `App` component.

```js
"use client";

import NoteForm from "./noteForm";
import NoteList from "./noteList";

export default function App() {
  return (
    <>
      <NoteForm/>
      <NoteList />
    </>
  );
}
```

- The `noteRepository.ts` and `types.ts` can both be deleted because they are no longer used.
- Run your cypress tests `npm run cypress:test`
- Green!

### Update Lower Level Tests
- Now that our code is working correctly we need to update the lower level tests to match the code.
- Replace the content of the `noteForm.test.tsx` with the following

```js
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NoteForm from '@/app/noteForm';

const createMock = jest.fn();
jest.mock('aws-amplify/data', () => ({
      generateClient: jest.fn(() => ({
        models: {
          Note: {
            create: createMock
          }
        }
      }))
    }));

beforeEach(() => {
  jest.clearAllMocks();
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

test('should require name and description', () => {
  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
  const input = screen.getByTestId('note-description-field');
  fireEvent.change(input, {
    target: { value: 'test description' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
  const input = screen.getByTestId('note-name-field');
  fireEvent.change(input, {
    target: { value: 'test name' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, {
    target: { value: 'test name' }
  });

  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, {
    target: { value: 'test description' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(createMock.mock.calls.length).toBe(1);
});

test('should reset the form after a note is saved', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, {
    target: { value: 'test name' }
  });

  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, {
    target: { value: 'test description' }
  });

  const button = screen.getByTestId('note-form-submit');

  fireEvent.click(button);

  expect(nameInput).toHaveValue('');
  expect(descriptionInput).toHaveValue('');
});
```
- `jest.mock('aws-amplify/data', ...` replaces the calls to the real Amplify API with fake calls to the mock.  The `createMock` mock function records calls and can be asked how many times it was called.

- Since parameters are not passed to this component anymore there are no callbacks to verify.  As a result the following test cases were deleted
  - `should call setFormDataCallback with the correct name value on input change`
  - `should call setFormDataCallback with the correct description value on input change`
  - `should call setNotesCallback with updated notes array when create note button is clicked`

- Now let's replace the contents of `noteList.test.tsx` with the following

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import NoteList from '@/app/noteList';
import { generateClient } from 'aws-amplify/data';

jest.mock('aws-amplify/data', () => ({
  generateClient: jest.fn(),
}));

const mockSubscribe = jest.fn();
const mockClient = {
  models: {
    Note: {
      observeQuery: jest.fn(() => ({
        subscribe: mockSubscribe,
      })),
    },
  },
};

beforeEach(() => {
  generateClient.mockReturnValue(mockClient);
  mockSubscribe.mockClear();
});

test('should call subscribe and handle data updates', () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  
  const testItems = [
    { id: '1', name: 'Test Note 1', description: 'Description 1' },
    { id: '2', name: 'Test Note 2', description: 'Description 2' },
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
  expect(screen.getByTestId('test-name-1')).toHaveTextContent('Test Note 2');
  expect(screen.getByTestId('test-description-1')).toHaveTextContent('Description 2');
});

it('should unsubscribe on unmount', () => {
  const mockUnsubscribe = jest.fn();
  
  mockSubscribe.mockImplementation(() => {
    return { unsubscribe: mockUnsubscribe }; 
  });

  const { unmount } = render(<NoteList />);
  unmount();

  expect(mockUnsubscribe).toHaveBeenCalled();
});
```
- This test mocks out the `subscribe` function so that its call from the `useEffect` hook can be verified.
- This test also mocks out the `unsubscribe` function to ensure that it is called when the component is unmounted.  This is a crucial test since if the component is no longer mounted but is still subscribed to the service, this can lead to [memory leaks](https://en.wikipedia.org/wiki/Memory_leak).

- In order to avoid hitting the real service during tests both the `snapshot.tsx` test and the `page.tst.tsx` test need to set up a mock client in order to capture these calls.
- Update the `page.tst.tsx` test with the following

```js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/app/page";

jest.mock('aws-amplify/data', () => ({
      generateClient: jest.fn(() => ({
        models: {
          Note: {
            observeQuery: jest.fn(() => ({
              subscribe: () => {
                return {
                  unsubscribe: jest.fn(),
                  next: jest.fn(),
                }
              },
            })),
            create: jest.fn()
          }
        }
      }))
    }));

beforeEach(() => {
  jest.clearAllMocks();
});

test("should render children", () => {
  render(<App />);

  expect(screen.getByTestId("note-form")).toBeInTheDocument();
  expect(screen.getByTestId("note-list")).toBeInTheDocument();
});
```
- In this test we only see if the two child components render by asserting their test ids.

- Update the `snapshot.tsx` test with the following

```js

import RootLayout from "@/app/layout";
import Home from "@/app/page";
import { render } from "@testing-library/react";

jest.mock('aws-amplify/data', () => ({
  generateClient: jest.fn(),
}));

it("should render homepage unchanged", () => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  const { container } = render(<RootLayout><Home /></RootLayout>);
  expect(container).toMatchSnapshot();
});

```

- Finally, remove the unnecessary local storage notes cleanup in `cypress/e2e/note.cy.ts`.  Now that the Amplify backend API has fully replaced local storage for notes this in no longer needed.

```js
afterEach(() => {
  cy.saveLocalStorage();
});
```

- Rerun all of the tests
- Green!
- Commit

> This was a very large coding change.  The high level cypress test enabled us to make these changes courageously.  With out this high level verification of external user behavior, these changes would have been harder to make and more likely to introduce a bug.

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/013-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/015-step)
