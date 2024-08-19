# TDD AWS Amplify Next App - Step 8

## Demo Your Application To Your Customer

Be sure to start up your application and walk through it with your customers. When I was doing this, I noticed that the form is not resetting after a note is created. This is very annoying. In order to test drive this behavior I will add two additional assertions to the end of the UI test to verify that the form is reset.

```js
describe('Note Capture', () => {
  it('should create a note when name and description provided', () => {
    ...
    cy.get('[data-testid=note-form-submit]').click();

    cy.get('[data-testid=note-name-field]').should('have.value', '');
    cy.get('[data-testid=note-description-field]').should('have.value', '');

    cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
    ...
  });

  ...
});
```

- This test now fails with

```
get [data-testid=note-name-field]
assert expected <input> to have value '', but the value was test note
```

- To make this pass we need to connect the name and description fields to the form data in `NoteForm.js`

```js
<input
  data-testid="note-name-field"
  ...
  value={formData.name}
  ...
/>
<input
  data-testid="note-description-field"
  ...
  value={formData.description}
  ...
/>
```

- Green! Commit!

[<kbd> Previous Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/007-step)&ensp;&ensp;&ensp;&ensp;[<kbd> Next Step </kbd>](https://github.com/pairing4good/tdd-next-amplify-gen2-tutorial/tree/009-step)
