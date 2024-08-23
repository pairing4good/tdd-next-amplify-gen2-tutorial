import { AuthUser } from "aws-amplify/auth";

interface Parameters {
  signOut: ((data?: any) => void) | undefined;
  user: AuthUser | undefined;
}

export default function Header({
  signOut, user
}: Parameters) {

  return (
    <div>
      <div>
        <span data-testid="username-greeting">Hello {user?.signInDetails?.loginId} &nbsp;</span>
        <button data-testid="sign-out" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
      <h1>My Notes App</h1>
    </div>
  );
}