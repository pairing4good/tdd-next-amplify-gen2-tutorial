# TDD AWS Amplify Next App - Step 16

## Add Note Image
The next story is `Note Image`.  Be sure to move it into `In Progress` once you start working on it.

### Why: User Story

```
As a team member
I want to add an image to a note
So that I provide visual context
```

### What: User Acceptance Criteria

```
Given a valid name and description are provided
When an image is uploaded successfully
And the note is saved successfully
Then the image is displayed under the name and description in the note list
```

```
Given a valid name and description are provided
When no image is added
Then the note is diplayed without an image
```

```
Given a valid name and description are provided
When an image is not uploaded successfully
And the note is saved anyway
Then the note is diplayed without an image
```

```
Given a non-image file is selected
When the user attempts to upload the file
Then they are prevented from uploading the file
```

```
Given a user wishes to select more than one file
When they attempt to select more than one file
Then they are prevented from selecting more than one file
```

Let's drive this functionality from the high level cypress test by adding the following.

- Visit https://picsum.photos/50 and download the generated image
- Rename the image to `test-image.jpg` and place it in `cypress/fixtures` folder

- Update the test named `should create a note when name and description provided` in `cypress/e2e/note.cy.ts` with the following.

```js
  it("should create a note when name and description provided", () => {
    cy.get("[data-testid=test-name-0]").should("not.exist");
    cy.get("[data-testid=test-description-0]").should("not.exist");

    cy.get("[data-testid=note-name-field]").type("test note");
    cy.get("[data-testid=note-description-field]").type("test note description");

    cy.get('.amplify-storagemanager__dropzone')
      .selectFile('cypress/fixtures/test-image.jpg', { action: 'drag-drop' })
      
    cy.contains('uploaded').should('be.visible');

    cy.get("[data-testid=note-form-submit]").click();

    cy.get("[data-testid=note-name-field]").should("have.value", "");
    cy.get("[data-testid=note-description-field]").should("have.value", "");

    cy.get("[data-testid=test-name-0]").should("have.text", "test note");
    cy.get("[data-testid=test-description-0]").should("have.text", "test note description");
    cy.get("[data-testid=note-image-0]").should("exist");
  });
```
- By adding `cy.get('.amplify-storagemanager__dropzone')` the ampllif [StorageManager](https://ui.docs.amplify.aws/react/connected-components/storage/storagemanager) component drop zone is selected.
- Then the `.selectFile('cypress/fixtures/test-image.jpg', { action: 'drag-drop' })` function drags the `test-image.jpg` to the drop zone.
- By adding `cy.contains('uploaded').should('be.visible');` cypress will wait for the image to be uploaded.
- By adding `cy.get("[data-testid=note-image-0]").should("exist");` cypress verifies that the image is included in the note listing

- Run `npm i @aws-amplify/ui-react-storage`

- Create a new folder `storage` under the `amplify` directory
- In this new `storage` folder create a file named `resource.ts` and add the following content

```js
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "note-image",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
```

-Update `amplify/backend.ts` with the following

```js
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

defineBackend({
  auth,
  storage,
  data,
});
```

- Now let's add a [StorageManager](https://ui.docs.amplify.aws/react/connected-components/storage/storagemanager) component to our `NoteForm` component

```js
...
import { StorageManager } from '@aws-amplify/ui-react-storage';
import "@aws-amplify/ui-react/styles.css";


export default function NoteForm() {
  ...

  return (
    <div data-testid="note-form">
      ...
      <StorageManager
          acceptedFileTypes={['image/*']}
          path='images'
          maxFileCount={1}
          maxFileSize={500000}
          isResumable
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
- By adding `acceptedFileTypes={['image/*']}` only images file types can be uploaded.  This helps prevent uploading files that are not able to be displayed as an image.
- By adding `maxFileCount={1}` the number of uploaded files are limited to one
- By adding `maxFileSize={500000}` the file size is limited to 500KB.  This is critical for preventing costly mistakes or even attacks.

In order to save the path to this file we need to add an `onUploadSucces` callback function.

```js
...
export default function NoteForm() {
  ...
  const [formData, setFormData] = useState({ name: "", description: "", imageLocation: ""});

  function createNote() {
    ...
    setFormData({ name: '', description: '', imageLocation: '' });
  }

  const handleFileSuccess = ({ key }: { key?: string }) => {
    if (key) {
      setFormData({...formData, imageLocation: key});
    } 
  };

  return (
    ...
      <StorageManager
          ...
          onUploadSuccess={handleFileSuccess} 
        />
      ...
    </div>
  );
}
```

In order to save this you will need to update your data model with the following in `amplify/data/resource.ts`.

```js
const schema = a.schema({
  Note: a
    .model({
      name: a.string(),
      description: a.string(),
      imageLocation: a.string()
    })
    .authorization((allow) => [allow.publicApiKey()]),
});
```

Now let's display the image in the `NoteList` component.

```js
...
import { StorageImage } from '@aws-amplify/ui-react-storage';

export default function NoteList() {
  ...

  return (
    <div data-testid="note-list">
      {notes.map((note, index) => (
        <div key={index}>
          <p data-testid={`test-name-${index}`}>{note.name}</p>
          <p data-testid={`test-description-${index}`}>{note.description}</p>
          {note.imageLocation && (<StorageImage
            data-testid={`note-image-${index}`}
            alt={`note image ${index}`}
            path={`${note.imageLocation}`}
          />)}
          <button
            type="button"
            data-testid={`test-delete-button-${index}`}
            onClick={() => deleteNote(note.id)}>
            Delete note
          </button>
        </div>
      ))}
    </div>
  );
}
```
- By adding `{note.imageLocation && (<StorageImage...` the image is only rendered if an `imageLocation` was saved for that note.

Now let's add a low level test.

- Before we write the test we need a hidden input field that will capture the path of our image so we can assert that the `setFormData` hook was called.  Add the following to the `NoteForm`.

```js
...

export default function NoteForm() {
  ...
  return (
    <div data-testid="note-form">
      ...
      <StorageManager
          ...
        />
      <input
        type="hidden"
        data-testid="hidden-image-location"
        value={formData.imageLocation}
      />
      <button
        ...
      >
        Create Note
      </button>
    </div>
  );
}
```

Now let's add a test case to the `noteForm.test.tsx`

```js
...

interface StorageManagerProps {
  onUploadSuccess: (result: { key?: string }) => void;
  path: (params: { identityId: string }) => string;
}

jest.mock('@aws-amplify/ui-react-storage', () => ({
  StorageManager: ({ onUploadSuccess, path }: StorageManagerProps) => {
    const simulateSuccess = () => {
      onUploadSuccess({ key: 'mockImageKey' });
    };

    if (typeof path === 'function') {
      var generatedPath = path({ identityId: 'testIdentityId' });
      expect(generatedPath).toBe('images/testIdentityId/');
    }

    return <button onClick={simulateSuccess}>Simulate Upload Success</button>;
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  render(<NoteForm />);
});

...

test('should update imageLocation state on file upload success', () => {
  const nameInput = screen.getByTestId('note-name-field');
  fireEvent.change(nameInput, {
    target: { value: 'test name' }
  });

  const descriptionInput = screen.getByTestId('note-description-field');
  fireEvent.change(descriptionInput, {
    target: { value: 'test description' }
  });

  fireEvent.click(screen.getByText('Simulate Upload Success'));

  expect(screen.getByTestId('hidden-image-location').value).toBe('mockImageKey');
});
```
> Testing third-party components and libraries directly is usually unnecessary since their maintainers are responsible for their correctness and provide their own tests. Instead, you should focus on testing how your code interacts with these components/libraries using mocks or stubs to keep your tests simpler and more focused.

- The `jest.mock('@aws-amplify/ui-react-storage'...` captures the `onUploadSuccess` and `path` parameters passed to the mock component.  
- The `simulateSuccess` function calls the callback function that is passed to the mock component when the `<button onClick={simulateSuccess}>Simulate Upload Success</button>` button is clicked.  This fires the `handleFileSuccess` callback function in our code.
- The `expect(screen.getByTestId('hidden-image-location').value).toBe('mockImageKey');` verifies that the callback was fired when the mock `StorageManager` button was clicked.
- The `expect(generatedPath).toBe('images/testIdentityId/');` verifies that the path callback function was registered on the path property of the mock `StorageManager` component.

- Run all the tests
- Green
- Commit

Demonstrate this new ability to delete notes to the customer.  If they accept this story then move it to `Done`.  If they request any changes, leave it `In Progress` and keep working on it.  Once they accept the story, move it to `Done` and move the next highest story from the `Todo` column to the `In Progress` column.

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/015-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/017-step)
