import 'cypress-localstorage-commands';
import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn } from "aws-amplify/auth";
import outputs from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource"
import { generateClient } from "aws-amplify/data";

Amplify.configure(outputs);
const client = generateClient<Schema>();


Cypress.Commands.add('signIn', () => { 
    const username = "pairing4good@gmail.com";
    const password = "Pairing4good@"
    const userPoolClientId = outputs.auth.user_pool_client_id;
    const keyPrefix = `CognitoIdentityServiceProvider.${userPoolClientId}`;
    
    cy.wrap(signIn({ username, password}))
        .then((_signInOutput) => fetchAuthSession())
        .then((authSession) => {
            const idToken = authSession.tokens?.idToken?.toString() || ''
            const accessToken = authSession.tokens?.accessToken.toString() || ''
            
            cy.setLocalStorage(`${keyPrefix}.${username}.accessToken`, accessToken);
            cy.setLocalStorage(`${keyPrefix}.${username}.idToken`, idToken);
            cy.setLocalStorage(`CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`, username);
            cy.saveLocalStorage();
        });
 })

 Cypress.Commands.add('deleteAllNotes', () => { 
  client.models.Note.list().then( notes => {
    notes.data.map( note => {
      client.models.Note.delete(note);
    })
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
        signIn(): Chainable<void>,
        deleteAllNotes(): Chainable<void>
    }
  }
}