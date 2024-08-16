beforeEach(() => {
  cy.visit('/');
});

describe('React App', () => {
  it("should contain 'TDD Next Template' text", () => {
    cy.contains(/TDD Next Template/i);
  });
});