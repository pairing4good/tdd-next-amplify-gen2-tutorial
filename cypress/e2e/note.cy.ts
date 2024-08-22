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

describe("Note Capture", () => {
  it("should create a note when name and description provided", () => {
    cy.get("[data-testid=test-name-0]").should("not.exist");
    cy.get("[data-testid=test-description-0]").should("not.exist");

    cy.get("[data-testid=note-name-field]").should('exist').type("test note");
    cy.get("[data-testid=note-description-field]").type("test note description");
    cy.get("[data-testid=note-form-submit]").click();

    cy.get("[data-testid=note-name-field]").should("have.value", "");
    cy.get("[data-testid=note-description-field]").should("have.value", "");

    cy.get("[data-testid=test-name-0]").should("have.text", "test note");
    cy.get("[data-testid=test-description-0]").should("have.text", "test note description");
  });

  it("should load previously saved notes on browser refresh", () => {
    cy.get("[data-testid=note-name-field]").should('exist').type("test note 2");
    cy.get("[data-testid=note-description-field]").type("test note description 2");
    cy.get("[data-testid=note-form-submit]").click();
  
  
    cy.get("[data-testid=test-name-0]").should("have.text", "test note 2");
    cy.get("[data-testid=test-description-0]").should("have.text", "test note description 2");
  
    cy.reload();
  
    cy.get("[data-testid=test-name-0]").should("have.text", "test note 2");
    cy.get("[data-testid=test-description-0]").should("have.text", "test note description 2");
  });
  
  it("should have header", () => {
    cy.get("h1").should("have.text", "My Notes App");
  });
});
