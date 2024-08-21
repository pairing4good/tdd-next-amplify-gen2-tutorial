# TDD AWS Amplify Next App - Step 12

## Add Authentication

- Run `npm install @aws-amplify/ui-react`

- Add the following just under the imports in the `src/app/layout.tsx` file

```js
...
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);
```

- Add the following to the `App` component

```js
"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
...

export default function App() {
  ...

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <button onClick={signOut}>Sign out</button>
          ...
        </>
      )}
    </Authenticator>
  );
}
```

- Run `npm run dev`

- Open http://localhost:3000
- Click the `Create account` link
- Create and Verify your new account
- Login to your App

- Run all your tests
- While the non-UI tests pass, the Cypress tests are **Red**.

### Cypress Login

The Cypress tests now need to log in to the notes app.

- Run `npm install cypress-localstorage-commands`
- Add the following to the bottom of the `cypress/support/commands.js` file

```js
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */

import 'cypress-localstorage-commands';

const { Auth } = require('aws-amplify');

const username = Cypress.env('username');
const password = Cypress.env('password');
const userPoolId = Cypress.env('userPoolId');
const clientId = Cypress.env('clientId');

const awsconfig = {
  aws_user_pools_id: userPoolId,
  aws_user_pools_web_client_id: clientId
};

Auth.configure(awsconfig);

Cypress.Commands.add('signIn', () => {
  cy.then(() => Auth.signIn(username, password)).then((cognitoUser) => {
    const idToken = cognitoUser.signInUserSession.idToken.jwtToken;
    const accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;

    const makeKey = (name) => `CognitoIdentityServiceProvider
        .${cognitoUser.pool.clientId}
        .${cognitoUser.username}.${name}`;

    cy.setLocalStorage(makeKey('accessToken'), accessToken);
    cy.setLocalStorage(makeKey('idToken'), idToken);
    cy.setLocalStorage(
      `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
      cognitoUser.username
    );
  });
  cy.saveLocalStorage();
});
```

- Create a new file at the root of your project named `cypress.env.json` with the following content

```json
{
  "username": "[Login username you just created]",
  "password": "[Login password you just created]",
  "userPoolId": "[The `aws_user_pools_id` value found in your `src/aws-exports.js`]",
  "clientId": "[The `aws_user_pools_web_client_id` value found in your `src/aws-exports.js`]"
}
```

- Update the `cypress.env.json` values with your own values.
- Add the `cypress.env.json` to `.gitignore` so that it will not be committed and pushed to GitHub

```
...
# cypress
cypress/screenshots
cypress/videos
cypress.env.json
...
```

- Add the following setups and teardowns to `cypress/integration/note.cy.js`

```js
before(() => {
  cy.signIn();
});

after(() => {
  cy.clearLocalStorageSnapshot();
  cy.clearLocalStorage();
  localForage.clear();
});

beforeEach(() => {
  cy.restoreLocalStorage();
  cy.visit('/');
});

afterEach(() => {
  cy.saveLocalStorage();
});
```

- Rerun all of your tests.
- Green!
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/011-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/013-step)
