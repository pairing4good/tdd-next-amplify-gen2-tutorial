# TDD AWS Amplify Next App - Step 12

## Add Authentication

- Run `npm install @aws-amplify/ui-react`

- Add the following just under the imports in the `src/app/layout.tsx` file

```js
"use client";

import Header from "./header";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Authenticator>
          {({ signOut, user }) => (
            <>
              <button onClick={signOut}>Sign out</button>
              <main>{children}</main>
            </>
          )}
        </Authenticator>
      </body>
    </html>
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
- Add the following to the `cypress/support/commands.js` file

```js
import 'cypress-localstorage-commands';
import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn } from "aws-amplify/auth";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);


Cypress.Commands.add('signIn', () => { 
    const username = "pairing4good@gmail.com";
    const userPoolClientId = outputs.auth.user_pool_client_id;
    signIn({username, password: "Pairing4good@"})
        .then((_signInOutput) => fetchAuthSession())
        .then((authSession) => {
            const idToken = authSession.tokens?.idToken?.toString() || ''
            const accessToken = authSession.tokens?.accessToken.toString() || ''
            const keyPrefix = `CognitoIdentityServiceProvider.${userPoolClientId}`;
            
            cy.setLocalStorage(`${keyPrefix}.${username}.accessToken`, accessToken);
            cy.setLocalStorage(`${keyPrefix}.${username}.idToken`, idToken);
            cy.setLocalStorage(`CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`, username);
        })
        .catch((err) => console.log(err));
    cy.saveLocalStorage();
 })

declare global {
  namespace Cypress {
    interface Chainable {
        signIn(): Chainable<void>
    }
  }
}
```

- Add the following setups and teardowns to `cypress/integration/note.cy.js`

```js
before(() => {
  cy.signIn();
});

beforeEach(() => {
  cy.restoreLocalStorage();
  cy.visit("/");
});

after(() => {
  cy.clearLocalStorage();
});

afterEach(() => {
  cy.clearLocalStorage('notes');
  cy.saveLocalStorage();
});
```

- Rerun all of your tests.
- Green!
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/011-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/013-step)
