# TDD AWS Amplify Next App - Step 13

## Log Out

While users can now log into the notes application they can't log back out.

- Add a Cypress test that will drive the production code changes

```js
it('should have an option to sign out', () => {
  cy.get('[data-testid=sign-out]').click();
  cy.get('[data-amplify-authenticator]').should('exist');
});
```

- Run all the tests
- Red

- Add the following [properties](https://reactjs.org/docs/components-and-props.html) to the `App` component that come from the [Authenticator](https://ui.docs.amplify.aws/react/connected-components/authenticator#3-add-the-authenticator). Pass the `signOut` and `user` properties to the `Header` component.

```js
<Authenticator>
  {({ signOut, user }) => (
    <div className="App">
      <Header signOut={signOut} user={user} />
      ...
    </div>
  )}
</Authenticator>
```

- Test drive the `header.js` component by adding the following to the `src/__test__/app/header.test.js` file

```js
import { render, screen } from '@testing-library/react';
import Header from '../../app/header';

const signOut = jest.fn();
const user = { username: 'testUserName' };

beforeEach(() => {
  render(<Header signOut={signOut} user={user} />);
});

test('should display header', () => {
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent('My Notes App');
});

test('should display username', () => {
  const greeting = screen.getByTestId('username-greeting');
  expect(greeting).toHaveTextContent('Hello testUserName');
});

test('should display sign out', () => {
  const signOutButton = screen.getByTestId('sign-out');
  expect(signOutButton).toHaveTextContent('Sign out');
});
```

- Add the following to the `header.js` component

```js
interface Parameters {
  signOut: ((data?: AuthEventData) => void);
  user: AuthUser;
}

export default function Header({
  signOut, user
}: Parameters) {

  return (
    <div>
      <div>
        <span data-testid="username-greeting">Hello {user.username} &nbsp;</span>
        <button data-testid="sign-out" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
      <h1>My Notes App</h1>
    </div>
  );
}
```

- Run all the tests
- Green!
- Commit

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/012-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/014-step)
