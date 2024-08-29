before(() => {
  cy.signIn();
});

beforeEach(() => {
  cy.deleteAllNotes();
  cy.restoreLocalStorage();
  cy.visit("/");
});

after(() => {
  cy.clearLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

describe("Note Capture", () => {
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

  it("should load previously saved notes on browser refresh", () => {
    cy.get("[data-testid=note-name-field]").type("test note 2");
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

  it('should delete note', () => {
    cy.get("[data-testid=note-name-field]").type("test note 3");
    cy.get("[data-testid=note-description-field]").type("test note description 3");
    cy.get("[data-testid=note-form-submit]").click();

    cy.get('[data-testid=test-delete-button-0]').click();
  
    cy.get('[data-testid=test-name-0]').should('not.exist');
    cy.get('[data-testid=test-description-0]').should('not.exist');
  });

  it('should have an option to sign out', () => {
    cy.get('[data-testid=sign-out]').click();
    cy.get('[data-amplify-authenticator]').should('exist');
  });
});
