# TDD AWS Amplify Next App - Step 13

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
    .authorization((allow) => [allow.guest()]),
});
...
```

`.authorization((allow) => [allow.guest()])` allows you to get started quickly without worrying about authorization rules. Review the [Customize your auth rules](https://docs.amplify.aws/javascript/build-a-backend/data/customize-authz/) page to setup the appropriate access control for your GraphQL API. (https://en.wikipedia.org/wiki/GraphQL)

- Commit and push you changes to GitHub to deploy your changes

- If you would like to explore the backend, take a look at [Amplify Studio](https://docs.amplify.aws/nextjs/build-a-backend/data/manage-with-amplify-console/).

### Cut Over Repository To Use GraphQL

Now that we have a GraphQL API that is storing our notes in a [DynamoDB](https://aws.amazon.com/dynamodb) table, we can replace `localStorage` calls with GraphQL API calls.

- Replace `localStorage` calls in the `noteRepository` with GraphQL API calls

```js
import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation } from './graphql/mutations';

export async function findAll() {
  const apiData = await API.graphql({ query: listNotes });
  return apiData.data.listNotes.items;
}

export async function save(note) {
  const apiData = await API.graphql({
    query: createNoteMutation,
    variables: { input: note }
  });
  return apiData.data.createNote;
}
```

- We do need to call the `save` function first in the `createNote` callback function in the `App` component because when [GraphQL](https://graphql.org/) saves a note, it generates a unique `ID` that we want to have access to in our `note` array.

```js
const createNote = async () => {
  const newNote = await save(formData);
  const updatedNoteList = [...notes, newNote];
  setNotes(updatedNoteList);
};
```

- The final place that we need to remove `localforage` is in the `note.cy.js` Cypress test. GraphQL does not provide an equivalent API endpoint to delete all of the notes so we will not be able to simply replace the `localforage.clear()` function call with a GraphQL one. In a separate commit we will add the ability to delete notes by `ID` through the UI. This is a [mutation](https://graphql.org/learn/queries/#mutations) that GraphQL provides. But for now we will just remove the clean up in the Cypress test.

```js
describe('Note Capture', () => {
  before(() => {
      cy.signIn();
  });

  after(() => {
      cy.clearLocalStorageSnapshot();
      cy.clearLocalStorage();
  });
  ...
```

- Finally remove `localforage` by running `npm uninstall localforage`

- Rerun all of the tests
- Green!
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/013-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/015-step)
