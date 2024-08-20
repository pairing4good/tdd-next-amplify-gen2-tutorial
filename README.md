# TDD AWS Amplify React App - Step 1

![Security Checks](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/actions/workflows/codeql-analysis.yml/badge.svg)
![Linting Checks](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/actions/workflows/linting.yml/badge.svg)
![React Tests](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/actions/workflows/node.js.yml/badge.svg)
![Cypress Tests](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/actions/workflows/cypress.yml/badge.svg)

In this tutorial we will [test drive](https://en.wikipedia.org/wiki/Test-driven_development) a [React](https://reactjs.org/) app which will use [AWS Amplify](https://aws.amazon.com/amplify) to set up authentication and the backend API.
 
## Approach
Test driving an application often starts at the bottom of the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html) in [unit tests](https://en.wikipedia.org/wiki/Unit_testing). Unit tests focus on testing small units of code in isolation. However, this tutorial will start at the top of the pyramid with user interface (UI) testing. This approach is often called [Acceptance Test Driven Development](https://en.wikipedia.org/wiki/Acceptance_test%E2%80%93driven_development) (ATDD).

There are a few benefits of starting at the top of the testing pyramid:

1. Quick Feedback: Demonstrate a working system to the customer faster
1. Customer Focus: Low level code clearly ties to high level customer value
1. System Focus: The architecture evolves and expands on green.

  
## Set Up

- Download and install [Visual Studio Code](https://code.visualstudio.com/)
- Open VS Code and set up the ability to [launch VS Code from the terminal](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)
- Install [Node Version Manager](https://github.com/nvm-sh/nvm). `nvm` allows you to quickly install and use different versions of node via the command line.
- Run `nvm install node` to install the latest version of node
- Run `nvm use node` to use the latest version of node

- If you haven't already, [create](https://docs.github.com/en/github/getting-started-with-github/signing-up-for-github/signing-up-for-a-new-github-account) a GitHub account

- Use the [pairing4good/tdd-next-template](https://github.com/pairing4good/tdd-next-template) template.

- Click the `Use this template` button on the top right of [pairing4good/tdd-next-template](https://github.com/pairing4good/tdd-next-template)
- Click on `Settings > Code security and analysis` on your new repository
  - Enable `Dependabot alerts`
  - Enable `Dependabot security updates`
- Update badges at the top of the `README.md` to point to your new repositories GitHub Action results

```
![Security Checks](https://github.com/{username}/{repository}/actions/workflows/codeql-analysis.yml/badge.svg)
![React Tests](https://github.com/{username}/{repository}/actions/workflows/node.js.yml/badge.svg)
![Cypress Tests](https://github.com/{username}/{repository}/actions/workflows/cypress.yml/badge.svg)
```

- Update the `name` of your application in the `package.json` file in the root of your repository

- [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) your new repository

 
## Big & Visible Progress

Create a new [Project](https://docs.github.com/en/issues/planning-and-tracking-with-projects/creating-projects/creating-a-project) and [add it to your repository](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/adding-your-project-to-a-repository).  Select the `Board` [layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/quickstart-for-projects#adding-a-board-layout).  As you add stories,  each story will be moved across the board from `ToDo` to `In Progress` to `Done`.  We show this progress so that anyone inside or outside the team can quickly see the progress that we are making.
 
## README
The `README.md` file is the first thing anyone sees when they open this repository.  It's important to update your readme to include the following:
 1. Title
 1. Description of your product
 1. Install and run instructions
 

## First Test

### Why: User Story

```
As a team member
I want to capture a note
So that I can refer back to it later
```

### What: User Acceptance Criteria

```
Given that no notes are entered
When nothing is saved
Then no notes should be listed
```

```
Given that one note exists
When a note is saved
Then two notes should be listed
```

```
Given a note exists
When the application is opened
Then a note is listed
```
 
### Add Story to Kanban Board
Add this story to your [Kanban board](https://en.wikipedia.org/wiki/Kanban).  
- Click the `+ Add item` link at the bottom of the `Todo` column
- Enter the short description of `Capture Note`
- Type `Enter`
- Click on the story name `Capture Note`
- Click the `Edit` link within the `description` section
- Add the `As a`, `I want`, `So that` user story above
- After the user story add an acceptance criteria section with the heading `Acceptance Criteria:`
- Below that title add the `Given`, `When`, `Then` criteria
- Click the `Update comment` button
- Click the `x` button on the top right
- Drag this new story from the `Todo` column into the `In Progress` column
 
 This provides big and visible progress for everyone inside and outside the team.  Teams meet around this board [daily](https://en.wikipedia.org/wiki/Stand-up_meeting#Three_questions) to align, formulate a plan for the day, and make any impediments big and visible.

### Red - Acceptance Test

The user story and acceptance criteria above describe a desired customer outcome. The user acceptance test will link this narrative with a high level how. For this tutorial our first application will be a [web application](https://en.wikipedia.org/wiki/Web_application) built with [React](https://reactjs.org). The testing framework use to test this will be [Cypress](https://www.cypress.io)

- Rename `cypress/e2e/app.cy.js` to `cypress/e2e/note.cy.js`
- Open the `cypress/e2e/note.cy.js` file
- Replace the contents of this file with the following

```js
beforeEach(() => {
  cy.visit('/');
});

describe('Note Capture', () => {
  it('should create a note when name and description provided', () => {
    cy.get('[data-testid=note-name-field]').type('test note');
    cy.get('[data-testid=note-description-field]').type('test note description');
    cy.get('[data-testid=note-form-submit]').click();

    cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
    cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
  });
});
```

- Run `npm install`
- Run `npm run cypress:test`

- These commands are looking for elements on a webpage that contains a `data-testid` attribute with the value that follows the `=`. We now have a failing acceptance test.

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-name-field], but never found it.
```

- Our objective now is to make this test go green (pass) in as few steps as possible. The goal is not to build a perfectly designed application but rather to make this go green and then [refactor](https://en.wikipedia.org/wiki/Code_refactoring) the architecture through small incremental steps.

### Green - Acceptance Test

The first step to making this failing test go green is adding an element with one of the `data-testid`'s to the `src/app/page.tsx` file.

```js
export default function App() {
  return (
    <>
      <input data-testid="note-name-field" />
    </>
  );
}
```

- Now the Cypress test fails on the second field

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-description-field], but never found it.
```

- Add the next `input` field and rerun the test
- Now the Cypress test fails on the submit button

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-form-submit], but never found it.
```

- Add the `button` element with the expected `data-testid`

```js
<input data-testid="note-name-field"/>
<input data-testid="note-description-field"/>
<button data-testid="note-form-submit" type="button">
    Submit
</button>
```

- Now the Cypress test fails on the missing list of created notes

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=test-name-0], but never found it.
```

> In test driven development we do the simplest thing possible to make a test go green. Once it is green then and only then do we go back and refactor it. 

In this case, the simplest thing that we can do is hard-code the expected values on the screen.

```js
<input data-testid="note-name-field"/>
<input data-testid="note-description-field"/>
<button data-testid="note-form-submit" type="button">
    Submit
</button>
<p data-testid="test-name-0">test note</p>
```

- Now the Cypress test fails on the note description

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=test-description-0], but never found it.
```

- Add the final element for `test-description-0`

```js
export default function App() {
  return (
    <>
      <input data-testid="note-name-field" />
      <input data-testid="note-description-field" />
      <button data-testid="note-form-submit" type="button">
        Submit
      </button>
      <p data-testid="test-name-0">test note</p>
      <p data-testid="test-description-0">test note description</p>
    </>
  );
}
```

- While this is far from a useful application, this application can be:
  1. refactored on green
  2. used to get feedback from the customer

### Refactor - Acceptance Test

> Refactoring is a disciplined technique for restructuring an existing body of code, altering its internal structure without changing its external behavior. - Martin Fowler

The key to refactoring is to not change its "external behavior". In other words, after every change we make the test must remain green.

One "internal structure" change that could help, is pulling this form out into a [react component](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy) so that we can drive these changes independently. Eventually `src/app/page.tsx` will have several components:

```js
<>
  <Header />
  <NoteForm />
  <NoteList />
  <Footer />
</>
```

So let's pull out a `NoteForm` component.

- Create a new file called `noteForm.tsx` in the `src/app` directory

```js
export default function NoteForm() {
  return <>//your form goes here</>;
}
```

- This is a [React functional component](https://reactjs.org/docs/components-and-props.html#function-and-class-components)
- The `export default` is the way to [export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) only one object in [ES6](https://en.wikipedia.org/wiki/ECMAScript)

- Copy the form from `src/app/page.tsx` and paste it into the `<></>` in `NoteForm.js`

```ts
<>
  <input data-testid="note-name-field" />
  <input data-testid="note-description-field" />
  <button data-testid="note-form-submit" type="button">
    Submit
  </button>
  <p data-testid="test-name-0">test note</p>
  <p data-testid="test-description-0">test note description</p>
</>
```

- Replace the form contents in `src/app/page.tsx` with `<NoteForm />` and add an import for the `NoteForm`

```js
import NoteForm from "./noteForm";

export default function App() {
  return <NoteForm/>
}
```

- Rerun you Cypress test and it is green

Congratulations, you've successfully made an internal structural change "without changing its external behavior" (Refactoring).

[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/002-step)
